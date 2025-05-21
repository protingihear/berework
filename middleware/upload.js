const multer = require("multer");

const storage = multer.memoryStorage(); 
const upload = multer({ 
    storage: storage,
    limits: { fileSize: 10 * 5120 * 5120 } // Batas maksimum 2MB
});

module.exports = upload;
