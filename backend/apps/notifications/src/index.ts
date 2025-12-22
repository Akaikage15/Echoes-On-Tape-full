import express from 'express';
import { createServer } from 'http';
import { Server } from 'socket.io';
import { createClient } from 'redis';
import dotenv from 'dotenv';
import cors from 'cors';

dotenv.config();

const PORT = process.env.PORT || 3002;
const REDIS_URL = process.env.REDIS_URL || 'redis://localhost:6379';

const app = express();
app.use(cors());

const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: {
    origin: "*", // В продакшене заменить на URL фронтенда
    methods: ["GET", "POST"]
  }
});

// Redis Client для Pub/Sub
const redisSubscriber = createClient({ url: REDIS_URL });

(async () => {
  await redisSubscriber.connect();
  console.log('🔗 Connected to Redis');

  // Подписка на каналы событий
  await redisSubscriber.subscribe('notifications', (message) => {
    try {
      const { type, payload, userId } = JSON.parse(message);
      
      if (userId) {
        // Отправка конкретному пользователю
        io.to(userId).emit('notification', { type, payload });
      } else {
        // Отправка всем (Broadcast)
        io.emit('notification', { type, payload });
      }
      console.log(`📨 Notification sent: ${type}`);
    } catch (e) {
      console.error('Error processing redis message:', e);
    }
  });
})();

io.on('connection', (socket) => {
  console.log(`User connected: ${socket.id}`);

  // Аутентификация и привязка userId к сокету
  socket.on('join', (userId: string) => {
    socket.join(userId);
    console.log(`User ${userId} joined their room`);
  });

  socket.on('disconnect', () => {
    console.log(`User disconnected: ${socket.id}`);
  });
});

app.get('/health', (req, res) => {
  res.json({ status: 'ok', service: 'Notification Service' });
});

httpServer.listen(PORT, () => {
  console.log(`🔔 Notification Service running on port ${PORT}`);
});
