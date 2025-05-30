const express = require('express');
const router = express.Router();

router.post('/write', require('./writeComment'));
router.get('/list/:id', require('./readCommentAll'));
router.put('/edit/:id', require('./editComment'));
router.delete('/delete/:id', require('./deleteComment'));

module.exports = router;
