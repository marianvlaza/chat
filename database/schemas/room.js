var mongoose = require('mongoose');

var RoomSchema = new mongoose.Schema({

  roomName: String,
  roomDescription: String
});

var Room = mongoose.model('Room', RoomSchema);

module.exports = Room;
