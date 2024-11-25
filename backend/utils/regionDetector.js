// utils/regionDetector.js
function detectRegion(req) {
  // Check if region is provided in headers
  const region = req.headers['x-region'] || req.headers['x-locale'];

  if (region) {
    return region.toUpperCase();
  }

  // Default region
  return 'IN';
}

module.exports = {
  detectRegion,
};
