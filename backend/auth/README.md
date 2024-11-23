# Auth Module
This directory contains all the code related to user authentication and authorization, specifically integrating with Spotify's OAuth system. It includes routes, controllers, middleware, and services for managing user login, authentication, and session management.

- `authRoutes.js`: Defines routes for authentication, including Spotify login and callback routes.
- `authController.js`: Handles the logic for the login and logout processes.
- `authMiddleware.js`: Contains middleware to protect routes that require user authentication.
- `authService.js`: Manages authentication logic for Spotify OAuth, including user serialization and token management.
- `index.js`: Exports the authentication-related modules for easy import elsewhere in the application.

## Key Features
- **Spotify OAuth Integration**: Allows users to log in using their Spotify account via OAuth authentication.
- **Session Management**: Manages user sessions and ensures users are logged in when accessing protected routes.
- **Login and Logout**: Provides endpoints for user login (`/auth/spotify`) and logout (`/auth/logout`).
- **Authentication Middleware**: Protects routes requiring authentication with `ensureAuthenticated` middleware.

## Example Usage:
- To initiate Spotify login: `GET /auth/spotify`

- To handle the Spotify callback and redirect to a dashboard: `GET /auth/spotify/callback`

- To log out the user: `GET /auth/logout`

This module ensures secure user authentication using Spotify and manages their sessions during their interaction with the app.