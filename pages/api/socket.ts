// file: pages/api/socket.ts
import { Server } from 'socket.io';
import mongoose from 'mongoose';
import { NextApiRequest } from 'next';
import { NextApiResponseServerIO } from '@/types/socket';
import RoomState from '@/models/RoomState';
import { SOCKET_EVENTS } from '@/lib/socket';

const MONGO_URL = process.env.MONGODB_URI!;

if (!mongoose.connections[0].readyState) {
  mongoose.connect(MONGO_URL, { dbName: 'collab' });
}

export default async function handler(req: NextApiRequest, res: NextApiResponseServerIO) {
  if (!res.socket.server.io) {
    const io = new Server(res.socket.server as any, {
      path: '/api/socket',
    });

    io.on('connection', (socket) => {
      let currentRoomId: string;

      socket.on(SOCKET_EVENTS.JOIN_ROOM, async ({ roomId }) => {
        currentRoomId = roomId;
        socket.join(roomId);

        const room = await RoomState.findOne({ roomId });
        if (room) {
          socket.emit(SOCKET_EVENTS.SERVER_CODE_CHANGE, room.code);
          socket.emit(SOCKET_EVENTS.SERVER_WHITEBOARD_UPDATE, room.whiteboard);
        } else {
          const newRoom = await RoomState.create({ roomId });
          socket.emit(SOCKET_EVENTS.SERVER_CODE_CHANGE, newRoom.code);
        }
      });

      socket.on(SOCKET_EVENTS.LEAVE_ROOM, ({ roomId }) => {
        socket.leave(roomId);
      });

      socket.on(SOCKET_EVENTS.CLIENT_CODE_CHANGE, async ({ roomId, code }) => {
        await RoomState.findOneAndUpdate({ roomId }, { code }, { upsert: true });
        socket.to(roomId).emit(SOCKET_EVENTS.SERVER_CODE_CHANGE, code);
      });

      socket.on(SOCKET_EVENTS.CLIENT_WHITEBOARD_UPDATE, async ({ roomId, snapshot }) => {
        await RoomState.findOneAndUpdate({ roomId }, { whiteboard: snapshot }, { upsert: true });
        socket.to(roomId).emit(SOCKET_EVENTS.SERVER_WHITEBOARD_UPDATE, snapshot);
      });

      socket.on(SOCKET_EVENTS.USER_ACTIVE, (comp) => {
        socket.to(currentRoomId).emit(SOCKET_EVENTS.USER_ACTIVE, comp);
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