var mongoose = require('mongoose');

var ChatSchema = new mongoose.Schema({

  chatRooms: String,
  users: String,
  chatMessages: String,
  updated_at: { type: Date, default: Date.now }
});

var Chat = mongoose.model('Chat', ChatSchema);

module.exports = Chat;
