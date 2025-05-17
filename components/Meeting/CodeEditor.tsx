// file: components/CodeEditor.tsx
'use client';
import React, { useEffect, useState, useRef } from 'react';
import CodeMirror from '@uiw/react-codemirror';
import { javascript } from '@codemirror/lang-javascript';
import { useSocket } from '@/providers/SocketProvider';
import { SOCKET_EVENTS } from '@/lib/socket';
import { useParams } from 'next/navigation';

const CodeEditor = ({ setActiveComponent }: { setActiveComponent: (comp: string) => void }) => {
  const socket = useSocket();
  const [code, setCode] = useState('// Start typing...');
  const [isRemote, setIsRemote] = useState(false);
  const debounceTimer = useRef<NodeJS.Timeout | null>(null);
  const meetingId = useParams()?.meetingId as string;

  useEffect(() => {
    if (!socket || !meetingId) return;

    // console.log('[CodeEditor] Joining room:', meetingId);
    socket.emit(SOCKET_EVENTS.JOIN_ROOM, { roomId: meetingId });

    const onRemoteCode = (newCode: string) => {
      // console.log('[CodeEditor] Received remote code update:', newCode);
      setIsRemote(true);
      setCode(newCode);
    };

    socket.on(SOCKET_EVENTS.SERVER_CODE_CHANGE, onRemoteCode);

    return () => {
      // console.log('[CodeEditor] Leaving room:', meetingId);
      socket.emit(SOCKET_EVENTS.LEAVE_ROOM, { roomId: meetingId });
      socket.off(SOCKET_EVENTS.SERVER_CODE_CHANGE, onRemoteCode);
    };
  }, [socket, meetingId]);

  const onChange = (value: string) => {
    if (isRemote) {
      setIsRemote(false);
      // console.log('[CodeEditor] Ignoring local change due to remote update.');
      return;
    }

    // console.log('[CodeEditor] Sending local code change:', value);
    setCode(value);

    if (debounceTimer.current) clearTimeout(debounceTimer.current);

    debounceTimer.current = setTimeout(() => {
      // console.log('[CodeEditor] Broadcasting code change:', value);
      socket.emit(SOCKET_EVENTS.CLIENT_CODE_CHANGE, { roomId: meetingId, code: value });
    }, 300);

    socket.emit(SOCKET_EVENTS.USER_ACTIVE, 'code-editor');
  };

  return (
    <div className="h-full w-full p-4 bg-neutral-900 text-white rounded-xl relative">
      <CodeMirror
        value={code}
        height="500px"
        theme="dark"
        extensions={[javascript()]}
        onChange={onChange}
      />
    </div>
  );
};

export default CodeEditor;