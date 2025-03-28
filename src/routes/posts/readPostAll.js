const logger = require('../../logger');
const { Post } = require('../../model/post');

module.exports = async (req, res) => {
  try {
    logger.info('Bookreview Reading Triggered');
    const subcategory = req.params.subcategory;
    const page = parseInt(req.query.page) || 1;

    const data = await Post.readAll(subcategory, page);

    res
      .status(200)
      .json({
        message: 'Reading All BookReviews Successful',
        posts: data.posts,
        totalPosts: data.totalPosts,
      });
  } catch (err) {
    logger.error(err);
    return res.status(500).json({ message: 'Reading All BookReview Failed' });
  }
};
