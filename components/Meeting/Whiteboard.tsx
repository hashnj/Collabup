// components/meeting/Whiteboard.tsx
'use client';

import React, { useEffect, useRef } from 'react';
import { Tldraw, TldrawEditor, useEditor } from 'tldraw';
import 'tldraw/tldraw.css';
import { useSocket } from '@/providers/SocketProvider';
import { SOCKET_EVENTS } from '@/lib/socket';

const WhiteboardSync = () => {
  const editor = useEditor();
  const socket = useSocket();
  const updateTimer = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (!socket || !editor) return;

    // Load initial snapshot if available
    socket.on(SOCKET_EVENTS.SERVER_UPDATE, (snapshot: any) => {
      if (snapshot) {
        console.log("Loading initial snapshot:", snapshot);
        editor.store.loadSnapshot(snapshot);
      }
    });

    // Broadcast local changes
    const handleLocalChange = () => {
      if (updateTimer.current) clearTimeout(updateTimer.current);
      updateTimer.current = setTimeout(() => {
        const snapshot = editor.store.getSnapshot();
        socket.emit(SOCKET_EVENTS.CLIENT_UPDATE, snapshot);
      }, 300);
    };

    editor.store.listen(handleLocalChange, { source: 'user' });

    // Cleanup on unmount
    return () => {
      if (updateTimer.current) clearTimeout(updateTimer.current);
      socket.off(SOCKET_EVENTS.SERVER_UPDATE);
    };
  }, [socket, editor]);

  return null;
};

const Whiteboard = () => {
  return (
    <div className="w-full h-full">
      <TldrawEditor>
        <Tldraw persistenceKey="collab-board" autoFocus>
          <WhiteboardSync />
        </Tldraw>
      </TldrawEditor>
    </div>
  );
};

export default Whiteboard;
