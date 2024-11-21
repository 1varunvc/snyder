// models/user.js
const mongoose = require('mongoose');
const logger = require('../utils/logger');

const userSchema = new mongoose.Schema({
  spotifyId: { type: String, required: true, unique: true },
  displayName: String,
  photos: [Object],
  accessToken: String,
  refreshToken: String,
  expiresIn: Date,
});

userSchema.pre('save', function (next) {
  logger.debug(`Saving user: ${this.spotifyId}`);
  next();
});

module.exports = mongoose.model('User', userSchema);
