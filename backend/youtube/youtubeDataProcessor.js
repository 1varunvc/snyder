// youtube/youtubeDataProcessor.js
const productionHouses = require('../config/productionHouses');
const logger = require('../utils/logger');
const { formatCount } = require('../utils/formatter');

/**
 * Normalize text by converting to lowercase and removing special characters.
 * @param {string} text - The text to normalize.
 * @returns {string} The normalized text.
 */
function normalizeText(text) {
  return text.toLowerCase().replace(/[^\w\s]/gi, '');
}

// noinspection JSUnusedLocalSymbols
/**
 * Check if the channel is an Official Artist Channel (OAC).
 * @param {string} channelId - The channel ID.
 * @returns {boolean} True if the channel is an OAC, false otherwise.
 */
function isOfficialArtistChannel(channelId) {
  // Placeholder implementation
  // You may need to call YouTube API or maintain a list of OAC channel IDs
  return false; // Placeholder
}

/**
 * Classify a video item as 'Audio' or 'Video' based on specified criteria.
 * @param {object} item - The video item from YouTube API response.
 * @returns {string} 'Audio' or 'Video' classification.
 */
function classifyVideo(item) {
  const title = normalizeText(item.snippet.title).replace(/\s+/g, '');
  const description = normalizeText(item.snippet.description);
  let channelTitle = normalizeText(item.snippet.channelTitle)
    .replace(/vevo|music| - topic/gi, '')
    .replace(/\s+/g, '');
  const channelId = item.snippet.channelId;

  logger.silly("[Step 0] Initializing variables:");
  logger.silly(`videoId: ${item.id.videoId}`);
  logger.silly(`Title: ${title}`);
  logger.silly(`Description: ${description}`);
  logger.silly(`Channel Title: ${channelTitle}`);
  logger.silly(`Channel ID: ${channelId}`);

  // Step 1: Check if description starts with 'provided to youtube by'
  if (description.startsWith('provided to youtube by')) {
    logger.silly("[Step 1] Description starts with 'provided to youtube by'. Classifying as 'Audio'.");
    return 'Audio';
  }

  logger.silly("[Step 1] Description does not start with 'provided to youtube by'. Proceeding to Step 2.");

  // Step 2: Check if title contains specified keywords
  const keywordsRegex = /(official audio|audio|lyric video|lyrics|lyrical)/;
  const containsKeywords = keywordsRegex.test(title);

  logger.silly("[Step 2] Checking for keywords in title:");
  logger.silly(`Keywords Regex: ${keywordsRegex}`);
  logger.silly(`Contains Keywords: ${containsKeywords}`);

  if (!containsKeywords) {
    logger.silly("[Step 2] Title does not contain relevant keywords. Classifying as 'Video'.");
    return 'Video';
  }

  logger.silly("[Step 2] Title contains relevant keywords. Proceeding to Step 2b.");

  // // Step 2b: Identify if the uploader is an Official Artist Channel
  // const isOfficialArtist = isOfficialArtistChannel(channelId);
  // logger.silly("[Step 2b] Checking if uploader is an Official Artist Channel:");
  // logger.silly(`Is Official Artist Channel: ${isOfficialArtist}`);
  //
  // if (isOfficialArtist) {
  //   logger.silly("[Step 2b] Uploader is an Official Artist Channel. Classifying as 'Audio'.");
  //   return 'Audio';
  // }
  //
  // logger.silly("[Step 2b] Uploader is not an Official Artist Channel. Proceeding to Step 2c.");

  // Step 2c: Fallback strategies
  logger.silly("[Step 2c] Fallback strategy: Checking if title includes channel-specific variations.");
  if (channelTitle && title.includes(channelTitle)) {
  logger.silly("[Step 2c] Title matches channel-specific variations. Classifying as 'Audio'.");
    return 'Audio';
  }

  logger.silly("[Step 2c] Title does not match channel-specific variations. Checking production houses.");

  // ii. Check if channelTitle is a known production house
  const isProductionHouse = productionHouses.includes(channelTitle);
  logger.silly("[Step 2c] Checking if channel title is a known production house:");
  logger.silly(`Is Production House: ${isProductionHouse}`);

  if (isProductionHouse) {
    logger.silly("[Step 2c] Channel is a known production house. Classifying as 'Audio'.");
    return 'Audio';
  }

  // If none of the above, classify as 'Video'
  logger.silly("[Step 2c] None of the conditions met. Classifying as 'Video'.");
  return 'Video';
}


exports.processSearchResults = (apiResults) => {
  const items = apiResults.items || [];

  const audios = [];
  const videos = [];

  items.forEach((item) => {
    if (!item || !item.id || !item.id.videoId || !item.snippet) {
      logger.warn('Incomplete data for item, skipping');
      return;
    }

    const classification = classifyVideo(item);

    const processedItem = {
      videoId: item.id.videoId,
      title: item.snippet.title || 'Unknown Title',
      videoYear: item.snippet.publishedAt
        ? new Date(item.snippet.publishedAt).getFullYear()
        : 'Unknown Year',
      thumbnails: item.snippet.thumbnails,
      channelTitle: item.snippet.channelTitle || 'Unknown Channel',
      description: item.snippet.description || 'No Description Available',
    };

    if (classification === 'Audio') {
      audios.push(processedItem);
    } else {
      videos.push(processedItem);
    }
  });

  return {
    youtube: {
      tracks: {
        audios,
        videos,
      },
      artists: [],
      albums: [],
      playlists: [],
    }
    // Similarly, the following for spotifyDataProcessor.js (once implemented.)
    // spotify: {
    //   tracks: {
    //     audios: [],
    //     videos: [],
    //   },
    //   artists: [],
    //   albums: [],
    //   playlists: [],
    // }
  };
};

exports.processVideoDetails = (apiResults) => {
  // Extract required data from video details
  const item = apiResults.items && apiResults.items[0];
  if (!item) {
    logger.warn('No video details found');
    return {};
  }

  const duration = item.contentDetails.duration; // e.g., "PT3M33S"
  const maxresThumbnail = item.snippet.thumbnails.maxres;

  // noinspection UnnecessaryLocalVariableJS
  const processedDetails = {
    videoId: item.id,
    title: item.snippet.title || 'Unknown Title',
    duration,
    thumbnails: {
      maxres: maxresThumbnail,
    },
    // Additional fields can be added as needed
  };

  return processedDetails;
};

exports.processVideoStatistics = (videoStats, region) => {
  // noinspection UnnecessaryLocalVariableJS
  const formattedStats = {
    videoId: videoStats.id,
    likes: formatCount(videoStats.likes, region),
    viewCount: formatCount(videoStats.viewCount, region),
    dislikes: formatCount(videoStats.dislikes, region),
  };
  return formattedStats;
};
