const logger = require('../../logger');
const { Post } = require('../../model/post');

module.exports = async (req, res) => {
  logger.info('delete Post Triggered');
  try {
    const postId = parseInt(req.params.id);

    const { post } = await Post.readOne(req.user.userId, postId);

    if (post.userId !== req.user.userId) {
      res.status(403).json({ message: 'You have no right to Delete this post' });
    }

    await Post.delete(postId);

    res.status(200).json({ message: 'Delete Post Successful' });
  } catch (err) {
    logger.error(err);
    return res.status(500).json({ message: 'Delete Post Failed' });
  }
};
