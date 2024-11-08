// models/user.js
const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  spotifyId: { type: String, required: true, unique: true },
  displayName: String,
  photos: [Object],
  accessToken: String,
  refreshToken: String,
  expiresIn: Date,
});

module.exports = mongoose.model('User', userSchema);
