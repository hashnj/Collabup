type RoomMap = {
  [roomId: string]: {
    [socketId: string]: string; 
  };
};

export class RoomManager {
  private rooms: RoomMap = {};

  addUser(roomId: string, socketId: string, userId: string) {
    if (!this.rooms[roomId]) {
      this.rooms[roomId] = {};
    }
    this.rooms[roomId][socketId] = userId;
  }

  getOtherUsersInRoom(roomId: string, currentSocketId: string) {
    if (!this.rooms[roomId]) return [];
    return Object.entries(this.rooms[roomId])
      .filter(([socketId]) => socketId !== currentSocketId)
      .map(([socketId, userId]) => ({ socketId, userId }));
  }

  removeUser(socketId: string) {
    for (const roomId in this.rooms) {
      if (this.rooms[roomId][socketId]) {
        const userId = this.rooms[roomId][socketId];
        delete this.rooms[roomId][socketId];
        if (Object.keys(this.rooms[roomId]).length === 0) {
          delete this.rooms[roomId];
        }
        return { roomId, userId };
      }
    }
    return { roomId: null, userId: null };
  }
}
