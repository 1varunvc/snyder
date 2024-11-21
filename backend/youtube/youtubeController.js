// backend/youtube/youtubeController.js
const youtubeService = require('./youtubeService');

exports.searchVideos = async (req, res, next) => {
  try {
    const { query } = req.query;
    if (!query) {
      return res.status(400).json({ error: 'Query parameter is required.' });
    }

    const results = await youtubeService.searchVideos(query);
    res.json(results);
  } catch (error) {
    next(error);
  }
};
