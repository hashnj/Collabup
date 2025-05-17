// file: components/Whiteboard.tsx
"use client";
import React, { useEffect, useRef } from "react";
import { Tldraw, TldrawEditor, useEditor } from "@tldraw/tldraw";
import "tldraw/tldraw.css";
import { useSocket } from "@/providers/SocketProvider";
import { SOCKET_EVENTS } from "@/lib/socket";
import { useParams } from "next/navigation";

const WhiteboardSync = ({
  setActiveComponent,
}: {
  setActiveComponent: (comp: string) => void;
}) => {
  const editor = useEditor();
  const socket = useSocket();
  const debounceTimer = useRef<NodeJS.Timeout | null>(null);
  const isRemote = useRef(false);
  const { meetingId } = useParams() as { meetingId: string };

  useEffect(() => {
    if (!editor || !socket || !meetingId) return;

    console.log("[WhiteboardSync] Joining room:", meetingId);
    socket.emit(SOCKET_EVENTS.JOIN_ROOM, { roomId: meetingId });

    const onRemoteSnapshot = (snapshot: any) => {
      console.log("[WhiteboardSync] Received remote whiteboard update");
      isRemote.current = true;
      // Load the remote snapshot
      editor.store.loadSnapshot(snapshot);
      isRemote.current = false;
    };

    socket.on(SOCKET_EVENTS.SERVER_WHITEBOARD_UPDATE, onRemoteSnapshot);

    const handleChange = () => {
      if (isRemote.current) {
        console.log(
          "[WhiteboardSync] Ignoring local change due to remote update."
        );
        return;
      }

      // Debounce the updates to prevent too frequent emissions
      if (debounceTimer.current) clearTimeout(debounceTimer.current);

      debounceTimer.current = setTimeout(() => {
        const snapshot = editor.store.getSnapshot();
        console.log("[WhiteboardSync] Broadcasting whiteboard change");
        socket.emit(SOCKET_EVENTS.CLIENT_WHITEBOARD_UPDATE, {
          roomId: meetingId,
          snapshot,
        });
      }, 100); // Reduced debounce time for better responsiveness

      socket.emit(SOCKET_EVENTS.USER_ACTIVE, "whiteboard");
    };

    const unlisten = editor.store.listen(handleChange, { source: "user" });

    return () => {
      console.log("[WhiteboardSync] Leaving room:", meetingId);
      socket.emit(SOCKET_EVENTS.LEAVE_ROOM, { roomId: meetingId });
      socket.off(SOCKET_EVENTS.SERVER_WHITEBOARD_UPDATE, onRemoteSnapshot);
      if (debounceTimer.current) clearTimeout(debounceTimer.current);
      unlisten();
    };
  }, [editor, socket, meetingId, setActiveComponent]);

  return null;
};

const Whiteboard = ({
  setActiveComponent,
}: {
  setActiveComponent: (comp: string) => void;
}) => {
  const { meetingId } = useParams() as { meetingId: string };

  return (
    <div className="w-full h-full relative">
      <TldrawEditor>
        <Tldraw persistenceKey={`collab-board-${meetingId}`} autoFocus>
          <WhiteboardSync setActiveComponent={setActiveComponent} />
        </Tldraw>
      </TldrawEditor>
    </div>
  );
};

export default Whiteboard;
