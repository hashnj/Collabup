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

    const onRemoteCode = (newCode: string) => {
      setIsRemote(true);
      setCode(newCode);
    };

    socket.emit(SOCKET_EVENTS.JOIN_ROOM, { roomId: meetingId });
    socket.on(SOCKET_EVENTS.SERVER_CODE_CHANGE, onRemoteCode);

    return () => {
      socket.emit(SOCKET_EVENTS.LEAVE_ROOM, { roomId: meetingId });
      socket.off(SOCKET_EVENTS.SERVER_CODE_CHANGE, onRemoteCode);
    };
  }, [socket, meetingId]);

  const onChange = (value: string) => {
    if (isRemote) {
      setIsRemote(false);
      return;
    }

    setCode(value);

    if (debounceTimer.current) clearTimeout(debounceTimer.current);

    debounceTimer.current = setTimeout(() => {
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
