// providers/livekitProvider.tsx
'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { Room, createLocalTracks } from 'livekit-client';

interface LiveKitContextType {
  joinRoom: (roomName: string, identity: string) => Promise<string | null>;
  leaveRoom: () => void;
  room: Room | null;
}

const LiveKitContext = createContext<LiveKitContextType | null>(null);

export const LiveKitProvider = ({ children }: { children: React.ReactNode }) => {
  const [room, setRoom] = useState<Room | null>(null);
  const [token, setToken] = useState<string | null>(null);

  const joinRoom = async (roomName: string, identity: string) => {
    try {
      // console.log('🔗 Fetching token for room:', roomName, 'identity:', identity);
      const res = await fetch(`/api/token?room=${roomName}&identity=${identity}`);
      const data = await res.json();
      if (!data.token) throw new Error("Failed to fetch LiveKit token");

      const newRoom = new Room();
      // console.log('🔗 Connecting to LiveKit server...');
      await newRoom.connect(process.env.NEXT_PUBLIC_LIVEKIT_URL!, data.token);

      // console.log('🎤 Requesting local media tracks...');
      const localTracks = await createLocalTracks({ audio: true, video: true });
      for (const track of localTracks) {
        // console.log('🎤 Publishing track:', track.kind);
        await newRoom.localParticipant.publishTrack(track);
      }

      newRoom.on('participantConnected', (participant) => {
        console.log(`✅ Participant joined: ${participant.identity}`);
      });

      newRoom.on('participantDisconnected', (participant) => {
        console.log(`❌ Participant left: ${participant.identity}`);
      });

      newRoom.on('disconnected', () => {
        console.log("🔌 Disconnected from room");
        setRoom(null);
        setToken(null);
      });

      setRoom(newRoom);
      setToken(data.token);
      console.log('🔗 Joined room successfully.');
      return data.token;
    } catch (error) {
      console.error("❌ Error joining room:", error);
      return null;
    }
  };

  const leaveRoom = () => {
    console.log('🔌 Leaving room...');
    room?.disconnect();
    setRoom(null);
    setToken(null);
  };

  useEffect(() => {
    return () => {
      console.log('🔌 Cleaning up LiveKit connection...');
      room?.disconnect();
    };
  }, [room]);

  return (
    <LiveKitContext.Provider value={{ joinRoom, leaveRoom, room }}>
      {children}
    </LiveKitContext.Provider>
  );
};

export const useLiveKit = () => {
  const ctx = useContext(LiveKitContext);
  if (!ctx) throw new Error('useLiveKit must be used inside <LiveKitProvider>');
  return ctx;
};
