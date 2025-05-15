'use client';
import React, { useEffect, useState } from 'react';
import CodeMirror from '@uiw/react-codemirror';
import { javascript } from '@codemirror/lang-javascript';
import { useSocket } from '@/providers/SocketProvider';
import { SOCKET_EVENTS } from '@/lib/socket';

const CodeEditor = () => {
  const socket = useSocket();
  const [code, setCode] = useState('// Start typing...');

  useEffect(() => {
    if (!socket) return;

    const handleCodeChange = (newCode: string) => {
      setCode(newCode);
    };

    socket.on(SOCKET_EVENTS.SERVER_CODE_CHANGE, handleCodeChange);

    return () => {
      socket.off(SOCKET_EVENTS.SERVER_CODE_CHANGE, handleCodeChange);
    };
  }, [socket]);

  const onChange = (value: string) => {
    setCode(value);
    socket?.emit(SOCKET_EVENTS.CLIENT_CODE_CHANGE, value);
  };

  return (
    <div className="h-full w-full p-4 bg-neutral-900 text-white rounded-xl">
      <CodeMirror
        value={code}
        height="500px"
        theme="dark"
        extensions={[javascript()]}
        onChange={(val) => onChange(val)}
      />
    </div>
  );
};

export default CodeEditor;
