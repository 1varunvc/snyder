// config/productionHouses.js
const normalizeText = (text) => text.toLowerCase().replace(/[^\w\s]/gi, '');

const productionHouses = [
  'Sony Music Entertainment',
  'Universal Music Group',
  'Warner Music Group',
  'Sony Music India',
  'SonyMusicIndiaVEVO',
  'Zee Music Company',
  'T-Series',
  'Tips Official',
  'YRF',
  'SonyMusicSouthVEVO',
  'Aditya Music',
  'Lahari Music',
  'Eros Now',
  'Zee Music South',
  'Think Music India',
  'Aditya Music',
  'Mango Music',
  'Saregama Music',
  'Speed Records',
  'Geet MP3',
  'White Hill Music',
  'T-Series Apna Punjab',
  'T-Series Telugu',
  'T-Series Tamil',
  'T-Series Kannada',
  'T-Series Malayalam',
  'T-Series Marathi',
  'T-Series Gujarati',
  'T-Series Haryanvi',
  'T-Series Bhojpuri',
  'T-Series Bhakti Sagar',
  'T-Series Kids Hut',
  'T-Series Classics',
  'T-Series Regional',
  'T-Series Islamic Music',
  'T-Series StageWorks'
  // Add more known production house names here
];

const normalizedProductionHouses = productionHouses.map(normalizeText);

module.exports = normalizedProductionHouses;
