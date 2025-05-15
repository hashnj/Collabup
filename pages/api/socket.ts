// pages/api/socket.ts
import { Server } from 'socket.io';
import { NextApiRequest } from 'next';
import { NextApiResponseServerIO } from '@/types/socket';
import { SOCKET_EVENTS } from '@/lib/socket';

let currentSnapshot: any = null;

export default function handler(req: NextApiRequest, res: NextApiResponseServerIO) {
  if (!res.socket.server.io) {
    const io = new Server(res.socket.server as any, {
      path: '/api/socket',
    });

    io.on('connection', (socket) => {
      if (currentSnapshot) {
        socket.emit(SOCKET_EVENTS.SERVER_UPDATE, currentSnapshot);
      }

      socket.on(SOCKET_EVENTS.CLIENT_UPDATE, (snapshot) => {
        currentSnapshot = snapshot;
        socket.broadcast.emit(SOCKET_EVENTS.SERVER_UPDATE, snapshot);
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
