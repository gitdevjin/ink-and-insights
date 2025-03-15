const logger = require('../../logger');
const { Post } = require('../../model/post');

module.exports = async (req, res) => {
  try {
    logger.info('readPostOne Route Triggered');

    const postId = req.params.id;
    const post = await Post.readOne(postId);
    res.setHeader('Cache-Control', 'no-store');
    res.status(200).json({ message: 'Reading One BookReview Successful', data: post });
  } catch (err) {
    logger.error(err);
    return res.status(500).json({ message: 'Reading One BookReview Failed' });
  }
};
