// utils/imageProcessor.js
const sharp = require('sharp');
const logger = require('./logger');
const path = require('path');
const fs = require('fs');

/**
 * Function to crop an image to a square.
 * @param {string} imageUrl - The URL of the image to process.
 * @param {string} outputFilename - The filename for the processed image.
 * @returns {Promise<string>} - A promise that resolves to the path of the processed image.
 */
async function cropImageToSquare(imageUrl, outputFilename) {
  try {
    const response = await axios({
      method: 'get',
      url: imageUrl,
      responseType: 'arraybuffer',
    });

    const imageBuffer = Buffer.from(response.data, 'binary');

    const outputPath = path.join(__dirname, '../public/images', outputFilename);

    await sharp(imageBuffer)
      .resize({ width: 500, height: 500, fit: 'cover' })
      .toFile(outputPath);

    logger.debug(`Image processed and saved to ${outputPath}`);
    return outputPath;
  } catch (error) {
    logger.error('Error processing image:', error);
    throw error;
  }
}

module.exports = {
  cropImageToSquare,
};
