# README.md for Test Module

# Test Module
This directory contains routes and controllers used for testing and debugging the application, mainly used in development mode. It provides basic endpoints to check the configuration, session details, and other checks during the development process.

- `testRoutes.js`: Defines routes for testing purposes, such as retrieving configuration or accessing the dashboard.
- `testController.js`: Contains logic for serving test data, like configuration information and user dashboard data.
- `index.js`: Exports the test-related modules for easy import elsewhere in the application.

## Key Features
- **Configuration Endpoint**: Provides an endpoint to check the application's configuration (`/config`).
- **Dashboard Endpoint**: Provides a route to view the current user's dashboard (`/dashboard`).
- **Development Mode Only**: These routes are only active in development mode (`NODE_ENV=development`)  and **should not be used in production.**

## Example Usage:
- To check the application configuration: `GET /config`

  This returns the application's configuration, excluding sensitive variables like API keys.

- To access the dashboard (only if logged in):`GET /dashboard`

  This returns a message with the current user's details if they are logged in.

This module is useful for testing and debugging during development, giving developers access to the configuration and user-related data.
