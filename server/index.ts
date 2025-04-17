
import { createServer } from 'http';
import { Server as SocketIOServer } from 'socket.io';
import handleSocketConnection from './socket';

const PORT = 3001; 

const httpServer = createServer();
const io = new SocketIOServer(httpServer, {
  cors: {
    origin: '*', 
    methods: ['GET', 'POST'],
  },
});

io.on('connection', (socket) => {
  console.log(`🔌 Socket connected: ${socket.id}`);
  handleSocketConnection(io, socket);
});

httpServer.listen(PORT, () => {
  console.log(`🚀 Signaling server running at http://localhost:${PORT}`);
});
