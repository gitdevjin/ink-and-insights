const express = require('express');
const router = express.Router();
const authenticate = require('../auth/authenticate');
const multer = require('multer');

const upload = multer({ storage: multer.memoryStorage() });

router.use('/auth', require('./auth'));

router.post('/auth/test', authenticate, (req, res) => {
  res.status(200).json({ message: 'You are Authenticated' });
});

router.post('/post/test', upload.array('images'), (req, res) => {
  console.log('**REQUEST BODY;');
  console.log(req.body);
  console.log(req.files);

  console.log('**REQUEST BODY;');
  res.status(200).json({ message: 'Recieved' });
});

router.get('/', (req, res) => {
  // Client's shouldn't cache this response (always request it fresh)
  res.setHeader('Cache-Control', 'no-cache');
  // Send a 200 'OK' response
  res.status(200).json("it's home, and healthy");
});

module.exports = router;
