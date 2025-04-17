const logger = require('../../logger');
const { Comment } = require('../../model/comment');
const { Post } = require('../../model/post');

module.exports = async (req, res) => {
  try {
    logger.info('Comment Reading Triggered');
    const postId = parseInt(req.params.id);
    const page = parseInt(req.query.page) || 1;

    const data = await Comment.readAll(postId, page);
    const commentCount = await Post.getCommentCount(postId);

    res.status(200).json({
      message: 'Reading All Comments Successful',
      comments: data,
      totalComments: commentCount,
    });
  } catch (err) {
    logger.error(err);
    return res.status(500).json({ message: 'Reading All Comments Failed' });
  }
};
