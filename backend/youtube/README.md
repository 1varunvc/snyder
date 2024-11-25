# YouTube Module

This directory contains all the code related to interacting with the YouTube API. It includes routes, controllers, services, and management for fetching data from YouTube.

- `youtubeRoutes.js`: Defines routes for YouTube API endpoints.
- `youtubeController.js`: Handles the logic for YouTube routes, including processing search requests and returning responses.
- `youtubeAPI.js`: Contains the business logic for interacting with the YouTube API, including search functionality.
- `youtubeClient.js`: Manages YouTube API keys and ensures proper key rotation for rate-limited requests.
- `index.js`: Exports modules for easy import elsewhere in the application.

## Key Features
- **YouTube Search**: Allows searching YouTube using the `/api/youtube/search?q=your_query` endpoint.
- **API Key Management**: Handles rotation of YouTube API keys to ensure efficient usage and prevent rate limiting.
- **Search Endpoint**: Provides a RESTful API that accepts a search query and returns YouTube video results in a JSON format.

## Example Usage:
- To search for a query:
  `GET` `/api/youtube/search?q=your_query`

  This returns a list of video results matching the provided query from YouTube.

