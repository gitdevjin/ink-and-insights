const logger = require('../../logger');
const { Post } = require('../../model/post');

module.exports = async (req, res) => {
  try {
    logger.info('handleLike Route Triggered');
    const userId = req.user.userId;
    const postId = parseInt(req.params.id);

    const like = await Post.toggleLike(userId, postId);

    // TO DO : update total like count;

    res.status(200).json({ data: like });
  } catch (err) {
    logger.error(err);
    return res.status(500).json({ message: 'Reading One Post Failed' });
  }
};
