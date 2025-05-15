'use client';

import { useEffect, useRef, useState } from 'react';
import { useLiveKit } from '@/providers/livekitProvider';

export default function DebugVideoRoom() {
  const { joinRoom, leaveRoom, room } = useLiveKit();
  const [username, setUsername] = useState('');
  const [meetingId, setMeetingId] = useState('');
  const [joined, setJoined] = useState(false);
  const localVideoRef = useRef<HTMLVideoElement>(null);

  const handleJoin = () => {
    if (username && meetingId) {
      joinRoom(meetingId, username);
      setJoined(true);
    }
  };

  const handleLeave = () => {
    leaveRoom();
    setJoined(false);
  };

  useEffect(() => {
    if (room && localVideoRef.current) {
      room.localParticipant.getTrackPublications().forEach((trackPub) => {
        if (trackPub.track && trackPub.kind === 'video') {
          const mediaStream = new MediaStream();
          mediaStream.addTrack(trackPub.track.mediaStreamTrack);
          localVideoRef.current!.srcObject = mediaStream;
        }
      });
    }
  }, [room]);

  return (
    <div className="p-4">
      <h2>Debug Video Room</h2>
      {!joined ? (
        <>
          <input
            placeholder="Username"
            className="border p-2 rounded mb-2 w-full"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
          <input
            placeholder="Meeting ID"
            className="border p-2 rounded mb-2 w-full"
            value={meetingId}
            onChange={(e) => setMeetingId(e.target.value)}
          />
          <button
            onClick={handleJoin}
            className="bg-blue-500 text-white p-2 rounded w-full"
          >
            Join
          </button>
        </>
      ) : (
        <>
          <video ref={localVideoRef} autoPlay muted playsInline className="w-full mb-4" />
          <button
            onClick={handleLeave}
            className="bg-red-500 text-white p-2 rounded w-full"
          >
            Leave
          </button>
        </>
      )}
    </div>
  );
}
