// pages/api/socket.ts

import { Server } from 'socket.io';
import { NextApiRequest } from 'next';
import { NextApiResponseServerIO } from '@/types/socket';
import { SOCKET_EVENTS } from '@/lib/socket';

let currentWhiteboardSnapshot: WhiteboardSnapshot | null = null;

interface WhiteboardSnapshot {
  // Define the structure of the whiteboard snapshot here
  // Example:
  // shapes: Shape[];
  // backgroundColor: string;
}
let currentCode = '// Start typing...';

export default function handler(req: NextApiRequest, res: NextApiResponseServerIO) {
  if (!res.socket.server.io) {
    const io = new Server(res.socket.server as any, {
      path: '/api/socket',
    });

    io.on('connection', (socket) => {
      // Send initial states
      socket.emit(SOCKET_EVENTS.SERVER_CODE_CHANGE, currentCode);
      if (currentWhiteboardSnapshot) {
        socket.emit(SOCKET_EVENTS.WHITEBOARD_UPDATE, currentWhiteboardSnapshot);
      }

      // Handle code updates
      socket.on(SOCKET_EVENTS.CLIENT_CODE_CHANGE, (code) => {
        currentCode = code;
        socket.broadcast.emit(SOCKET_EVENTS.SERVER_CODE_CHANGE, code);
      });

      // Handle whiteboard updates
      socket.on(SOCKET_EVENTS.CLIENT_WHITEBOARD_UPDATE, (snapshot) => {
        currentWhiteboardSnapshot = snapshot;
        socket.broadcast.emit(SOCKET_EVENTS.WHITEBOARD_UPDATE, snapshot);
      });

      // User activity notification
      socket.on(SOCKET_EVENTS.USER_ACTIVE, (activeComponent) => {
        socket.broadcast.emit(SOCKET_EVENTS.USER_ACTIVE, activeComponent);
      });
    });

    res.socket.server.io = io;
  }

  res.end();
}

export const config = {
  api: {
    bodyParser: false,
  },
};
