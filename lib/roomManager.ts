// lib/roomManager.ts
import { Router, WebRtcTransport, Producer, Consumer } from 'mediasoup/node/lib/types';

type RoomData = {
  router: Router;
  transports: Map<string, WebRtcTransport>;
  producers: Map<string, Producer>;
  consumers: Map<string, Consumer>;
};

const rooms: Map<string, RoomData> = new Map();

export const getOrCreateRoom = (roomId: string, router: Router) => {
  if (!rooms.has(roomId)) {
    rooms.set(roomId, {
      router,
      transports: new Map(),
      producers: new Map(),
      consumers: new Map(),
    });
  }
  return rooms.get(roomId)!;
};

export const getRoom = (roomId: string) => rooms.get(roomId);
export const deleteRoom = (roomId: string) => rooms.delete(roomId);
