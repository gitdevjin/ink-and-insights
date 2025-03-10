const logger = require('../../logger');
const { Post } = require('../../model/post');

module.exports = async (req, res) => {
  try {
    logger.info('Bookreview Reading Triggered');
    const category = req.params.category;

    const posts = await Post.readAll(category);

    res.status(200).json({ message: 'Reading All BookReviews Successful', data: posts });
  } catch (err) {
    logger.error(err);
    return res.status(500).json({ message: 'Reading All BookReview Failed' });
  }
};
