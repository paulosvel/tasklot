const db = require('../config/db');

// Create a new team
exports.createTeam = async (req, res) => {
  const { name } = req.body;
  const userId = req.user.id; // Get the user ID from the JWT token

  try {
    const result = await db.query(
      'INSERT INTO teams (name, admin_id) VALUES ($1, $2) RETURNING *',
      [name, userId]
    );

    res.status(201).json(result.rows[0]); // Return the created team
  } catch (error) {
    res.status(500).json({ message: 'Error creating team', error: error.message });
  }
};

// Get all teams for the logged-in user
exports.getTeams = async (req, res) => {
  const userId = req.user.id; // Get the user ID from the JWT token

  try {
    const result = await db.query('SELECT * FROM teams WHERE admin_id = $1', [userId]);
    res.status(200).json(result.rows); // Return the list of teams
  } catch (error) {
    res.status(500).json({ message: 'Error fetching teams', error: error.message });
  }
};