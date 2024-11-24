// utils/formatter.js
const logger = require('./logger');

/**
 * Function to format numerical counts based on the user's region.
 * @param {string|number} count - The numerical count to format.
 * @param {string} region - The user's region code (e.g., 'IN' for India).
 * @returns {string} - The formatted count.
 */
function formatCount(count, region) {
  const num = Number(count);
  if (isNaN(num)) {
    return 'N/A';
  }

  if (region === 'IN') {
    // Formatting for India
    if (num >= 1e7) {
      return (num / 1e7).toFixed(1) + ' Cr';
    } else if (num >= 1e5) {
      return (num / 1e5).toFixed(1) + ' L';
    } else if (num >= 1e3) {
      return (num / 1e3).toFixed(1) + ' T';
    }
  } else {
    // Formatting for other regions
    if (num >= 1e9) {
      return (num / 1e9).toFixed(1) + 'B';
    } else if (num >= 1e6) {
      return (num / 1e6).toFixed(1) + 'M';
    } else if (num >= 1e3) {
      return (num / 1e3).toFixed(1) + 'K';
    }
  }

  return num.toString();
}

module.exports = {
  formatCount,
};
