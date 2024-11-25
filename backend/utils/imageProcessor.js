// utils/imageProcessor.js
const sharp = require('sharp');
const logger = require('./logger');

/**
 * Process an image buffer to create a square thumbnail.
 * @param {Buffer} imageBuffer - The image buffer.
 * @returns {Promise<Buffer>} The processed image buffer.
 */
async function createSquareThumbnail(imageBuffer) {
  try {
    const image = sharp(imageBuffer);
    const metadata = await image.metadata();
    const size = Math.min(metadata.width, metadata.height);

    return await image
      .extract({ width: size, height: size, left: 0, top: 0 })
      .resize(200, 200) // Resize to desired dimensions
      .toBuffer();
  } catch (error) {
    logger.error(`Error processing image: ${error}`);
    throw error;
  }
}

module.exports = {
  createSquareThumbnail,
};
