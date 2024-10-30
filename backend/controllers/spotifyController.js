// controllers/spotifyController.js
const spotifyService = require('../services/spotifyService');

exports.search = async (req, res) => {
  const query = req.query.q;
  const type = req.query.type || 'track';

  if (!query) {
    return res.status(400).json({ error: 'Missing required parameter: q' });
  }

  try {
    const data = await spotifyService.search(query, type);
    res.json(data);
  } catch (error) {
    console.error('Error in spotifyController.search:', error);
    res.status(500).json({ error: 'Failed to fetch Spotify data' });
  }
};
