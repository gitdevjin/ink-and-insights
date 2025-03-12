const logger = require('../../logger');
const { Post } = require('../../model/post');

module.exports = async (req, res) => {
  try {
    logger.info('readPostImage Route Triggered');
    const key = req.params.s3key;
    const media = await Post.readMedia(key);

    // Set Content-Type
    res.setHeader('Content-Type', media.ContentType || 'image/jpeg');

    res.status(200).send(media);
  } catch (err) {
    logger.error(err);
    return res.status(500).json({ message: 'Reading All BookReview Failed' });
  }
};
