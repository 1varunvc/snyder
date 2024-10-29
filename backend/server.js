const fs = require('fs');
const path = require('path');

const NODE_ENV = process.env.NODE_ENV || 'development';

const envFile = NODE_ENV === 'production' ? '.env.production' : '.env.development';

// Load environment variables from the determined .env file
const envPath = path.resolve(__dirname, envFile);

// Check if the .env file exists
if (fs.existsSync(envPath)) {
  require('dotenv').config({ path: envPath });
} else {
  console.warn(`Environment file ${envFile} not found. Loading default .env`);
  require('dotenv').config();
}

const express = require('express');
const app = express();

const PORT = process.env.PORT || 3000;

// Define a simple route
app.get('/', (req, res) => {
  res.send('Welcome to the Snyder App Backend');
});

const session = require('express-session');

// Configure Express session
app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: { secure: process.env.NODE_ENV === 'production' }, // Set to true if using HTTPS
  })
);

const passport = require('passport');

app.use(passport.initialize());
app.use(passport.session());

const { ensureAuthenticated, router: authRoutes } = require('./auth');
const spotifyRoutes = require('./spotifyRoutes');

// Use authentication routes
app.use(authRoutes);

// Use Spotify data routes
app.use(spotifyRoutes);

app.get('/dashboard', ensureAuthenticated, (req, res) => {
  res.json({
    message: 'Welcome to your dashboard',
    user: req.user, // Access authenticated user's information here
  });
});


// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
