const express = require('express');
const router = express.Router();
const ChatRoom = require('../models/Chat');
const { v4: uuidv4 } = require('uuid');

// Crear salas de chat
router.post('/rooms', async (req, res) => {
  try {
    const { roomName, description } = req.body;
    const chatRoom = new ChatRoom({
      roomId: uuidv4(),
      roomName,
      description,
      activeUsers: 0
    });
    await chatRoom.save();
    res.status(201).json(chatRoom);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Obtener todas las salas
router.get('/rooms', async (req, res) => {
  try {
    const rooms = await ChatRoom.find().select('-messages');
    res.json(rooms);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Obtener mensajes de una sala
router.get('/rooms/:roomId', async (req, res) => {
  try {
    const room = await ChatRoom.findOne({ roomId: req.params.roomId });
    if (!room) {
      return res.status(404).json({ error: 'Sala no encontrada' });
    }
    res.json(room);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Guardar mensaje
router.post('/rooms/:roomId/messages', async (req, res) => {
  try {
    const { userId, username, message } = req.body;
    const room = await ChatRoom.findOneAndUpdate(
      { roomId: req.params.roomId },
      {
        $push: {
          messages: {
            userId,
            username,
            message,
            timestamp: new Date()
          }
        }
      },
      { new: true }
    );
    res.status(201).json(room.messages[room.messages.length - 1]);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
