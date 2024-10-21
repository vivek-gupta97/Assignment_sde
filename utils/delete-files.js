const fs = require('fs');
 
exports.deleteFile = async (fileName) => {
    return new Promise((resolve, reject) => {
        fs.unlink(fileName, (err) => {
            if (err) {
                console.error(`Error deleting file '${fileName}':`, err);
                reject(err); // Reject the promise with the error
            } else {
                console.log(`File '${fileName}' deleted successfully`);
                resolve(); // Resolve the promise if deletion is successful
            }
        });
    });
};