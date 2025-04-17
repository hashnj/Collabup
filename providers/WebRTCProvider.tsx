'use client';

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from 'react';
import { useSocket } from './SocketProvider';
import { PeerData, UserID } from './types';

interface WebRTCContextType {
  localStream: MediaStream | null;
  peers: PeerData[];
  joinRoom: (roomId: string, userId: UserID) => void;
  leaveRoom: () => void;
}

const WebRTCContext = createContext<WebRTCContextType | null>(null);

export const WebRTCProvider = ({ children }: { children: React.ReactNode }) => {
  const socket = useSocket();
  const [localStream, setLocalStream] = useState<MediaStream | null>(null);
  const [peers, setPeers] = useState<PeerData[]>([]);
  const peerConnections = useRef<Map<UserID, RTCPeerConnection>>(new Map());
  const roomRef = useRef<string | null>(null);
  const userIdRef = useRef<UserID | null>(null);

  const config: RTCConfiguration = {
    iceServers: [
      { urls: 'stun:stun.l.google.com:19302' },
      // Add your TURN servers here if needed
    ],
  };

  const createPeer = useCallback(
    (peerId: UserID, createOffer: boolean) => {
      const peer = new RTCPeerConnection(config);
      peerConnections.current.set(peerId, peer);

      if (localStream) {
        localStream.getTracks().forEach((track) => {
          peer.addTrack(track, localStream);
        });
      }

      peer.ontrack = (event) => {
        const remoteStream = event.streams[0];
        setPeers((prev) => {
          const exists = prev.find((p) => p.peerId === peerId);
          if (exists) return prev;
          return [...prev, { peerId, stream: remoteStream }];
        });
      };

      peer.onicecandidate = (event) => {
        if (event.candidate) {
          socket.emit('ice-candidate', {
            target: peerId,
            candidate: event.candidate,
          });
        }
      };

      if (createOffer) {
        peer
          .createOffer()
          .then((offer) => {
            peer.setLocalDescription(offer);
            socket.emit('offer', {
              target: peerId,
              offer,
            });
          });
      }

      return peer;
    },
    [localStream, socket]
  );

  const joinRoom = async (roomId: string, userId: UserID) => {
    roomRef.current = roomId;
    userIdRef.current = userId;

    const stream = await navigator.mediaDevices.getUserMedia({
      video: true,
      audio: true,
    });
    setLocalStream(stream);

    socket.emit('join-room', { roomId, userId });

    socket.on('user-joined', ({ userId: newUserId }) => {
      const peer = createPeer(newUserId, true);
    });

    socket.on('offer', async ({ sender, offer }) => {
      const peer = createPeer(sender, false);
      await peer.setRemoteDescription(new RTCSessionDescription(offer));
      const answer = await peer.createAnswer();
      await peer.setLocalDescription(answer);
      socket.emit('answer', {
        target: sender,
        answer,
      });
    });

    socket.on('answer', async ({ sender, answer }) => {
      const peer = peerConnections.current.get(sender);
      if (!peer) return;
      await peer.setRemoteDescription(new RTCSessionDescription(answer));
    });

    socket.on('ice-candidate', async ({ sender, candidate }) => {
      const peer = peerConnections.current.get(sender);
      if (!peer) return;
      await peer.addIceCandidate(new RTCIceCandidate(candidate));
    });

    socket.on('user-left', ({ userId: leavingId }) => {
      const peer = peerConnections.current.get(leavingId);
      if (peer) peer.close();
      peerConnections.current.delete(leavingId);
      setPeers((prev) => prev.filter((p) => p.peerId !== leavingId));
    });
  };

  const leaveRoom = () => {
    const userId = userIdRef.current;
    const roomId = roomRef.current;

    if (userId && roomId) {
      socket.emit('leave-room', { roomId, userId });
    }

    peerConnections.current.forEach((peer) => peer.close());
    peerConnections.current.clear();
    setPeers([]);
    setLocalStream(null);
  };

  useEffect(() => {
    return () => {
      leaveRoom();
    };
  }, []);

  return (
    <WebRTCContext.Provider value={{ localStream, peers, joinRoom, leaveRoom }}>
      {children}
    </WebRTCContext.Provider>
  );
};

export const useWebRTC = () => {
  const ctx = useContext(WebRTCContext);
  if (!ctx) throw new Error('useWebRTC must be used inside <WebRTCProvider>');
  return ctx;
};
