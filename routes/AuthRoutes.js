const express = require('express');
const AuthController = require('../controllers/AuthController');
const upload = require("../middleware/upload");

const router = express.Router();

// Register: upload file gambar
router.post('/register', upload.single("Image"), AuthController.register);

// Login dan Session
router.post('/login', AuthController.login);
router.get('/session', AuthController.getSession);

// 🔐 Tambahan: Forgot & Reset Password
router.post('/forgot-password', AuthController.forgotPassword);
router.post('/reset-password', AuthController.resetPassword);

module.exports = router;
