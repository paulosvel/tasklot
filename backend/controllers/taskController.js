const db = require('../config/db');

exports.getTasks = async (req, res) => {
  try {
    const userId = req.user.id; // Get user ID from the decoded JWT
    const userResult = await db.query('SELECT team_id FROM users WHERE id = $1', [userId]);

    if (userResult.rows.length === 0) {
      return res.status(404).json({ message: 'User not found' });
    }

    const teamId = userResult.rows[0].team_id; // Get the team_id from the user record

    // Fetch tasks for the specific team
    const result = await db.query('SELECT * FROM tasks WHERE team_id = $1', [teamId]);

    res.status(200).json(result.rows);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching tasks', error: error.message });
  }
};