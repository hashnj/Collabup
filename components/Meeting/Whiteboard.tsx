'use client';

import React, { useEffect, useRef } from 'react';
import { Editor, Tldraw, useEditor } from 'tldraw';
import 'tldraw/tldraw.css';
import { useSocket } from '@/providers/SocketProvider';
import { SOCKET_EVENTS } from '@/lib/socket';

const WhiteboardSync = () => {
  const editor = useEditor();
  const socket = useSocket();
  const updateTimer = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (!socket || !editor) return;

    const handleChange = () => {
      if (updateTimer.current) clearTimeout(updateTimer.current);
      updateTimer.current = setTimeout(() => {
        const snapshot = editor.store.getSnapshot();
        socket.emit(SOCKET_EVENTS.CLIENT_UPDATE, snapshot);
      }, 300); 
    };

    editor.store.listen(handleChange, { source: 'user' });

    const handleServerUpdate = (snapshot: any) => {
      editor.store.loadSnapshot(snapshot);
    };

    socket.on(SOCKET_EVENTS.SERVER_UPDATE, handleServerUpdate);

    return () => {
      socket.off(SOCKET_EVENTS.SERVER_UPDATE, handleServerUpdate);
    };
  }, [socket, editor]);

  return null;
};

const Whiteboard = () => {
  return (
    <div className="w-full h-full">
      <Tldraw persistenceKey="collab-board">
        <WhiteboardSync />
      </Tldraw>
    </div>
  );
};

export default Whiteboard;
