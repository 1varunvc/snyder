// server.js
require('dotenv').config();

const express = require('express');
const session = require('express-session');
const passport = require('passport');
const { router: authRoutes } = require('./auth'); // Adjust the path if necessary
const spotifyRoutes = require('./spotifyRoutes'); // Adjust the path if necessary
const rateLimit = require('express-rate-limit');

const app = express();

// Global rate limiter (e.g., max 1000 requests per 15 minutes per IP)
const globalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 1000, // limit each IP to 1000 requests per windowMs
  message: {
    error: 'Too many requests, please try again later.',
  },
});

// Apply the global rate limiter to all requests
app.use(globalLimiter);

// Configure Express session
app.use(
  session({
    secret: process.env.SESSION_SECRET, // Ensure SESSION_SECRET is set in .env
    resave: false,
    saveUninitialized: false,
    cookie: {
      secure: process.env.NODE_ENV === 'production', // Set to true in production
      httpOnly: true, // Helps prevent XSS
      maxAge: 24 * 60 * 60 * 1000, // 1 day
    },
  })
);

// Initialize Passport
app.use(passport.initialize());
app.use(passport.session());

// Use authentication routes
app.use(authRoutes);

// Use Spotify data routes
app.use(spotifyRoutes);

// Define other routes
app.get('/', (req, res) => {
  res.send('Welcome to the Snyder App Backend');
});

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
