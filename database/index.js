var mongoose = require('mongoose');
var ChatModel = require('./schemas/chat');

mongoose.Promise = global.Promise;

mongoose.connect(('mongodb://localhost/chat'), { useMongoClient: true });

var db = mongoose.connection;

// error callback
db.on('error', function(msg) {
  console.log(
    'Connection Error: %s', msg
  );
});
// success callback
db.once('open', function callback () {
  // on success
  console.log('Successfully connected to database');
});

exports.chat = ChatModel;
