const express = require('express');
const router = express.Router();
const multer = require('multer');
const upload = multer({ storage: multer.memoryStorage() });

router.post('/post', upload.array('images'), require('./postBookReview'));

module.exports = router;
