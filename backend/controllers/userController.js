const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const db = require('../db');

// Register a user
exports.registerUser = async (req, res) => {
  const {email, password } = req.body;

  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const result = await db.query(
      'INSERT INTO users (email, password) VALUES ($1, $2) RETURNING id, email',
      [ email, hashedPassword]
    );

    res.status(201).json({ message: 'User registered', user: result.rows[0] });
  } catch (error) {
    res.status(500).json({ message: 'Error registering user', error: error.message });
  }
};

// Login a user
exports.loginUser = async (req, res) => {
  const { email, password } = req.body;

  try {
    const result = await db.query('SELECT * FROM users WHERE email = $1', [email]);

    if (result.rows.length === 0) {
      return res.status(400).json({ message: 'Invalid email or password' });
    }

    const user = result.rows[0];
    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid email or password' });
    }

    const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, { expiresIn: '1h' });

    res.status(200).json({ message: 'Login successful', token, user: { id: user.id, email: user.email } });
  } catch (error) {
    res.status(500).json({ message: 'Error logging in', error: error.message });
  }
};
