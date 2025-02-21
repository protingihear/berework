const express = require('express');
const UserController = require('../controllers/UserController');
const authMiddleware = require('../middleware/authMiddleware');
const upload = require('../middleware/upload');

const router = express.Router();

router.get('/users', authMiddleware, UserController.getAllUsers);
router.get('/profile', authMiddleware, UserController.getUserProfile);
router.put('/profile', authMiddleware, upload.single("Image"), UserController.updateUser);
router.delete('/profile', authMiddleware, UserController.deleteUser);
router.post('/logout', authMiddleware, UserController.logout);

module.exports = router;
