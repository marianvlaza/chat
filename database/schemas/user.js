var mongoose = require('mongoose');

var UserSchema = new mongoose.Schema({

  userName: String
});

var User = mongoose.model('User', UserSchema);

module.exports = User;
