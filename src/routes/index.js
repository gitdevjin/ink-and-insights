const express = require('express');
const { googleLogin, googleRefresh, googleLogout } = require('../api/auth/google');
const router = express.Router();

const ACCESS_SECRET = process.env.ACCESS_TOKEN_SECRET;
const jwt = require('jsonwebtoken');

router.post('/api/auth/google/login', googleLogin);
router.post('/api/auth/google/refresh', googleRefresh);
router.post('/api/auth/google/logout', googleLogout);

router.get('/api/auth/test', (req, res) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) return res.status(401).json({ error: 'Unauthorized' });

  try {
    const { userId } = jwt.verify(token, ACCESS_SECRET);
    res.json({ userId, name: 'John Doe', email: 'john@example.com' });
  } catch {
    res.status(403).json({ error: 'Invalid or expired token' });
  }
});

router.get('/api/user', require('../api/user'));
router.get('/', (req, res) => {
  // Client's shouldn't cache this response (always request it fresh)
  res.setHeader('Cache-Control', 'no-cache');
  // Send a 200 'OK' response
  res.status(200).json("it's home, and healthy");
});

module.exports = router;
