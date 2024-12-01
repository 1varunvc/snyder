# Snyder

Snyder is a progressive web application (PWA) that allows users to search for and play music across both Spotify and YouTube, providing a unified experience similar to YouTube Music. Users can log in via Spotify to personalize their experience and enjoy continuous playback. Built using the MERN stack, Snyder aims to deliver a modern, fast, and responsive user interface that merges the best of Spotify and YouTube’s music capabilities.

## Features

- **Music Search and Playback:** Search for music from Spotify and YouTube APIs, with the results displayed in a unified interface.
- **Spotify Login Integration:** Login via Spotify using OAuth to provide personalized song recommendations and playback features.
- **Continuous Playback:** Auto-play the next song in the search results or playlist without user intervention.
- **YouTube & Spotify Playback:** Embedded YouTube iframe for playback, with the option to use the Spotify player for authenticated users.
- **Caching for Speed Optimization:** Server-side caching to reduce calls to Spotify and YouTube APIs and increase speed.
- **Progressive Web App (PWA):** Installable app with offline capabilities and fast, responsive user experience.

## Tech Stack

### **Frontend**

- **React.js** with **MUI (Material-UI)** for a minimalist, user-friendly interface.
- **React Context API** for state management.
- **AJAX Calls with Axios** for dynamic data fetching.

### **Backend**

- **Node.js** and **Express.js** for RESTful APIs.
- **Passport.js** for Spotify authentication.
- **YouTube Data API v3** integration for fetching YouTube content.
- **Caching Mechanism:** Implemented server-side caching for optimized API calls using `node-cache`.

### **Other Technologies**

- **MongoDB** for storing user preferences (e.g., playlists, favorites) and user-specific access and refresh tokens for Spotify.
- **Heroku** and **Netlify** for deployment of backend and frontend, respectively.
- **JWT and Express-Session** for secure user session management.
- **GitHub Actions** for continuous integration and automated testing.

## Architecture Overview

1. **Frontend:** A React-based user interface similar to Google’s search page, allowing users to search for songs, log in via Spotify, and view results in a YouTube Music-like interface.
2. **Backend:** Node.js and Express.js handle API requests, search queries, and authentication.
3. **Search Flow:**
    - User searches on the React-based homepage.
    - The search request is sent to the backend.
    - The backend fetches data from Spotify and YouTube APIs and responds with JSON.
    - Results are displayed on the frontend, where clicking on a song embeds an iframe for playback.
4. **Login Flow:**
    - Users log in via Spotify using OAuth (handled via Passport.js).
    - Token management is implemented for getting songs and personalizing the experience.

## Installation and Setup

### **Prerequisites**

- Node.js installed
- npm or yarn installed
- MongoDB Atlas account (if using MongoDB for data storage)

### **Getting Started**

1. **Clone the Repository:**
   ```bash
   git clone https://github.com/your-username/Snyder.git
   ```
   Replace `your-username` with your actual GitHub username.

2. **Navigate to the Project Directory:**
   ```bash
   cd Snyder
   ```

3. **Install Backend Dependencies:**
   ```bash
   npm install
   ```

4. **Install Frontend Dependencies:**
   Navigate to the frontend directory and run:
   ```bash
   cd frontend
   npm install
   ```

5. **Environment Variables Setup:**
   Create a `.env` file in the root directory and add the following variables:
   ```env
   SPOTIFY_CLIENT_ID=your_spotify_client_id
   SPOTIFY_CLIENT_SECRET=your_spotify_client_secret
   YOUTUBE_API_KEYS=your_youtube_api_keys_comma_separated
   SESSION_SECRET=your_session_secret
   ```
   Replace placeholders with your actual credentials.

6. **Run the Application:**
    - **Backend**: In the root directory:
      ```bash
      npm run server
      ```
    - **Frontend**: In the `frontend` directory:
      ```bash
      npm start
      ```

### **Deploying Snyder**

- **Backend** on **Heroku:**
    - Create a Heroku app and push the backend code. Use Heroku Config Vars to set environment variables.
- **Frontend** on **Netlify:**
    - Create a production build of the React app and deploy it on Netlify, linking the GitHub repository for continuous deployment.

## Usage

1. **Home Page:**
    - Users can log in with their Spotify account and use the search bar to find songs.
2. **Search Results:**
    - Display search results from Spotify and YouTube with a similar layout to YouTube Music.
3. **Playback:**
    - Click on a song to embed a YouTube iframe and start playback. Continuous playback will automatically play the next song in the search results.
4. **Progressive Web App:**
    - Users can add the app to their home screen for a more native-like experience.

## Project Structure

```
snyder/
├── backend/
│   ├── .env
│   ├── .env.example
│   ├── .env.development
│   ├── .env.production
│   ├── .eslintrc.json
│   ├── .prettierrc
│   ├── package.json
│   ├── package-lock.json
│   ├── server.js
│   ├── config/
│   │   ├── config.js
│   │   └── productionHouses.js
│   ├── auth/
│   │   ├── index.js
│   │   ├── authRoutes.js
│   │   ├── authController.js
│   │   ├── authService.js
│   │   ├── authMiddleware.js
│   │   └── README.md
│   ├── spotify/
│   │   ├── index.js
│   │   ├── spotifyRoutes.js
│   │   ├── spotifyController.js
│   │   ├── spotifyAPI.js
│   │   ├── spotifyClientCredentials.js
│   │   └── README.md
│   ├── search/
│   │   ├── index.js
│   │   ├── searchRoutes.js
│   │   ├── searchController.js
│   │   ├── searchService.js
│   │   └── README.md
│   ├── test/
│   │   ├── index.js
│   │   ├── testRoutes.js
│   │   ├── testController.js
│   │   └── README.md
│   ├── models/
│   │   └── user.js
│   ├── youtube/
│   │   ├── index.js
│   │   ├── youtubeRoutes.js
│   │   ├── youtubeController.js
│   │   ├── youtubeAPI.js
│   │   ├── youtubeClient.js
│   │   ├── youtubeDataProcessor.js
│   │   └── README.md
│   ├── utils/
│   │   ├── index.js
│   │   ├── rateLimiter.js
│   │   ├── errorHandler.js
│   │   ├── logger.js
│   │   ├── cache.js
│   │   ├── formatter.js
│   │   ├── imageProcessor.js
│   │   ├── regionDetector.js
│   │   └── README.md
│   ├── docs/
│   │   └── TESTING.md
│   ├── middleware/
│   │   └── regionMiddleware.js
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   ├── context/
│   │   ├── App.js
│   │   └── index.js
│   ├── public/
│   ├── .gitignore
│   ├── package.json
│   └── README.md
└── README.md
```

## Contributing

We welcome contributions from everyone! Here’s how you can help:

1. Fork the repository.
2. Create a new feature branch:
   ```bash
   git checkout -b feature/your-feature-name
   ```
3. Commit your changes and push them to your fork:
   ```bash
   git commit -m "Add your descriptive commit message"
   git push origin feature/your-feature-name
   ```
4. Before opening a pull request, **ensure that all logging statements include values properly by using template literals.** This is necessary due to how Winston formats log messages by default. Update logging using the regex below:

   **Find:**
   ```regex
   (logger\.\w+)\(\s*'([^']*)'\s*,\s*([^)]*)\);
   ```
   **Replace:**
   ```
   $1(`$2: \${$3}`);
   ```

5. Open a pull request.

## Security and Authentication

- **Authentication:** Spotify OAuth handled with Passport.js.
- **Secure Token Storage:** Tokens are securely stored using HttpOnly cookies or Express sessions to prevent client-side exposure.
- **Rate Limiting:** Backend rate limiting is applied using `express-rate-limit` to prevent API abuse.
- **Caching:** Server-side caching minimizes API calls to Spotify and YouTube, optimizing speed.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Acknowledgments

- **Spotify and YouTube APIs** for providing access to an extensive music library.
- **React.js, Node.js, Express.js, and MongoDB** for powering the Snyder app.
- **Material-UI** for a consistent and elegant user interface.
- **Passport.js** for simplifying authentication.