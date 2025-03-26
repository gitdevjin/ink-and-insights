const express = require('express');
const router = express.Router();
const logger = require('../logger');
const authenticate = require('../auth/authenticate');

router.use('/auth', require('./auth'));

router.use('/images/:s3key', require('../routes/posts/readPostImage'));
router.use('/post', authenticate, require('./posts'));

router.use('/api', require('./api'));

router.get('/', (req, res) => {
  // Client's shouldn't cache this response (always request it fresh)
  res.setHeader('Cache-Control', 'no-cache');
  // Send a 200 'OK' response
  res.status(200).json("it's home, and healthy");
  logger.info('Healthy');
});

module.exports = router;
