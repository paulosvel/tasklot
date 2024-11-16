const express = require('express');
const { getTasks } = require('../controllers/taskController');
const authenticateJWT = require('../middleware/authMiddleware');
const router = express.Router();

router.get('/', authenticateJWT, getTasks);

module.exports = router;