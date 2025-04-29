const express = require('express');
const router = express.Router();

router.get('/read/:id', require('./readProfile'));
router.put('/edit/:id', require('./editProfile'));
router.get('/read/image/:id', require('./readProfileImage'));

module.exports = router;
