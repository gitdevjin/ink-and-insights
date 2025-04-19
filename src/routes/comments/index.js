const express = require('express');
const router = express.Router();

router.post('/write', require('./writeComment'));
router.get('/list/:id', require('./readCommentAll'));
router.put('/edit/:id', require('./editComment'));

module.exports = router;
