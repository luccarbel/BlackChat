const mongoose = require('mongoose');
const { v4: uuidv4 } = require('uuid');

const userSchema = new mongoose.Schema({
  anonymousId: {
    type: String,
    default: () => uuidv4(),
    unique: true,
    index: true
  },
  username: {
    type: String,
    default: () => `User_${Math.floor(Math.random() * 100000)}`
  },
  avatar: {
    type: String,
    default: null
  },
  createdAt: {
    type: Date,
    default: Date.now,
    expires: 86400 // Eliminar documento después de 24 horas
  },
  chatRooms: [{
    roomId: String,
    joinedAt: Date
  }]
});

module.exports = mongoose.model('User', userSchema);
