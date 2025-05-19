const logger = require('../../logger');
const { Post } = require('../../model/post');

module.exports = async (req, res) => {
  try {
    logger.info('LikedPost Activity Reading Triggered');
    const userId = req.user.userId;
    const page = parseInt(req.query.page) || 1;

    const data = await Post.readLikedPost(userId, page);
    const likedPosts = data.likedPosts.map((item) => item.post);

    res.status(200).json({
      message: 'Reading All Post Activity Successful',
      likedPosts: likedPosts,
      totalLikedPosts: data.totalLikedPosts,
    });
  } catch (err) {
    logger.error(err);
    return res.status(500).json({ message: 'Reading All Post Activity Failed' });
  }
};
