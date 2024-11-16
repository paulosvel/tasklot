const express = require('express');
const userController = require('../controllers/userController');
const authenticateJWT = require('../middleware/authMiddleware');
const router = express.Router();

router.post('/register', userController.registerUser);
router.post('/login', userController.loginUser);
router.get("/me", authenticateJWT, userController.getMe);

module.exports = router;

