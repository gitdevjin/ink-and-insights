const express = require('express');
const router = express.Router();

router.get('/categories', require('./getCategories'));

module.exports = router;
