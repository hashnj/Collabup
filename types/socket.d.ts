import { Server as IOServer } from "socket.io";
import { NextApiResponse } from "next";
import { Socket as NetSocket } from "net";

export type NextApiResponseServerIO = NextApiResponse & {
  socket: NetSocket & {
    server: {
      io?: IOServer;
    };
  };
};
