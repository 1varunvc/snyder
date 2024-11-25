// middleware/regionMiddleware.js
const { detectRegion } = require('../utils/regionDetector');

function regionMiddleware(req, res, next) {
  req.region = detectRegion(req);
  next();
}

module.exports = regionMiddleware;
