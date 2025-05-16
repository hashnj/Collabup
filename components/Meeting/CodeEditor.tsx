// components/meeting/CodeEditor.tsx
'use client';
import React, { useEffect, useState } from 'react';
import CodeMirror from '@uiw/react-codemirror';
import { javascript } from '@codemirror/lang-javascript';
import { useSocket } from '@/providers/SocketProvider';
import { SOCKET_EVENTS } from '@/lib/socket';

const CodeEditor = ({ setActiveComponent }: { setActiveComponent: (comp: string) => void }) => {
  const socket = useSocket();
  const [code, setCode] = useState('// Start typing...');

  useEffect(() => {
    if (!socket) return;

    // Load initial code
    socket.on(SOCKET_EVENTS.SERVER_CODE_CHANGE, (newCode: string) => {
      setCode(newCode);
    });

    return () => {
      socket.off(SOCKET_EVENTS.SERVER_CODE_CHANGE);
    };
  }, [socket]);

  const onChange = (value: string) => {
    setCode(value);
    socket.emit(SOCKET_EVENTS.CLIENT_CODE_CHANGE, value);
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
