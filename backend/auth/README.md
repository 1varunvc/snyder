# Auth Module

This directory contains all authentication-related code, including routes, controllers, services, and middleware for handling user authentication with Spotify OAuth.

- `authRoutes.js`: Defines routes for user authentication, including login and logout.
- `authController.js`: Handles the logic for authentication routes.
- `authService.js`: Contains the configuration and setup for Passport.js with Spotify OAuth.
- `authMiddleware.js`: Middleware functions for authentication, such as `ensureAuthenticated`.
- `index.js`: Exports modules for easy import elsewhere in the application.
