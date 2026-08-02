import express from 'express';
import http from 'http';
import { Server as SocketIOServer } from 'socket.io';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import dotenv from 'dotenv';

import authRoutes from './routes/auth.routes';
import userRoutes from './routes/user.routes';
import socialRoutes from './routes/social.routes';
import adminRoutes from './routes/admin.routes';
import { matchmakingService, QueueUser } from './services/matchmaking.service';
import { AIModerationService } from './services/aiModeration.service';

dotenv.config();

const app = express();
const server = http.createServer(app);

const io = new SocketIOServer(server, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST'],
  },
});

const PORT = process.env.PORT || 5000;

// Middlewares
app.use(helmet({ contentSecurityPolicy: false }));
app.use(cors());
app.use(express.json());
app.use(morgan('dev'));

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/social', socialRoutes);
app.use('/api/admin', adminRoutes);

// Healthcheck Route
app.get('/api/health', (req, res) => {
  res.json({
    status: 'online',
    platform: 'NovaChat Enterprise Video Platform',
    timestamp: new Date().toISOString(),
    stats: matchmakingService.getStats(),
  });
});

// Socket.io Real-time Signaling & Matchmaking Engine
io.on('connection', (socket) => {
  console.log(`⚡ Client connected to Socket.io: ${socket.id}`);

  // User joins matchmaking queue
  socket.on('join_matchmaking', (userData: QueueUser) => {
    const queueUser: QueueUser = {
      ...userData,
      socketId: socket.id,
      joinedAt: Date.now(),
    };

    console.log(`🎯 User ${queueUser.name} joined matchmaking queue. Target gender: ${queueUser.targetGender}`);
    
    // Try to find a match instantly
    const match = matchmakingService.findMatch(queueUser);

    if (match) {
      // Found a match! Create room and notify both peers
      const room = matchmakingService.createRoom(queueUser, match);
      socket.join(room.roomId);

      const targetSocket = io.sockets.sockets.get(match.socketId);
      if (targetSocket) {
        targetSocket.join(room.roomId);
      }

      console.log(`✨ Match found! Room: ${room.roomId} between ${queueUser.name} and ${match.name}`);

      // Emit match event to initiator (user1)
      io.to(queueUser.socketId).emit('match_found', {
        roomId: room.roomId,
        peer: {
          id: match.userId,
          name: match.name,
          username: match.username,
          avatarUrl: match.avatarUrl,
          country: match.country,
          countryCode: match.countryCode,
          gender: match.gender,
          language: match.language,
          interests: match.interests,
          isVerified: match.isVerified,
        },
        isInitiator: true,
      });

      // Emit match event to receiver (user2)
      io.to(match.socketId).emit('match_found', {
        roomId: room.roomId,
        peer: {
          id: queueUser.userId,
          name: queueUser.name,
          username: queueUser.username,
          avatarUrl: queueUser.avatarUrl,
          country: queueUser.country,
          countryCode: queueUser.countryCode,
          gender: queueUser.gender,
          language: queueUser.language,
          interests: queueUser.interests,
          isVerified: queueUser.isVerified,
        },
        isInitiator: false,
      });
    } else {
      // Add to queue waiting pool
      matchmakingService.addToQueue(queueUser);
      socket.emit('queue_waiting', { position: 1, totalInQueue: matchmakingService.getStats().queueLength });
    }
  });

  // WebRTC Signaling: Offer
  socket.on('webrtc_offer', ({ roomId, offer }) => {
    socket.to(roomId).emit('webrtc_offer', { offer });
  });

  // WebRTC Signaling: Answer
  socket.on('webrtc_answer', ({ roomId, answer }) => {
    socket.to(roomId).emit('webrtc_answer', { answer });
  });

  // WebRTC Signaling: ICE Candidate
  socket.on('webrtc_ice_candidate', ({ roomId, candidate }) => {
    socket.to(roomId).emit('webrtc_ice_candidate', { candidate });
  });

  // Real-time Video Chat Message with AI Translation & Moderation
  socket.on('send_chat_message', ({ roomId, message, targetLanguage }) => {
    // Perform AI Moderation Check
    const moderation = AIModerationService.scanText(message);
    if (!moderation.isSafe) {
      socket.emit('moderation_alert', {
        message: moderation.reason,
        flagType: moderation.flagType,
      });
      return;
    }

    // AI Translation
    const translation = AIModerationService.translateText(message, targetLanguage || 'English');

    io.to(roomId).emit('receive_chat_message', {
      senderSocketId: socket.id,
      originalText: message,
      translatedText: translation.translatedText,
      timestamp: new Date().toISOString(),
    });
  });

  // Reaction Splash (Hearts, Flame, Laugh, Gift)
  socket.on('send_reaction', ({ roomId, reactionType, giftIcon }) => {
    io.to(roomId).emit('receive_reaction', {
      senderSocketId: socket.id,
      reactionType,
      giftIcon,
    });
  });

  // Skip to Next Peer
  socket.on('skip_peer', ({ roomId }) => {
    const room = matchmakingService.endRoom(roomId);
    if (room) {
      socket.to(roomId).emit('peer_skipped');
      socket.leave(roomId);
    }
  });

  // Disconnect handler
  socket.on('disconnect', () => {
    console.log(`🔌 Client disconnected: ${socket.id}`);
    matchmakingService.removeFromQueue(socket.id);
    const room = matchmakingService.getRoomBySocketId(socket.id);
    if (room) {
      matchmakingService.endRoom(room.roomId);
      socket.to(room.roomId).emit('peer_left');
    }
  });
});

server.listen(PORT, () => {
  console.log(`🚀 NovaChat Production Express + Socket.io Server running on port ${PORT}`);
});
