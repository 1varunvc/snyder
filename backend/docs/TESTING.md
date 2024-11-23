# Snyder - Testing Guide

This guide provides a set of URLs and instructions to test the various functionalities of the **Snyder** Express.js application. Use this document to verify that all features are working as expected after any changes or updates.

---

### 🔗 **Testing URLs**

Below are the URLs categorized based on their functionalities. Replace `your_query` with your desired search term. Ensure your server is running and environment variables are correctly configured before testing.

---

#### 1. **Authentication Routes**

##### a. **Initiate Spotify Authentication**
- **URL:** `http://localhost:3000/auth/spotify`
- **Description:** Redirects the user to Spotify's authentication page. After successful authentication, Spotify will redirect back to your application via the callback URL (`/auth/spotify/callback`).

##### b. **Spotify Callback Route**
- **URL:** `http://localhost:3000/auth/spotify/callback`
- **Description:** Spotify redirects to this route after the user completes authentication. This route handles the authentication response and redirects the user to the dashboard.

##### c. **Logout Route**
- **URL:** `http://localhost:3000/auth/logout`
- **Description:** Logs out the authenticated user, destroys the session, and redirects them to the home page (`/`).

---

#### 2. **Unified Search Endpoint**

##### a. **Perform a Unified Search**
- **URL:** `http://localhost:3000/api/search?q=your_query`
- **Description:** Performs a search using the query parameter `q`. Depending on the enabled integrations (`ENABLE_SPOTIFY_INTEGRATION` and `ENABLE_YOUTUBE_INTEGRATION`), it fetches results from Spotify and/or YouTube and returns a unified JSON response.
- **Example:**
  ```
  http://localhost:3000/api/search?q=Imagine%20Dragons
  ```

---

#### 3. **Spotify-Specific Search Endpoint**

> **Note:** This endpoint is available **only if** `ENABLE_SPOTIFY_INTEGRATION=true` in your environment variables.

- **URL:** `http://localhost:3000/api/spotify/search?q=your_query`
- **Description:** Fetches search results exclusively from Spotify based on the provided query parameter `q`.
- **Example:**
  ```
  http://localhost:3000/api/spotify/search?q=Imagine%20Dragons
  ```

---

#### 4. **YouTube-Specific Search Endpoint**

> **Note:** This endpoint is available **only if** `ENABLE_YOUTUBE_INTEGRATION=true` in your environment variables.

- **URL:** `http://localhost:3000/api/youtube/search?q=your_query`
- **Description:** Fetches search results exclusively from YouTube based on the provided query parameter `q`.
- **Example:**
  ```
  http://localhost:3000/api/youtube/search?q=Imagine%20Dragons
  ```

---

#### 5. **Default Route**

- **URL:** `http://localhost:3000/`
- **Description:** Displays a welcome message indicating that the backend of the Snyder app is running.

---

#### 6. **Test Routes** *(Available Only in Development Mode)*

##### a. **Fetch Configuration Details**
- **URL:** `http://localhost:3000/config`
- **Description:** Returns configuration details such as port number, Spotify client IDs, and YouTube API keys.
- **Condition:** Available only if `NODE_ENV=development` and `ENABLE_AUTH_ROUTES=true`.
- **Example:**
  ```
  http://localhost:3000/config
  ```

##### b. **Access Protected Dashboard**
- **URL:** `http://localhost:3000/dashboard`
- **Description:** A protected route that returns a welcome message along with the authenticated user's information.
- **Condition:** Accessible only to authenticated users in development mode.
- **Example:**
  ```
  http://localhost:3000/dashboard
  ```

---

#### 7. **Error Handling**

- **Scenario:** If you attempt to access the `/api/search` endpoint without any integrations enabled (`ENABLE_SPOTIFY_INTEGRATION=false` and `ENABLE_YOUTUBE_INTEGRATION=false`), you'll receive a `503 Service Unavailable` error with the message:

  ```json
  {
    "error": "No integrations are enabled for search"
  }
  ```

---

### 🛠️ **Additional Testing Considerations**

- **Environment Variables:**
    - Ensure that your environment variables (`ENABLE_SPOTIFY_INTEGRATION` and `ENABLE_YOUTUBE_INTEGRATION`) are correctly set in your `.env` files before starting the server.
    - Restart the server after making changes to environment variables to apply the new configurations.

- **Authentication Flow:**
    - To perform searches that require user authentication (e.g., Spotify searches), ensure that you've successfully authenticated via Spotify by accessing `http://localhost:3000/auth/spotify` before making search requests.

- **Testing Tools:**
    - **Browser:** Directly access the URLs via your web browser.
    - **API Clients:** Utilize tools like [Postman](https://www.postman.com/) or [Insomnia](https://insomnia.rest/) to craft and send HTTP requests, especially useful for testing various scenarios and headers.

- **Logging:**
    - Monitor your server's console output to observe the flow of requests, successful operations, and any potential errors. Winston logging provides detailed insights for debugging and verification.

---

### 📊 **Summary of Testing URLs**

| **Functionality**                     | **URL**                                       | **Condition**                                              |
|---------------------------------------|-----------------------------------------------|------------------------------------------------------------|
| Initiate Spotify Authentication       | `/auth/spotify`                               | If `ENABLE_AUTH_ROUTES=true`                              |
| Spotify Callback                      | `/auth/spotify/callback`                      | After Spotify authentication                               |
| Logout                                | `/auth/logout`                                | If `ENABLE_AUTH_ROUTES=true`                              |
| Unified Search                        | `/api/search?q=your_query`                    | Always available (results depend on integrations)          |
| Spotify-Specific Search               | `/api/spotify/search?q=your_query`            | If `ENABLE_SPOTIFY_INTEGRATION=true`                      |
| YouTube-Specific Search               | `/api/youtube/search?q=your_query`            | If `ENABLE_YOUTUBE_INTEGRATION=true`                      |
| Home (Default Route)                  | `/`                                           | Always available                                           |
| Fetch Configuration (Development)     | `/config`                                     | If `NODE_ENV=development` and `ENABLE_AUTH_ROUTES=true`   |
| Access Protected Dashboard (Development)| `/dashboard`                                 | If `NODE_ENV=development`, `ENABLE_AUTH_ROUTES=true`, and authenticated user |

---

### 📚 **Best Practices for Testing**

1. **Sequential Testing:**
    - Start by testing authentication routes to ensure users can log in and log out successfully.
    - Proceed to test the unified search endpoint with various queries to verify data aggregation from enabled integrations.

2. **Conditional Testing:**
    - Toggle `ENABLE_SPOTIFY_INTEGRATION` and `ENABLE_YOUTUBE_INTEGRATION` to `true` or `false` and observe how the `/search` endpoint responds.
    - Ensure that the application gracefully handles disabled integrations without crashing.

3. **Error Simulation:**
    - Intentionally cause errors (e.g., invalid API keys) to test the application's error handling and logging mechanisms.
    - Verify that appropriate error messages are returned to the client and logged internally.

4. **Rate Limiting:**
    - Exceed the rate limits for Spotify, YouTube, or search endpoints to ensure that rate limiting is enforced and handled correctly.
    - Observe the logged warnings and error messages when rate limits are hit.

5. **Performance Testing:**
    - Conduct load testing on the `/search` endpoint to assess how the application handles multiple simultaneous requests.
    - Monitor response times and resource utilization to identify potential bottlenecks.

6. **Security Testing:**
    - Verify that protected routes (e.g., `/dashboard`) are inaccessible without proper authentication.
    - Ensure that sensitive data is not exposed through endpoints like `/config`.

---

By following this testing guide, you can systematically verify that all components of the application are functioning as intended. Regular testing after updates or changes will help maintain the reliability and performance of the application.