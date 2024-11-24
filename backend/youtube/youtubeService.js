// youtube/youtubeService.js
const axios = require('axios');
const config = require('../config/config');
const { rotateApiKey } = require('./youtubeClient');
const logger = require('../utils/logger');
const productionHouses = require('./productionHouses');
const formatter = require('../utils/formatter');
const regionDetector = require('../middleware/regionMiddleware');

/**
 * Function to fetch content ratings and additional details in batch.
 * @param {Array} videoIds - An array of YouTube video IDs.
 * @param {boolean} fetchERating - Whether to fetch content ratings.
 * @returns {Promise<Object>} - A promise that resolves to an object mapping video IDs to their details.
 */
async function fetchVideoDetails(videoIds, fetchERating) {
  const apiKey = rotateApiKey();
  const params = {
    key: apiKey,
    part: 'contentDetails,contentRating,snippet,statistics',
    id: videoIds.join(','),
    fields: 'items(id,contentDetails(duration),contentRating,statistics(viewCount,likeCount,dislikeCount),snippet(tags,categoryId))',
  };

  try {
    logger.debug('Fetching video details from YouTube Videos API');
    const response = await axios.get('https://www.googleapis.com/youtube/v3/videos', { params });
    const items = response.data.items || [];

    const detailsMap = {};

    items.forEach((item) => {
      const videoId = item.id;
      detailsMap[videoId] = {
        eRating: fetchERating ? item.contentRating || {} : {},
        duration: item.contentDetails.duration,
        viewCount: item.statistics.viewCount,
        likeCount: item.statistics.likeCount,
        dislikeCount: item.statistics.dislikeCount,
        tags: item.snippet.tags || [],
        categoryId: item.snippet.categoryId,
      };
    });

    return detailsMap;
  } catch (error) {
    logger.error('Error fetching video details:', error);
    throw error;
  }
}

exports.searchVideos = async (query, region = 'US', fetchERating = true) => {
  const maxResults = 10;
  let attempt = 0;
  let success = false;
  let searchResults;

  while (attempt < config.youtube.apiKeys.length && !success) {
    const apiKey = rotateApiKey();
    // logger.debug(`Attempting YouTube API request with API Key: ${apiKey}`);
    logger.debug(`Attempting YouTube API request with API Key: {apiKey}`);

    const params = {
      key: apiKey,
      q: query,
      part: 'snippet',
      type: 'video',
      videoEmbeddable: 'true',
      maxResults,
    };

    try {
      const response = await axios.get('https://www.googleapis.com/youtube/v3/search', { params });
      searchResults = response.data.items || [];
      success = true;
      logger.info('YouTube search successful');
    } catch (error) {
      if (error.response && error.response.status === 403) {
        logger.warn(`YouTube API key ${apiKey} has reached its limit. Rotating key...`);
        await handleRateLimit(attempt); // Exponential backoff
        attempt++;
      } else {
        logger.error('Error fetching data from YouTube:', error);
        error.apiKey = apiKey;
        throw error;
      }
    }
  }

  if (!success) {
    logger.error('All YouTube API keys have reached their limit');
    throw new Error('All API keys have reached their limit.');
  }

  // Extract video IDs from search results
  const videoIds = searchResults.map((item) => item.id.videoId);

  // Fetch additional details in batch
  const videoDetailsMap = await fetchVideoDetails(videoIds, fetchERating);

  // Process search results
  const audios = [];
  const videos = [];

  searchResults.forEach((item) => {
    const videoId = item.id.videoId;
    const snippet = item.snippet;
    const details = videoDetailsMap[videoId] || {};

    // Extract relevant data
    const title = snippet.title || 'Unknown Title';
    const description = snippet.description || 'No Description Available';
    const channelTitle = snippet.channelTitle || 'Unknown Channel';
    const publishedAt = snippet.publishedAt || '';
    const videoYear = publishedAt ? new Date(publishedAt).getFullYear() : 'Unknown Year';
    const thumbnails = snippet.thumbnails || {};

    // Classify as 'Audio' or 'Video'
    const isAudio = classifyAsAudio({
      title,
      description,
      channelTitle,
      tags: details.tags,
      categoryId: details.categoryId,
    });

    // Format counts based on region
    const formattedViewCount = formatter.formatCount(details.viewCount, region);
    const formattedLikeCount = formatter.formatCount(details.likeCount, region);
    const formattedDislikeCount = formatter.formatCount(details.dislikeCount, region);

    const videoData = {
      videoId,
      title,
      videoYear,
      thumbnails,
      channelTitle,
      description,
      eRating: details.eRating,
      duration: details.duration,
      viewCount: formattedViewCount,
      likeCount: formattedLikeCount,
      dislikeCount: formattedDislikeCount,
    };

    if (isAudio) {
      audios.push(videoData);
    } else {
      videos.push(videoData);
    }
  });

  return {
    tracks: {
      audios,
      videos,
    },
    artists: [],
    albums: [],
    playlists: [],
  };
};

/**
 * Function to classify a video as 'Audio' or 'Video'.
 * @param {Object} params - Parameters containing video metadata.
 * @returns {boolean} - True if classified as 'Audio', false otherwise.
 */
function classifyAsAudio({ title, description, channelTitle, tags, categoryId }) {
  const lowerTitle = title.toLowerCase();
  const lowerDescription = description.toLowerCase();

  // Check for 'Provided to YouTube by'
  if (lowerDescription.startsWith('provided to youtube by')) {
    return true;
  }

  // Check for keywords in title
  const audioKeywords = ['official audio', 'audio', 'lyric video', 'lyrics'];
  const hasAudioKeyword = audioKeywords.some((keyword) => lowerTitle.includes(keyword));

  // Check if channelTitle matches artist name or is a known production house
  const isKnownChannel = productionHouses.includes(channelTitle);

  // Additional checks using tags and categoryId (optional)
  const isMusicCategory = categoryId === '10'; // Music category ID
  const hasMusicTags = tags && tags.includes('music');

  return hasAudioKeyword && (isKnownChannel || isMusicCategory || hasMusicTags);
}

/**
 * Utility function to create a delay in milliseconds.
 * @param {number} ms - The number of milliseconds to delay.
 * @returns {Promise} A promise that resolves after the specified delay.
 */
function delay(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
