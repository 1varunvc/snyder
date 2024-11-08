// auth/index.js
const authRoutes = require('./authRoutes');
const authMiddleware = require('./authMiddleware');

module.exports = {
  authRoutes,
  authMiddleware,
};
