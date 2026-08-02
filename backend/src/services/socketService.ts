import { Server as HttpServer } from 'http';
import { Server, Socket } from 'socket.io';
import { env } from '../config/env';

let io: Server;

export const initSocket = (httpServer: HttpServer): Server => {
  io = new Server(httpServer, {
    cors: {
      origin: env.FRONTEND_URL,
      methods: ['GET', 'POST'],
      credentials: true,
    },
  });

  io.on('connection', (socket: Socket) => {
    console.log(`🔌 Socket Connected: ${socket.id}`);

    socket.on('join_room', (room: string) => {
      socket.join(room);
      console.log(`👤 Socket ${socket.id} joined room: ${room}`);
    });

    socket.on('send_message', (data: { room: string; message: string; sender: string }) => {
      io.to(data.room).emit('receive_message', {
        ...data,
        timestamp: new Date().toISOString(),
      });
    });

    socket.on('disconnect', () => {
      console.log(`❌ Socket Disconnected: ${socket.id}`);
    });
  });

  return io;
};

export const getIO = (): Server => {
  if (!io) {
    throw new Error('Socket.io is not initialized!');
  }
  return io;
};

export const emitNotification = (room: string, notification: { title: string; message: string; type?: string }) => {
  if (io) {
    io.to(room).emit('notification', {
      ...notification,
      createdAt: new Date().toISOString(),
    });
  }
};
