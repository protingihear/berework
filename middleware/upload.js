const multer = require("multer");

const storage = multer.memoryStorage(); // Simpan file dalam RAM sebagai buffer
const upload = multer({ storage: storage });

module.exports = upload;