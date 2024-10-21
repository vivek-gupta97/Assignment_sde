const multer = require('multer');
const path = require('path');


// Define storage settings for multer
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/'); // Specify the destination folder where uploaded files will be stored
    },
    filename: function (req, file, cb) {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, uniqueSuffix + path.extname(file.originalname)); // Generate unique filenames
    }
});

// Define file type filter
const fileFilter = function (req, file, cb) {
    console.log('sss', file);
    // Define accepted mime types and corresponding file extensions
    const acceptedTypes = [
        'application/msword', // DOC
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document', // DOCX
        'application/vnd.ms-excel', // XLS
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', // XLSX
        'text/csv' //CSV
    ];

    // Check if the uploaded file's MIME type is in the accepted types array
    if (acceptedTypes.includes(file.mimetype)) {
        cb(null, true); // Accept file
    } else {
        cb(new Error('Invalid file type. Only CSV files are allowed.'), false); // Reject file
    }
};

// Initialize multer instance with storage and file type filter
const upload = multer({
    storage: storage,
    fileFilter: fileFilter,
    limits: {
        fileSize: 1024 * 1024 * 5 // Set max file size (5 MB in this case)
    }
});

module.exports = upload


// const multer = require('multer');
// const path = require('path');

// const storage = multer.diskStorage({
//     destination: function (req, file, cb) {
//         cb(null, 'uploads/');
//     },
//     filename: function (req, file, cb) {
//         cb(null, `${Date.now()}_${path.basename(file.originalname)}`);
//     }
// });

// const upload = multer({ storage: storage });

// module.exports = upload;
