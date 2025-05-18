// File: app/meeting/MeetingRoom.tsx
"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { useLiveKit } from "@/providers/livekitProvider";
import {
  LiveKitRoom,
  VideoTrack,
  useTracks,
  TrackReference,
} from "@livekit/components-react";
import { Track, Room, LocalTrack, createLocalTracks } from "livekit-client";
import {
  Mic,
  MicOff,
  Video,
  VideoOff,
  Users,
  LogOut,
  Code,
  Settings,
  ScreenShare,
  PenBox,
  Loader2,
  Hand,
  MessageCircle,
  SendHorizonal,
  Copy,
} from "lucide-react";
import { AudioTrack } from "@livekit/components-react";
import { toast } from "sonner";
import Whiteboard from "@/components/Meeting/Whiteboard";
import CodeEditor from "@/components/Meeting/CodeEditor";
import { useUser } from "@/hooks/useUser";
import ControlButton from "@/components/Meeting/ControlBar";
import getLayoutWidths from "@/components/Meeting/Layout";

const MeetingRoom = () => {
  const { joinRoom, leaveRoom, room } = useLiveKit();
  const [joined, setJoined] = useState(false);
  const [micEnabled, setMicEnabled] = useState(true);
  const [videoEnabled, setVideoEnabled] = useState(true);
  const [localTracks, setLocalTracks] = useState<LocalTrack[]>([]);
  const [token, setToken] = useState<string | null>(null);
  const [raisedHands, setRaisedHands] = useState<Map<string, boolean>>(
    new Map()
  );
  const [chatMessages, setChatMessages] = useState<string[]>([]);
  const [chatInput, setChatInput] = useState("");
  const [participants, setParticipants] = useState<string[]>([]);
  const [isSharing, setIsSharing] = useState(false);
  const [showParticipants, setShowParticipants] = useState(false);
  const [showChat, setShowChat] = useState(false);
  const [whiteboardVisible, setWhiteboardVisible] = useState(false);
  const [codeEditorVisible, setCodeEditorVisible] = useState(false);
  const [activeComponent, setActiveComponent] = useState<string | null>(null);
  const router = useRouter();
  const params = useParams();
  const userObj = useUser()?.user;
  const username =
    userObj && typeof userObj === "object" && "userName" in userObj
      ? (userObj as { userName: string }).userName
      : `Guest${Math.floor(Math.random() * 1000)}`;
  const meetingid = (params?.meetingId as string) ?? "";
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    createLocalTracks({ video: true, audio: true }).then((tracks) => {
      setLocalTracks(tracks);
      // Attach local audio preview
      const audio = tracks.find((t) => t.kind === "audio");
      if (audio) {
        const el = document.createElement("audio");
        el.srcObject = new MediaStream([audio.mediaStreamTrack]);
        el.autoplay = true;
        el.muted = true;
        el.id = "local-preview-audio";
        document.body.appendChild(el);
      }
    });
    return () => {
      leaveRoom();
      const el = document.getElementById("local-preview-audio");
      if (el) el.remove();
    };
  }, []);

  useEffect(() => {
    if (!room) return;
    updateParticipants(room);
    room.on("participantConnected", () => updateParticipants(room));
    room.on("participantDisconnected", () => updateParticipants(room));
    room.on("dataReceived", (payload, participant) => {
      const msg = JSON.parse(new TextDecoder().decode(payload));
      if (msg.type === "chat") {
        setChatMessages((m) => [
          ...m,
          `${participant?.identity ?? "Unknown"}: ${msg.message}`,
        ]);
      } else if (msg.type === "raise") {
        if (participant) {
          setRaisedHands((prev) =>
            new Map(prev).set(participant.identity, true)
          );
        }
      }
    });
  }, [room]);

  const handleJoin = async () => {
    const token = await joinRoom(meetingid, username);
    if (!token) return toast.error("❌ Failed to join");
    setToken(token);
    for (const track of localTracks) {
      await room?.localParticipant?.publishTrack(track);
    }
    setJoined(true);
  };

  const updateParticipants = (room: Room) => {
    const all = [
      room.localParticipant.identity,
      ...Array.from(room.remoteParticipants.values()).map((p) => p.identity),
    ];
    setParticipants(all);
  };

  const toggleMic = () => {
    const track = localTracks.find((t) => t.kind === "audio");
    if (track) {
      track.mediaStreamTrack.enabled = !micEnabled;
      console.log("Mic toggled", track.mediaStreamTrack.enabled,track.isMuted);
      setMicEnabled(!micEnabled);
    }
  };

  const toggleVideo = () => {
    const track = localTracks.find((t) => t.kind === "video");
    if (track) {
      track.mediaStreamTrack.enabled = !videoEnabled;
      setVideoEnabled(!videoEnabled);
    }
  };
  const toggleScreenShare = async () => {
    const localParticipant = room?.localParticipant;
    if (!localParticipant) return;
    if (isSharing) {
      localParticipant.getTrackPublications().forEach((pub) => {
        if (pub.track?.source === Track.Source.ScreenShare) {
          pub.track.stop();
          localParticipant.unpublishTrack(pub.track as LocalTrack);
        }
      });
      setIsSharing(false);
    } else {
      const stream = await navigator.mediaDevices.getDisplayMedia({
        video: true,
        audio: true,
      });
      const screenTrack = stream.getVideoTracks()[0];
      await localParticipant.publishTrack(screenTrack, {
        source: Track.Source.ScreenShare,
        simulcast: true,
      });
      screenTrack.onended = () => toggleScreenShare();
      setIsSharing(true);
    }
  };

  const raiseHand = () => {
    if (raisedHands.get(username)) {
      setRaisedHands((prev) => {
        const newMap = new Map(prev);
        newMap.delete(username);
        return newMap;
      });
      toast.info(`${username} lowered their hand ✋`);
    } else {
      setRaisedHands((prev) => new Map(prev).set(username, true));
      toast.info(`${username} raised their hand ✋`);

      setTimeout(() => {
        setRaisedHands((prev) => {
          const newMap = new Map(prev);
          newMap.delete(username);
          return newMap;
        });
      }, 5000);
    }
  };

  const sendChat = () => {
    if (!chatInput.trim()) return;
    const msg = { type: "chat", message: chatInput };
    room?.localParticipant.publishData(
      new TextEncoder().encode(JSON.stringify(msg)),
      { reliable: true }
    );
    setChatMessages((c) => [...c, `You: ${chatInput}`]);
    setChatInput("");
  };

  const leaveMeeting = () => {
    leaveRoom();
    router.push("/");
  };

  

  const { whiteboard, codeEditor, video } = getLayoutWidths(whiteboardVisible, codeEditorVisible);

 

    const VideoGrid = () => {
    const videoRefs = useTracks([Track.Source.Camera]);
    const audioRefs = useTracks([Track.Source.Microphone]);
    
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 w-full p-4">
    {videoRefs.map((trackRef: TrackReference) => {
      const pid = trackRef.participant.identity;
      const isLocal = trackRef.participant.isLocal;
      const handRaised = raisedHands.get(pid);
      return (
        <div key={trackRef.publication.trackSid} className="relative">
          <VideoTrack
            trackRef={trackRef}
            className="rounded-lg w-80"
          />
          {handRaised && (
            <div className="absolute top-2 left-2 text-xl text-black px-2 py-1 rounded font-semibold">
              ✋
            </div>
          )}
          <div className="absolute bottom-2 right-2 bg-gray-800 bg-opacity-75 text-white px-2 py-1 rounded text-xs">
            {pid}
          </div>
        </div>
      );
    })}
        {audioRefs.map((trackRef) => (
          <AudioTrack
            key={trackRef.publication.trackSid}
            trackRef={trackRef}
          />
        ))}
         </div>
      
    );
  };

  const copyText = (e: React.MouseEvent<HTMLDivElement>) => {
    e.preventDefault();
    navigator.clipboard.writeText(meetingid);
    toast.info("Meeting ID copied to clipboard");
  };

  if (!joined) {
    return (
      <div className="h-screen flex flex-col items-center justify-center bg-black text-white space-y-6">
        <div className="flex items-center space-x-4">
          <button onClick={toggleMic}>{micEnabled ? <Mic /> : <MicOff />}</button>
          <button onClick={toggleVideo}>{videoEnabled ? <Video /> : <VideoOff />}</button>
        </div>
        <div className="flex gap-2">
          {localTracks.map((track) => {
            if (track.kind === "video") {
              return (
                <video
                  key="preview"
                  ref={(el) => {
                    if (el) {
                      el.srcObject = new MediaStream([track.mediaStreamTrack]);
                    }
                  }}
                  autoPlay
                  className="w-64 h-44 rounded bg-gray-700"
                />
              );
            }
            return null;
          })}
        </div>
        <button
          onClick={handleJoin}
          className="bg-blue-600 px-6 py-3 rounded font-bold"
        >
          Join Meeting
        </button>
      </div>
    );
  }

  if (!room || !token) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-900 text-white">
        <Loader2 className="text-4xl text-blue-500 animate-spin" />
      </div>
    );
  }

  return (
    <main className="flex h-screen bg-gray-900 text-white">
      {showParticipants && (
        <aside className="w-80 bg-gray-800 p-4 overflow-y-auto border-r border-gray-700">
          <h3 className="text-lg font-semibold mb-4">Participants</h3>
          <ul>
            {participants.map((participant) => (
              <li
                key={participant}
                className="mb-2 bg-gray-700 p-2 rounded hover:bg-gray-600 transition-all"
              >
                {participant}
              </li>
            ))}
          </ul>
        </aside>
      )}

      <div className="flex-grow flex flex-col">
        <header className="flex justify-between items-center bg-gray-800 p-4 rounded-b-lg shadow-lg">
          <h2 className="text-lg flex gap-2 font-semibold">Room: <div className="flex gap-2 cursor-pointer" onClick={(e)=>{copyText(e)}}>{meetingid} <Copy/></div></h2>
          <button
            onClick={leaveMeeting}
            className="flex items-center gap-2 bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600 transition-all"
          >
            <LogOut className="w-5 h-5" /> Leave
          </button>
        </header>

        <div className="flex-grow flex">
          <div className={`${whiteboard} bg-gray-800 border-r border-gray-700`}>
            {whiteboardVisible && (
              <Whiteboard setActiveComponent={setActiveComponent} />
            )}
          </div>
          <div className={`${codeEditor} bg-gray-800 border-r border-gray-700`}>
            {codeEditorVisible && (
              <CodeEditor setActiveComponent={setActiveComponent} />
            )}
          </div>
          <div className={`${video} bg-gray-900 flex overflow-y-auto`}>
            <LiveKitRoom
              token={token}
              room={room}
              serverUrl={process.env.NEXT_PUBLIC_LIVEKIT_URL!}
            >
              <VideoGrid />
            </LiveKitRoom>
          </div>
        </div>

        <footer className="flex justify-center gap-4 bg-gray-800 p-4 rounded-t-lg shadow-lg">
          <ControlButton
            onIcon={Mic}
            offIcon={MicOff}
            onClick={toggleMic}
            active={micEnabled}
          />
          <ControlButton
            onIcon={Video}
            offIcon={VideoOff}
            onClick={toggleVideo}
            active={videoEnabled}
          />
          <ControlButton
            onIcon={ScreenShare}
            onClick={toggleScreenShare}
            active={isSharing}
          />
          <ControlButton
            onIcon={PenBox}
            onClick={() => setWhiteboardVisible(!whiteboardVisible)}
            active={whiteboardVisible}
          />
          <ControlButton
            onIcon={Code}
            onClick={() => setCodeEditorVisible(!codeEditorVisible)}
            active={codeEditorVisible}
          />
          <ControlButton
            onIcon={Users}
            onClick={() => setShowParticipants(!showParticipants)}
          />
          <ControlButton
            onIcon={MessageCircle}
            onClick={() => setShowChat(!showChat)}
          />
          <ControlButton onIcon={Hand} onClick={raiseHand} />
          <ControlButton
            onIcon={Settings}
            onClick={() => toast.info("Settings coming soon")}
          />
        </footer>
      </div>

      {showChat && (
        <aside className="w-80 bg-gray-800 p-4 flex flex-col justify-between border-l border-gray-700">
          <div className="overflow-y-auto flex-grow space-y-2">
            {chatMessages.map((msg, idx) => (
              <div key={idx} className="bg-gray-700 p-2 rounded">
                {msg}
              </div>
            ))}
          </div>
          <div className="flex items-center gap-2 mt-2">
            <input
              className="flex-grow bg-gray-700 rounded px-3 py-2"
              value={chatInput}
              onChange={(e) => setChatInput(e.target.value)}
              placeholder="Type a message..."
            />
            <button
              onClick={sendChat}
              className="text-blue-400 hover:text-blue-300"
            >
              <SendHorizonal className="w-5 h-5" />
            </button>
          </div>
        </aside>
      )}
    </main>
  );
};

export default MeetingRoom;
