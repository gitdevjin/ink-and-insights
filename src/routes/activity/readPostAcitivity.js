const logger = require('../../logger');
const { Post } = require('../../model/post');

module.exports = async (req, res) => {
  try {
    logger.info('PostActivity Reading Triggered');
    const userId = req.user.userId;
    const page = parseInt(req.query.page) || 1;

    const data = await Post.readAllByUser(userId, page);

    res.status(200).json({
      message: 'Reading All Liked Post Activity Successful',
      posts: data.posts,
      totalPosts: data.totalPosts,
    });
  } catch (err) {
    logger.error(err);
    return res.status(500).json({ message: 'Reading All Liked Post Activity Failed' });
  }
};
