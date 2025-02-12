const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET;

const getUserInfo = async (req, res) => {
  const token = req.headers.authorization?.split(' ')[1]; // Get the token from Authorization header

  if (!token) {
    return res.status(401).json({ message: 'Token is missing or invalid' });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET); // Verify and decode the token

    const user = { message: 'success', user: { email: decoded.email, name: decoded.name } };

    if (user) {
      res.json({ user });
    } else {
      res.status(404).json({ message: 'User not found' });
    }
  } catch (error) {
    console.error('Error verifying token:', error);
    res.status(401).json({ message: 'Invalid token' });
  }
};

module.exports = getUserInfo;
