const logger = require('../../logger');
const { Comment } = require('../../model/comment');
const { Post } = require('../../model/post');

module.exports = async (req, res) => {
  try {
    const { content, postId } = req.body;
    const numPostId = parseInt(postId);

    const comment = new Comment(req.user.userId, numPostId, content);
    const result = await comment.save();

    if (result) {
      await Post.handleCommentCount(numPostId, true);
    }

    res.status(200).json({ message: 'Creating Comment Successful', data: result });
  } catch (err) {
    logger.error(err);
    return res.status(500).json({ message: 'Creating Comment Failed' });
  }
};
