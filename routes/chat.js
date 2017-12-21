var express = require('express');
var router = express.Router();
var app = express();
var server = require('http').createServer(app);
var io = require('socket.io')(server);
var db = require('../database');
var Chat = db.chat;

server.listen(4000);

// socket io
io.on('connection', function (socket) {
  console.log('User connected');
  socket.on('disconnect', function() {
    console.log('User disconnected');
  });
  socket.on('save-message', function (data) {
    console.log(data);
    io.emit('new-message', { message: data });
  });
});

/* GET ALL CHATS */
router.get('/:chatRooms', function(req, res, next) {
  console.log('/:chatRooms get');
  console.log('chatRooms = ' + req.params.chatRooms);
  Chat.find({ chatRooms: req.params.chatRooms }, function (err, chats) {
    console.log('Chat find');
    if (err) return next(err);
    res.json(chats);
  });
});

/* SAVE CHAT */
router.post('/', function(req, res, next) {
  console.log('/  post');
  Chat.create(req.body, function (err, post) {
    if (err) return next(err);
    res.json(post);
  });
});

module.exports = router;
