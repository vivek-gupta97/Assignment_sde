const express = require('express');
const router = express.Router();
const fileUpload = require('../../utils/multer');
const uploadController = require('../../controller/uploadController');
const statusController = require('../../controller/statusController');

const multer = require('multer');
const upload = multer({ dest: 'uploads/' }); // Store files temporarily in "uploads" folder

router.post('/upload', fileUpload.array('files', 1), uploadController.uploadCSV);
router.get('/status/:requestId', statusController.checkStatus);

module.exports = router;
