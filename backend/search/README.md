# Search Module

This directory contains the logic for handling search queries in the application. The `Search` module integrates with external services (like YouTube and Spotify) and provides a unified search experience.

- `searchRoutes.js`: Defines routes for the search API endpoints.
- `searchController.js`: Handles the logic for processing search queries and sending requests to external APIs (YouTube and Spotify).
- `searchService.js`: Contains business logic for handling search query interactions and aggregating results from different APIs (Spotify, YouTube).
- `index.js`: Exports modules for easy import elsewhere in the application.

## Key Features
- **Unified Search**: Integrates search results from both YouTube and Spotify in one endpoint.
- **Search Endpoint**: Provides a RESTful API at `/api/search?q=your_query` to fetch results for a given query.
- **Result Aggregation**: Combines results from multiple data sources (YouTube and Spotify) and returns them as a unified JSON response.

## Example Usage:
- To search for a query: `GET http://localhost:3000/api/search?q=your_query`
 
  This will return a JSON response with search results from both YouTube and Spotify.