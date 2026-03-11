const mongoose = require('mongoose');

const photoSchema = new mongoose.Schema({
  userId: {
    type: String,
    required: true
  },
  filename: {
    type: String,
    required: true
  },
  filepath: {
    type: String,
    required: true
  },
  caption: String,
  tags: [String],
  likes: {
    type: Number,
    default: 0
  },
  likedBy: [String],
  comments: [{
    userId: String,
    username: String,
    text: String,
    timestamp: {
      type: Date,
      default: Date.now
    }
  }],
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Photo', photoSchema);
