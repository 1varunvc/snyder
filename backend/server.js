// server.js
const express = require('express');
const session = require('express-session');
const config = require('./config/config');
const routes = require('./routes');
const passport = require('passport');
const { globalLimiter } = require('./middleware/rateLimiter');
const errorHandler = require('./middleware/errorHandler');
require('./services/authService'); // Initialize passport strategies

const app = express();

// Apply global rate limiter
app.use(globalLimiter);

// Configure Express session
app.use(
  session({
    secret: config.sessionSecret,
    resave: false,
    saveUninitialized: false,
    cookie: {
      secure: config.nodeEnv === 'production', // Set to true in production
      httpOnly: true, // Helps prevent XSS
      maxAge: 24 * 60 * 60 * 1000, // 1 day
    },
  })
);

// Initialize Passport
app.use(passport.initialize());
app.use(passport.session());

// Use routes
app.use('/', routes);

// Error handling middleware
app.use(errorHandler);

// Start the server
app.listen(config.port, () => {
  console.log(`Server is running on http://localhost:${config.port}`);
});
