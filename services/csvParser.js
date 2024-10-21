const csv = require('csv-parser');
const fs = require('fs');
const readline = require('readline');

exports.parseCSV = (filePath) => {
    return new Promise((resolve, reject) => {
        const results = [];
        fs.createReadStream(filePath)
            .pipe(csv())
            .on('data', (data) => {
                results.push({
                    product_name: data['Product Name'],
                    input_image_urls: data['Input Image Urls'].split(',')
                });
            })
            .on('end', () => resolve(results))
            .on('error', (error) => reject(error));
    });
};

exports.validateHeaders = async (filePath, requiredHeaders) => {
    try {
        const fileStream = fs.createReadStream(filePath);
        let headers = [];

        const rl = readline.createInterface({
            input: fileStream,
            crlfDelay: Infinity
        });

        for await (const line of rl) {
            headers = line.split(',');
            // Only need to read the first line for headers
            break;
        }

        for (let header of requiredHeaders) {
            if (!headers.includes(header)) {
                return { isValid: false, missingHeader: header };
            }
        }

        fileStream.close();

        return { isValid: true };
    } catch (error) {
        console.log('error', error);
        return false;
    }
}
