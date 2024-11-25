// utils/formatter.js
function formatCount(count, region) {
  if (!count || isNaN(count)) return '0';

  const num = Number(count);

  if (region === 'IN') {
    if (num >= 1e7) {
      return (num / 1e7).toFixed(1) + 'Cr';
    } else if (num >= 1e5) {
      return (num / 1e5).toFixed(1) + 'L';
    } else if (num >= 1e3) {
      return (num / 1e3).toFixed(1) + 'k';
    } else {
      return num.toString();
    }
  } else {
    if (num >= 1e9) {
      return (num / 1e9).toFixed(1) + 'B';
    } else if (num >= 1e6) {
      return (num / 1e6).toFixed(1) + 'M';
    } else if (num >= 1e3) {
      return (num / 1e3).toFixed(1) + 'k';
    } else {
      return num.toString();
    }
  }
}

module.exports = {
  formatCount,
};
