var mongoose = require('mongoose');
var userSchema = mongoose.Schema({
  Name: String,
  Mobile: String,
  Email: String,
  Password: String,
  Role: String
});

module.exports = mongoose.model('user', userSchema);
