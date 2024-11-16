const jwt = require('jsonwebtoken');

const authenticateJWT = (req, res, next) => {
  // Get the token from the Authorization header
  const token = req.headers.authorization?.split(' ')[1]; // "Bearer <token>"
  
  if (!token) {
    return res.status(401).json({ message: 'No token provided, authorization denied' });
  }

  // Verify the token and decode it
  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) {
      return res.status(401).json({ message: 'Invalid or expired token' });
    }

    // Attach the decoded user information to the request object
    req.user = decoded; // e.g., { id, email, username }

    // Move to the next middleware or route handler
    next();
  });
};

module.exports = authenticateJWT;
