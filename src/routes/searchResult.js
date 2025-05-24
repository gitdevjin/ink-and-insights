const logger = require('../logger');
const { Post } = require('../model/post');

module.exports = async (req, res) => {
  try {
    logger.info('getting Sarch Result Triggered');
    const keyword = req.params.keyword;
    const numOfPost = parseInt(req.query.max) || 10;
    const page = parseInt(req.query.page) || 1;

    const data = await Post.readSearchResult(keyword, page, numOfPost);

    res.status(200).json({
      message: 'Getting all search results Successful',
      posts: data.posts,
      totalPosts: data.totalPosts,
    });
  } catch (err) {
    logger.error(err);
    return res.status(500).json({ message: 'Reading All BookReview Failed' });
  }
};
