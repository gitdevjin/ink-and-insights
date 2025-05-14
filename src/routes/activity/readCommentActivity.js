const logger = require('../../logger');
const { Comment } = require('../../model/comment');

module.exports = async (req, res) => {
  try {
    logger.info('CommentActivity Reading Triggered');
    const userId = req.user.userId;
    const page = parseInt(req.query.page) || 1;

    const data = await Comment.readAllByUser(userId, page);
    const commentCount = await Comment.getCommentCountByUser(userId);
    res.status(200).json({
      message: 'Reading All Comment Activity Successful',
      comments: data,
      totalComments: commentCount,
    });
  } catch (err) {
    logger.error(err);
    return res.status(500).json({ message: 'Reading All Comment Activity Failed' });
  }
};
