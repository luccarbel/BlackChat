const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
  cors: {
    origin: process.env.CLIENT_URL || 'http://localhost:3000',
    methods: ['GET', 'POST']
  }
});

// Middleware
app.use(cors());
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));
app.use('/uploads', express.static('uploads'));

// Conectar a MongoDB
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/blackchat')
  .then(() => console.log('MongoDB conectado'))
  .catch(err => console.log('Error MongoDB:', err));

// Importar rutas
const chatRoutes = require('./routes/chat');
const photoRoutes = require('./routes/photo');
const userRoutes = require('./routes/user');

// Usar rutas
app.use('/api/chats', chatRoutes);
app.use('/api/photos', photoRoutes);
app.use('/api/users', userRoutes);

// Socket.io - Manejo de conexiones en tiempo real
const activeUsers = new Map();
const chatRooms = new Map();

io.on('connection', (socket) => {
  console.log('Nuevo usuario conectado:', socket.id);

  socket.on('join-room', (roomId, userId) => {
    socket.join(roomId);
    if (!chatRooms.has(roomId)) {
      chatRooms.set(roomId, []);
    }
    const room = chatRooms.get(roomId);
    room.push(userId);
    io.to(roomId).emit('user-joined', { userId, totalUsers: room.length });
  });

  socket.on('send-message', (roomId, message) => {
    io.to(roomId).emit('receive-message', {
      id: new Date().getTime(),
      message,
      timestamp: new Date(),
      userId: message.userId
    });
  });

  socket.on('disconnect', () => {
    console.log('Usuario desconectado:', socket.id);
  });
});

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`Servidor ejecutándose en puerto ${PORT}`);
});
