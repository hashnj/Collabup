import { Server } from 'socket.io';
import { NextApiRequest } from 'next';
import { NextApiResponseServerIO } from '@/types/socket';
import { SOCKET_EVENTS } from '@/lib/socket';

let currentCode = '// Start typing...';
let currentWhiteboardSnapshot: WhiteboardSnapshot | null = null;

interface WhiteboardSnapshot {
  [key: string]: any; // Replace with specific properties if known
}

export default function handler(req: NextApiRequest, res: NextApiResponseServerIO) {
  if (!res.socket.server.io) {
    const io = new Server(res.socket.server as any, { path: '/api/socket' });

    io.on('connection', (socket) => {
      socket.emit(SOCKET_EVENTS.SERVER_CODE_CHANGE, currentCode);
      if (currentWhiteboardSnapshot) {
        socket.emit(SOCKET_EVENTS.WHITEBOARD_UPDATE, currentWhiteboardSnapshot);
      }

      socket.on(SOCKET_EVENTS.CLIENT_CODE_CHANGE, (code) => {
        currentCode = code;
        socket.broadcast.emit(SOCKET_EVENTS.SERVER_CODE_CHANGE, code);
      });

      socket.on(SOCKET_EVENTS.CLIENT_UPDATE, (snapshot) => {
        currentWhiteboardSnapshot = snapshot;
        socket.broadcast.emit(SOCKET_EVENTS.WHITEBOARD_UPDATE, snapshot);
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
