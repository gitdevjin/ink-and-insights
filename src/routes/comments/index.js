const express = require('express');
const router = express.Router();

router.post('/write', require('./writeComment'));
router.get('/list/:id', require('./readCommentAll'));

module.exports = router;
