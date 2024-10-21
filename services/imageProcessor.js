const sharp = require('sharp');
const axios = require('axios');
const fs = require('fs');
const path = require('path');
const { deleteFile } = require('../utils/delete-files');


const ensureDirectoryExists = (filePath) => {
    const dir = path.dirname(filePath);
    if (!fs.existsSync(dir)) {
        // Create the directory recursively
        fs.mkdirSync(dir, { recursive: true });
    }
};

const downloadImage = async (url, filePath) => {
    try {
        // Ensure the directory exists before trying to write the file
        ensureDirectoryExists(filePath);

        const writer = fs.createWriteStream(filePath);

        // Make sure axios doesn't fail silently if the request fails
        const response = await axios.get(url, {
            responseType: 'stream',
            timeout: 10000, // Timeout in case the request takes too long
        });

        // Pipe the image stream to the file
        response.data.pipe(writer);

        // Return a promise that resolves when the file is successfully written
        return new Promise((resolve, reject) => {
            writer.on('finish', resolve);

            // If there's an error during file writing, handle it
            writer.on('error', (error) => {
                if (fs.existsSync(filePath)) {
                    // Clean up the file in case of an error
                    fs.unlink(filePath, (err) => {
                        if (err) console.error('Error cleaning up file after stream error:', err);
                    });
                }
                reject(new Error(`Failed to write the image to disk: ${error.message}`));
            });
        });
    } catch (error) {
        if (error.response) {
            throw new Error(`Failed to download image. Status: ${error.response.status}`);
        } else if (error.request) {
            throw new Error('Failed to download image: No response from server.');
        } else {
            throw new Error(`Error occurred while downloading the image: ${error.message}`);
        }
    }
};






// Function to compress images asynchronously
exports.processImages = async (inputUrls, name, serial_no, requestId) => {
    const outputUrls = [];

    for (let i = 0; i < inputUrls.length; i++) {
        const inputUrl = inputUrls[i];
        const fileName = `${name}_${requestId}_${serial_no}_${i}.jpg`;
        const filePath = path.join(__dirname, '../public/processed_images', fileName);
        // Download the image from the input URL
        await downloadImage(inputUrl, filePath);
        
        // Process and compress the image using sharp
        const compressedFilePath = path.join(__dirname, '../public/processed_images/compressed_' + fileName);
        await sharp(filePath)
            .resize(500)
            .jpeg({ quality: 50 })
            .toFile(compressedFilePath);

        outputUrls.push(compressedFilePath);
        
    }

    return outputUrls;
};