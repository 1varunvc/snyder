// routes/index.js
const express = require('express');
const spotifyRoutes = require('./spotifyRoutes');
const authRoutes = require('./authRoutes');

const router = express.Router();

// Mount routes
router.use('/api/spotify', spotifyRoutes);
router.use('/auth', authRoutes);

// Default route
router.get('/', (req, res) => {
  res.send('Welcome to the Snyder App Backend');
});

module.exports = router;
