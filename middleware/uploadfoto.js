const multer = require("multer");

const storage = multer.memoryStorage(); // Simpan file langsung di memori
console.log("sini")
const upload = multer({
    	
    storage: storage,
    limits: { fileSize: 5 * 1024 * 1024 }, // Maksimum 5MB
    fileFilter: (req, file, cb) => {
        const filetypes = /jpeg|jpg|png/;
        const mimetype = filetypes.test(file.mimetype);
        if (mimetype) {
            return cb(null, true);
        }
        cb(new Error("Format file tidak valid! Hanya JPEG, JPG, atau PNG."));
    },
});

module.exports = upload;