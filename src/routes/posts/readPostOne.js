const logger = require('../../logger');
const { Post } = require('../../model/post');

module.exports = async (req, res) => {
  try {
    logger.info('readPostOne Route Triggered');

    const userId = req.user.userId;
    const postId = parseInt(req.params.id);

    const { post, liked } = await Post.readOne(userId, postId);
    res.setHeader('Cache-Control', 'no-store');
    res.status(200).json({ message: 'Reading One Post Successful', data: post, liked: !!liked });
  } catch (err) {
    logger.error(err);
    return res.status(500).json({ message: 'Reading One Post Failed' });
  }
};
