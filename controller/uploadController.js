const response = require('../response');
const httpStatus = require('http-status');
const commonService = require('../services/common');
const csv = require('csv-parser');
const fs = require('fs');
const imageProcessor = require('../services/imageProcessor');
const { deleteFile } = require('../utils/delete-files');
const { v4: uuidv4 } = require('uuid');
const csvParserService = require('../services/csvParser');
const db = require('../models/index').sequelize;



// exports.uploadCSV = async (req, res) => {
//     try {
//         console.log(" inside the controller")
//         const file = req.files[0];
//         if (!file) {
//             return res.status(400).json({ message: 'CSV file is required' });
//         }

//         // Parse the CSV data
//         const products = await csvParser.parseCSV(file.path);

//         // Generate unique request ID
//         const requestId = uuidv4();
//         console.log(requestId)

//         // Insert request into the database
//         const [requestResult] = await db.query(`INSERT INTO requests (request_id, status) VALUES (?, 'PENDING')`, [requestId]);

//         // Insert products into the database
//         const productPromises = products.map(async (product) => {
//             const inputUrls = product.input_image_urls.join(',');
//             await db.query(`INSERT INTO products (request_id, product_name, input_image_urls) VALUES (?, ?, ?)`, [requestId, product.product_name, inputUrls]);
//         });
//         await Promise.all(productPromises);

//         return res.status(200).json({ requestId });
//     } catch (error) {
//         console.error('Upload Error:', error);
//         return res.status(500).json({ message: 'Server Error' });
//     }
// };



exports.uploadCSV = async (req, res) => {
    const dbTrans = await db.transaction();
    try {
        const { Products, Requests } = db.models;
        const products = [];
        const { webhook_url } = req.body;

        // Generate unique request ID
        const requestId = uuidv4();

        const requiredHeaders = ['S. No.', 'Product Name', 'Input Image Urls'];
        const { isValid, missingHeader } = await csvParserService.validateHeaders(req.files[0].path, requiredHeaders);
        if (!isValid) {
            deleteFile(req.files[0].path);
            return response.error(req, res, { msgCode: "INVALID_HEADER", data: `${missingHeader} is required` }, httpStatus.BAD_REQUEST, dbTrans);
        }

        fs.createReadStream(req.files[0].path)
            .pipe(csv())
            .on('data', async (row) => {
                const productData = {
                    serial_no: row['S. No.'],
                    product_name: row['Product Name'],
                    input_image_urls: row['Input Image Urls']
                };

                // Check if all properties of productData are empty
                if (!Object.values(productData).every(x => (x === ''))) {
                    if (productData.product_name === '' && productData.input_image_urls === '') {
                        await deleteFile(req.files[0].path);
                        return response.error(req, res, { msgCode: "INVALID_DATA" }, httpStatus.BAD_REQUEST, dbTrans);
                    }
                    products.push(productData);
                }
            })
            .on('end', async () => {
                // Insert the data into the database
                for (let row of products) {
                    // console.log("inside for loop")
                    const product = await commonService.addDetail(Products, {
                        ...row,
                        request_id: requestId
                    }, dbTrans);
                    // console.log(product);

                    if (!product) {
                        await deleteFile(req.files[0].path);
                        return response.error(req, res, { msgCode: "ERROR_CREATING_PRODUCT" }, httpStatus.BAD_REQUEST, dbTrans);
                    }
                }


                // Insert the request into the database
                let request = await commonService.addDetail(Requests, { request_id: requestId }, dbTrans);
                if (!request) {
                    await deleteFile(req.files[0].path);
                    return response.error(req, res, { msgCode: "ERROR_CREATING_REQUEST" }, httpStatus.BAD_REQUEST, dbTrans);
                }


                // Start processing the images asynchronously
                const processImages = async () => {
                    try {
                        let request = await commonService.updateData(Requests, { status: 'IN_PROGRESS' }, { request_id: requestId });
                        const productEntries = await commonService.getList(Products, { request_id: requestId }, {});
                        for (let product of productEntries.rows) {
                            const inputUrls = product.input_image_urls.replace(/\n/g, '').split(',');
                            const outputUrls = await imageProcessor.processImages(inputUrls, product.product_name, product.serial_no, requestId);
                            let updateProduct = await commonService.updateData(Products, { output_image_urls: outputUrls.join(',') }, { id: product.id });
                        }
                        request = await commonService.updateData(Requests, { status: 'COMPLETED' }, { request_id: requestId });
                        
                        // Trigger the webhook once image processing is complete
                        if (webhook_url) {
                            sendWebhookNotification(webhook_url, requestId, 'COMPLETED');
                        }
                        await deleteFile(req.files[0].path);

                    } catch (error) {
                        console.log('Error processing images:', error);

                        // Trigger the webhook on failure
                        if (webhook_url) {
                            sendWebhookNotification(webhook_url, requestId, 'FAILED', error.message);
                        }
                    }
                };
                processImages();  // Asynchronous image processing

                return response.success(req, res, { msgCode: "PRODUCTS_UPLOADED", data: requestId }, httpStatus.OK, dbTrans);
            });
    }
    catch (err) {
        console.log('error', err);
        await deleteFile(req.files[0].path);
        await commonService.updateData(Requests, { status: 'FAILED' }, { request_id: requestId });
        return response.error(req, res, { msgCode: "INTERNAL_SERVER_ERROR" }, httpStatus.INTERNAL_SERVER_ERROR, dbTrans);
    }
}


// Function to send a POST request to the webhook URL with relevant data
const sendWebhookNotification = async (webhookUrl, requestId, status, errorMessage = null) => {
    try {
        const payload = {
            requestId,
            status,
            ...(errorMessage && { error: errorMessage })  // Include error message if it exists
        };

        // Send a POST request to the webhook URL
        await axios.post(webhookUrl, payload);
        console.log(`Webhook sent successfully for request ${requestId}`);
    } catch (error) {
        console.error(`Failed to send webhook for request ${requestId}:`, error.message);
    }
};