const express = require('express');
const router = express.Router();
const { googleLogin, googleRefresh, googleLogout } = require('../auth/google');

router.post('/google/login', googleLogin);
router.post('/google/refresh', googleRefresh);
router.post('/google/logout', googleLogout);

const ACCESS_SECRET = process.env.ACCESS_TOKEN_SECRET;
const jwt = require('jsonwebtoken');

router.get('/test', (req, res) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) return res.status(401).json({ error: 'Unauthorized' });

  try {
    const { email, name } = jwt.verify(token, ACCESS_SECRET);
    res.json({ email: email, name: name });
  } catch {
    res.status(403).json({ error: 'Invalid or expired token' });
  }
});

module.exports = router;
