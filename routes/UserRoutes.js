const express = require('express');
const UserController = require('../controllers/UserController');
const authMiddleware = require('../middleware/authMiddleware');
const upload = require('../middleware/upload');

const router = express.Router();

router.get('/users', authMiddleware, UserController.getAllUsers);
router.get('/profile', authMiddleware, UserController.getUserProfile);
router.delete('/profile', authMiddleware, UserController.deleteUser);
router.put('/profile', 
    authMiddleware, 
    upload.fields([
        { name: 'Image', maxCount: 1 },
        { name: 'sertif', maxCount: 1 }
    ]), 
    UserController.updateUser
);
router.put('/validate',authMiddleware,UserController.activateUser);
router.post('/logout', authMiddleware, UserController.logout);

module.exports = router;
