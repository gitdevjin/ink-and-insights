const logger = require('../logger');
const { Post } = require('../model/post');

module.exports = async (req, res) => {
  try {
    logger.info('Reading Top Posts Triggered');
    const numOfPost = parseInt(req.query.postNum) || 10;
    const standard = req.query.standard || 'view';

    const data = await Post.readTopPost(numOfPost, standard);

    res.status(200).json({
      message: 'Reading All BookReviews Successful',
      posts: data,
    });
  } catch (err) {
    logger.error(err);
    return res.status(500).json({ message: 'Reading All BookReview Failed' });
  }
};
