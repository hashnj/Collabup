'use client';

import { createContext, useContext, useEffect, useState } from 'react';
import DailyIframe, { DailyCall } from '@daily-co/daily-js';

interface WebRTCContextType {
  joinRoom: (roomUrl: string) => void;
  leaveRoom: () => void;
  localStream: MediaStream | null;
  remoteStreams: MediaStream[];
}

const WebRTCContext = createContext<WebRTCContextType | null>(null);

let callObject: DailyCall | null = null; // Singleton instance

export const WebRTCProvider = ({ children }: { children: React.ReactNode }) => {
  const [localStream, setLocalStream] = useState<MediaStream | null>(null);
  const [remoteStreams, setRemoteStreams] = useState<MediaStream[]>([]);

  const joinRoom = async (roomUrl: string) => {
    if (!roomUrl) return;
    if (callObject) return; // Prevent duplicate instances

    callObject = DailyIframe.createCallObject();

    await callObject.join({ url: roomUrl });

    callObject.on('track-started', (event) => {
      if (event.participant && event.participant.local) {
        const localStream = new MediaStream([event.track]);
        setLocalStream(localStream);
      } else {
        const remoteStream = new MediaStream([event.track]);
        setRemoteStreams((prev) => [...prev, remoteStream]);
      }
    });

    callObject.on('participant-left', (event) => {
      setRemoteStreams((prev) =>
        prev.filter((stream) => stream.id !== event.participant.user_id)
      );
    });
  };

  const leaveRoom = () => {
    if (callObject) {
      callObject.leave();
      callObject.destroy();
      callObject = null;
      setLocalStream(null);
      setRemoteStreams([]);
    }
  };

  useEffect(() => {
    return () => leaveRoom(); // Cleanup on unmount
  }, []);

  return (
    <WebRTCContext.Provider value={{ joinRoom, leaveRoom, localStream, remoteStreams }}>
      {children}
    </WebRTCContext.Provider>
  );
};

export const useWebRTC = () => {
  const ctx = useContext(WebRTCContext);
  if (!ctx) throw new Error('useWebRTC must be used inside <WebRTCProvider>');
  return ctx;
};
