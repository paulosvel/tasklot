const express = require('express');
const { createTeam, getTeams } = require('../controllers/teamController');
const authenticateJWT = require('../middleware/authMiddleware');
const router = express.Router();

// Route to create a new team
router.post('/', authenticateJWT, createTeam);

// Route to get all teams for the logged-in user
router.get('/', authenticateJWT, getTeams);

module.exports = router;