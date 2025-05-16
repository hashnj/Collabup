'use client';

import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { useLiveKit } from '@/providers/livekitProvider';
import { LiveKitRoom, VideoTrack, useTracks } from '@livekit/components-react';
import { Track, LocalParticipant, Room, LocalTrack } from 'livekit-client';
import { Mic, Video, LogOut, ScreenShare, Users, PenBox, Code, File, Settings } from 'lucide-react';
import { toast } from 'sonner';
import Whiteboard from '@/components/Meeting/Whiteboard';
import CodeEditor from '@/components/Meeting/CodeEditor';

const MeetingRoom = () => {
  const { joinRoom, leaveRoom, room } = useLiveKit();
  const [token, setToken] = useState<string | null>(null);
  const [micEnabled, setMicEnabled] = useState(true);
  const [videoEnabled, setVideoEnabled] = useState(true);
  const [isSharing, setIsSharing] = useState(false);
  const [participants, setParticipants] = useState<string[]>([]);
  const [whiteboardVisible, setWhiteboardVisible] = useState(false);
  const [codeEditorVisible, setCodeEditorVisible] = useState(false);
  const [showParticipants, setShowParticipants] = useState(false);
  const router = useRouter();
  const params = useParams();
  const meetingid = params?.meetingId;

  useEffect(() => {
    if (meetingid) {
      joinRoom(meetingid as string, 'guest').then((tk) => {
        if (tk) setToken(tk);
      });
    }
    return () => leaveRoom();
  }, [meetingid]);

  useEffect(() => {
    if (room) {
      updateParticipants(room);
      room.on('participantConnected', (participant) => {
        toast.success(`${participant.identity} joined the room`);
        updateParticipants(room);
      });
      room.on('participantDisconnected', (participant) => {
        toast(`${participant.identity} left the room`);
        updateParticipants(room);
      });
    }
  }, [room]);

  const updateParticipants = (room: Room) => {
    const allParticipants = [room.localParticipant.identity, ...Array.from(room.remoteParticipants.values()).map((p) => p.identity)];
    setParticipants(allParticipants);
  };

  const toggleMic = () => {
    const localParticipant = room?.localParticipant as LocalParticipant;
    if (!localParticipant) return;

    const audioTrack = localParticipant.getTrackPublication(Track.Source.Microphone)?.track;
    if (audioTrack) {
      micEnabled ? audioTrack.mute() : audioTrack.unmute();
      setMicEnabled(!micEnabled);
    }
  };

  const toggleVideo = () => {
    const localParticipant = room?.localParticipant as LocalParticipant;
    if (!localParticipant) return;

    const videoTrack = localParticipant.getTrackPublication(Track.Source.Camera)?.track;
    if (videoTrack) {
      videoEnabled ? videoTrack.mute() : videoTrack.unmute();
      setVideoEnabled(!videoEnabled);
    }
  };

  const toggleScreenShare = async () => {
    try {
      const localParticipant = room?.localParticipant as LocalParticipant;
      if (!localParticipant) return;

      if (isSharing) {
        localParticipant.getTrackPublications().forEach((trackPublication) => {
          if (trackPublication.track && trackPublication.track.source === Track.Source.ScreenShare) {
            trackPublication.track.stop();
            localParticipant.unpublishTrack(trackPublication.track as LocalTrack);
          }
        });
        setIsSharing(false);
      } else {
        const stream = await navigator.mediaDevices.getDisplayMedia({ video: true, audio: true });
        const screenTrack = stream.getVideoTracks()[0];
        if (screenTrack) {
          await localParticipant.publishTrack(screenTrack, {
            source: Track.Source.ScreenShare,
            simulcast: true,
          });
          screenTrack.onended = () => toggleScreenShare();
          setIsSharing(true);
        }
      }
    } catch (error) {
      console.error("Failed to share screen:", error);
    }
  };

  const leaveMeeting = () => {
    leaveRoom();
    router.push('/');
  };

  if (!room || !token) return <div>Loading...</div>;

  return (
    <main className="flex h-screen bg-gray-900 text-white">
      <div className="flex-grow flex flex-col">
        <header className="flex justify-between items-center bg-gray-800 p-4">
          <h2 className="text-lg">Room: {meetingid}</h2>
          <button onClick={leaveMeeting} className="bg-red-500 px-4 py-2 rounded-md">Leave</button>
        </header>

        <div className="flex-grow bg-gray-900 overflow-y-auto">
          <LiveKitRoom room={room} serverUrl={process.env.NEXT_PUBLIC_LIVEKIT_URL!} token={token}>
            <div className="grid gap-4 p-4 grid-cols-1 sm:grid-cols-2">
              <VideoGrid />
            </div>
          </LiveKitRoom>
        </div>

        <footer className="flex justify-center gap-4 bg-gray-800 p-4">
          <ControlButton icon={Mic} onClick={toggleMic} active={micEnabled} />
          <ControlButton icon={Video} onClick={toggleVideo} active={videoEnabled} />
          <ControlButton icon={ScreenShare} onClick={toggleScreenShare} active={isSharing} />
          <ControlButton icon={PenBox} onClick={() => setWhiteboardVisible(!whiteboardVisible)} active={whiteboardVisible} />
          <ControlButton icon={Code} onClick={() => setCodeEditorVisible(!codeEditorVisible)} active={codeEditorVisible} />
          <ControlButton icon={Users} onClick={() => setShowParticipants(!showParticipants)} active={showParticipants} />
          <ControlButton icon={File} onClick={() => toast("File sharing not implemented yet")} />
          <ControlButton icon={Settings} onClick={() => toast("Settings not implemented yet")} />
        </footer>
      </div>
    </main>
  );
};

const ControlButton = ({ icon: Icon, onClick, active = true }: { icon: React.ComponentType<{ className: string }>; onClick: () => void; active?: boolean }) => (
  <button
    onClick={onClick}
    className={`flex items-center justify-center w-12 h-12 rounded-full transition-all ${
      active ? "bg-gray-700 hover:bg-gray-600 text-white" : "bg-gray-500 hover:bg-gray-400 text-gray-300"
    }`}
  >
    <Icon className="w-6 h-6" />
  </button>
);

const VideoGrid = () => {
  const trackRefs = useTracks([Track.Source.Camera]);

  return (
    <>
      {trackRefs.map((trackRef) => (
        <VideoTrack
          key={trackRef.publication.trackSid}
          trackRef={trackRef}
          className="w-full h-full bg-gray-700 rounded-lg shadow-lg"
          style={{ transform: 'scaleX(-1)' }}
        />
      ))}
    </>
  );
};

export default MeetingRoom;
