const express = require('express');
const router = express.Router();

router.get('/comment', require('./readCommentActivity'));
router.get('/post', require('./readPostAcitivity'));
router.get('/likedPost', require('./readLikedPostActivity'));

module.exports = router;
