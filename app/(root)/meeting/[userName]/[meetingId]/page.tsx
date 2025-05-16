'use client';

import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { useLiveKit } from '@/providers/livekitProvider';
import { LiveKitRoom, VideoTrack, useTracks } from '@livekit/components-react';
import { Track, LocalParticipant, Room, LocalTrack } from 'livekit-client';
import { Mic, Video, Users, LogOut, File, Code, Settings, ScreenShare, PenBox } from 'lucide-react';
import { toast } from 'sonner';
import Whiteboard from '@/components/Meeting/Whiteboard';
import CodeEditor from '@/components/Meeting/CodeEditor';

const MeetingRoom = () => {
  const { joinRoom, leaveRoom, room } = useLiveKit();
  const [token, setToken] = useState<string | null>(null);
  const [micEnabled, setMicEnabled] = useState(true);
  const [videoEnabled, setVideoEnabled] = useState(true);
  const [isSharing, setIsSharing] = useState(false);
  const [showParticipants, setShowParticipants] = useState(false);
  const [whiteboardVisible, setWhiteboardVisible] = useState(false);
  const [codeEditorVisible, setCodeEditorVisible] = useState(false);
  const [participants, setParticipants] = useState<string[]>([]);
  const router = useRouter();
  const params = useParams();
  const username = params?.userName as string;
  const meetingid = params?.meetingId as string;

  useEffect(() => {
    if (username && meetingid) {
      joinRoom(meetingid, username).then((tk) => {
        if (tk) setToken(tk);
      });
    }
    return () => leaveRoom();
  }, [username, meetingid]);

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

  const getLayoutWidths = () => {
    if (whiteboardVisible && codeEditorVisible) {
      return { whiteboard: 'w-2/5', codeEditor: 'w-2/5', video: 'w-1/5' };
    }
    if (whiteboardVisible) {
      return { whiteboard: 'w-[70%]', codeEditor: 'hidden', video: 'w-[30%]' };
    }
    if (codeEditorVisible) {
      return { whiteboard: 'hidden', codeEditor: 'w-[70%]', video: 'w-[30%]' };
    }
    return { whiteboard: 'hidden', codeEditor: 'hidden', video: 'w-full' };
  };

  const { whiteboard, codeEditor, video } = getLayoutWidths();

  if (!room || !token) return <div>Loading...</div>;

  return (
    <main className="flex h-screen bg-gray-900 text-white">
      {showParticipants && (
        <aside className="w-72 bg-gray-800 p-4 overflow-y-auto border-r border-gray-700">
          <h3 className="text-lg font-semibold mb-4">Participants</h3>
          <ul>
            {participants.map((participant) => (
              <li key={participant} className="mb-2 bg-gray-700 p-2 rounded hover:bg-gray-600 transition-all">
                {participant}
              </li>
            ))}
          </ul>
        </aside>
      )}

      <div className="flex-grow flex flex-col">
        <header className="flex justify-between items-center bg-gray-800 p-4 rounded-b-lg shadow-lg">
          <h2 className="text-lg font-semibold">Room: {meetingid}</h2>
          <button onClick={leaveMeeting} className="flex items-center gap-2 bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600 transition-all">
            <LogOut className="w-5 h-5" />
            Leave
          </button>
        </header>

        <div className="flex-grow flex">
          <div className={`${whiteboard} bg-gray-800 border-r border-gray-700`}>
            {whiteboardVisible && <Whiteboard />}
          </div>
          <div className={`${codeEditor} bg-gray-800 border-r border-gray-700`}>
            {codeEditorVisible && <CodeEditor />}
          </div>
          <div className={`${video} bg-gray-900 flex overflow-y-auto`}>
            <LiveKitRoom room={room} serverUrl={process.env.NEXT_PUBLIC_LIVEKIT_URL!} token={token}>
              <VideoGrid />
            </LiveKitRoom>
          </div>
        </div>

        <footer className="flex justify-center gap-4 bg-gray-800 p-4 rounded-t-lg shadow-lg">
          <ControlButton icon={Mic} onClick={toggleMic} active={micEnabled} />
          <ControlButton icon={Video} onClick={toggleVideo} active={videoEnabled} />
          <ControlButton icon={ScreenShare} onClick={toggleScreenShare} active={isSharing} />
          <ControlButton icon={PenBox} onClick={() => setWhiteboardVisible(!whiteboardVisible)} active={whiteboardVisible} />
          <ControlButton icon={Code} onClick={() => setCodeEditorVisible(!codeEditorVisible)} active={codeEditorVisible} />
          <ControlButton icon={Users} onClick={() => setShowParticipants(!showParticipants)} />
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
          className="w-4/5 bg-gray-700 rounded-lg shadow-lg"
        />
      ))}
    </>
  );
};


export default MeetingRoom;
