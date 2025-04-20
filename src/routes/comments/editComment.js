const logger = require('../../logger');
const { Comment } = require('../../model/comment');

module.exports = async (req, res) => {
  try {
    const { content } = req.body;
    const commentId = parseInt(req.params.id);

    const result = await Comment.edit(commentId, content);

    res.status(200).json({ message: 'Updating Comment Successful', comment: result });
  } catch (err) {
    logger.error(err);
    return res.status(500).json({ message: 'Updating Comment Failed' });
  }
};
