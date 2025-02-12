const express = require('express');

const router = express.Router();

router.post('/api/auth/google', require('../api/auth/google'));

router.get('/api/user', require('../api/user'));

router.get('/', (req, res) => {
  // Client's shouldn't cache this response (always request it fresh)
  res.setHeader('Cache-Control', 'no-cache');
  // Send a 200 'OK' response
  res.status(200).json("it's home, and healthy");
});

module.exports = router;
