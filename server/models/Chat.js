const mongoose = require('mongoose');

const messageSchema = new mongoose.Schema({
  userId: String,
  username: String,
  message: String,
  timestamp: {
    type: Date,
    default: Date.now
  },
  reactions: [{
    emoji: String,
    count: Number
  }]
});

const chatRoomSchema = new mongoose.Schema({
  roomId: {
    type: String,
    unique: true,
    index: true
  },
  roomName: String,
  description: String,
  messages: [messageSchema],
  activeUsers: Number,
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('ChatRoom', chatRoomSchema);
