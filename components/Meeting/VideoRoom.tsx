'use client';

import { useEffect, useRef } from 'react';
import { useWebRTC } from '@/providers/WebRTCProvider';
import { v4 as uuidv4 } from 'uuid';

export default function VideoRoom() {
  const { localStream, peers, joinRoom, leaveRoom } = useWebRTC();
  const roomId = 'main-room';
  const userId = useRef(uuidv4());

  useEffect(() => {
    joinRoom(roomId, userId.current);

    return () => {
      leaveRoom();
    };
  }, []);

  return (
    <div className="p-4 grid grid-cols-2 gap-4">
      {/* Local Video */}
      {localStream && (
        <video
          className="w-full h-auto rounded-xl border shadow"
          ref={(video) => {
            if (video) {
              video.srcObject = localStream;
              video.muted = true;
              video.play();
            }
          }}
          autoPlay
        />
      )}

      {peers.map(({ peerId, stream }) => (
        <video
          key={peerId}
          className="w-full h-auto rounded-xl border shadow"
          ref={(video) => {
            if (video) {
              video.srcObject = stream;
              video.play();
            }
          }}
          autoPlay
        />
      ))}
    </div>
  );
}
