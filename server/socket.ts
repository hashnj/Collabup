import { Server, Socket } from 'socket.io';
import { RoomManager } from './utils/roomManager';
import { SignalMessage } from './types';

const roomManager = new RoomManager();

export default function handleSocketConnection(io: Server, socket: Socket) {
  socket.on('join-room', ({ roomId, userId }) => {
    socket.join(roomId);
    roomManager.addUser(roomId, socket.id, userId);

    const otherUsers = roomManager.getOtherUsersInRoom(roomId, socket.id);
    socket.emit('all-users', otherUsers);

    socket.to(roomId).emit('user-joined', { socketId: socket.id, userId });
    console.log(`👤 ${userId} joined room ${roomId}`);
  });

  socket.on('signal', ({ to, from, data }: SignalMessage) => {
    io.to(to).emit('signal', { from, data });
  });

  socket.on('disconnect', () => {
    const { roomId, userId } = roomManager.removeUser(socket.id);
    if (roomId) {
      socket.to(roomId).emit('user-left', { socketId: socket.id, userId });
      console.log(`❌ ${userId} left room ${roomId}`);
    }
  });
}
