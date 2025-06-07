const express = require('express');
const UserController = require('../controllers/UserController');
const authMiddleware = require('../middleware/authMiddleware');
const upload = require('../middleware/upload'); // Your Multer setup

const router = express.Router();

router.get('/users', authMiddleware, UserController.getAllUsers);
router.get('/profile', authMiddleware, UserController.getUserProfile);
router.delete('/profile', authMiddleware, UserController.deleteUser);
router.post(
    "/profile",
    authMiddleware,
    upload.fields([ // <-- Pastikan ini upload.fields
        { name: 'Image', maxCount: 1 },
        { name: 'sertif', maxCount: 1 }
    ]),
    UserController.updateUser
);
// --- Profile Update (POST) - Handles ONLY 'Image' as a file upload ---
// The 'sertif' field, if sent, would be treated as a regular text field in req.body.
router.put('/validate', authMiddleware, UserController.activateUser);
router.post('/logout', authMiddleware, UserController.logout);

module.exports = router;