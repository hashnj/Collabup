// components/meeting/Whiteboard.tsx
'use client';

import React, { useEffect, useRef } from 'react';
import { Tldraw, TldrawEditor, useEditor } from '@tldraw/tldraw';
import 'tldraw/tldraw.css';
import { useSocket } from '@/providers/SocketProvider';
import { SOCKET_EVENTS } from '@/lib/socket';

const WhiteboardSync = ({ setActiveComponent }: { setActiveComponent: (comp: string) => void }) => {
  const editor = useEditor();
  const socket = useSocket();
  const updateTimer = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (!socket || !editor) return;

    // Send initial snapshot if available
    socket.on(SOCKET_EVENTS.SERVER_WHITEBOARD_UPDATE, (snapshot: any) => {
      console.log("Loading remote snapshot");
      editor.store.loadSnapshot(snapshot);
    });

    // Handle local changes
    const handleChange = () => {
      if (updateTimer.current) clearTimeout(updateTimer.current);
      updateTimer.current = setTimeout(() => {
        const snapshot = editor.store.getSnapshot();
        socket.emit(SOCKET_EVENTS.CLIENT_WHITEBOARD_UPDATE, snapshot);
        socket.emit(SOCKET_EVENTS.USER_ACTIVE, 'whiteboard');
      }, 200); 
    };

    editor.store.listen(handleChange, { source: 'user' });

    return () => {
      if (updateTimer.current) clearTimeout(updateTimer.current);
      socket.off(SOCKET_EVENTS.SERVER_WHITEBOARD_UPDATE);
    };
  }, [socket, editor]);

  return null;
};

const Whiteboard = ({ setActiveComponent }: { setActiveComponent: (comp: string) => void }) => {
  return (
    <div className="w-full h-full relative">
      <TldrawEditor>
        <Tldraw persistenceKey="collab-board" autoFocus>
          <WhiteboardSync setActiveComponent={setActiveComponent} />
        </Tldraw>
      </TldrawEditor>
    </div>
  );
};

export default Whiteboard;
