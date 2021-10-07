const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const UserSchema = new Schema({
  username: { type: String, maxLength: 50, required: true },
  password: { type: String, minLength: 6, required: true },
});

module.exports = mongoose.model('User', UserSchema);
