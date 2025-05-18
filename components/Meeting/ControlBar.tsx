// app/meeting/ControlBar.tsx
"use client";

import { Mic, MicOff, Video, VideoOff, ScreenShare, MessageCircle, Users, Settings, Hand, Code } from "lucide-react";
import { toast } from "sonner";

type ControlBarProps = {
  setShowChat: React.Dispatch<React.SetStateAction<boolean>>;
  setShowParticipants: React.Dispatch<React.SetStateAction<boolean>>;
};

const ControlBar = ({ setShowChat, setShowParticipants }: ControlBarProps) => {
  return (
    <footer className="flex justify-center gap-4 bg-gray-800 p-3">
      <button onClick={() => toast("Mic toggled")}><Mic /></button>
      <button onClick={() => toast("Video toggled")}><Video /></button>
      <button onClick={() => toast("Screen Sharing toggled")}><ScreenShare /></button>
      <button onClick={() => setShowChat((prev:any) => !prev)}><MessageCircle /></button>
      <button onClick={() => setShowParticipants((prev:any) => !prev)}><Users /></button>
      <button onClick={() => toast("Settings")}> <Settings /></button>
      <button onClick={() => toast("Raise Hand")}> <Hand /></button>
      <button onClick={() => toast("Code Editor")}> <Code /></button>
    </footer>
  );
};

export default ControlBar;
