const fs = require('fs');
const path = require('path');

// Determine the environment, default to 'development' if not set
const NODE_ENV = process.env.NODE_ENV || 'development';

// Determine the path to the appropriate .env file
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

// Set the port from environment variables or default to 3000
const PORT = process.env.PORT || 3000;

// Define a simple route
app.get('/', (req, res) => {
  res.send('Welcome to the Snyder App Backend');
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
