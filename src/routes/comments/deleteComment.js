const logger = require('../../logger');
const { Comment } = require('../../model/comment');
const { Post } = require('../../model/post');

module.exports = async (req, res) => {
  logger.info('delete Post Triggered');
  try {
    const { postId } = req.body;
    const numPostId = parseInt(postId);
    const commentId = parseInt(req.params.id);

    const oldComment = await Comment.readOne(commentId);

    if (oldComment.userId !== req.user.userId) {
      res.status(403).json({ message: 'You have no right to Delete this post' });
    }

    const result = await Comment.delete(commentId);
    if (result) {
      Post.handleCommentCount(numPostId, false);
    }

    logger.info('deleted Item:', result);

    res.status(200).json({ message: 'Delete Post Successful', data: result });
  } catch (err) {
    logger.error(err);
    return res.status(500).json({ message: 'Delete Post Failed' });
  }
};
