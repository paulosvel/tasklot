const db = require('../config/db');

exports.getTasks = async (req, res) => {
  try {
    const teamId = req.user.team_id; 
    const result = await db.query('SELECT * FROM tasks WHERE team_id = $1', [teamId]);

    res.status(200).json(result.rows);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching tasks', error: error.message });
  }
};
