// routes/index.js
const express = require('express');
const spotifyRoutes = require('./spotifyRoutes');
const authRoutes = require('./authRoutes');
const testRoutes = require('./testRoutes'); // Import testRoutes

const router = express.Router();

// Mount routes
router.use('/api/spotify', spotifyRoutes);
router.use('/auth', authRoutes);

// Mount testRoutes only in development
if (process.env.NODE_ENV === 'development') {
  router.use('/', testRoutes);
}

// Default route
router.get('/', (req, res) => {
  res.send('Welcome to the Snyder App Backend');
});

module.exports = router;
