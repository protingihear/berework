const express = require('express');
const AuthController = require('../controllers/AuthController');

const router = express.Router();

router.post('/register', AuthController.register);
router.post('/login', AuthController.login);
router.get('/session', AuthController.getSession);
router.post('/logout', AuthController.logout);

module.exports = router;
