const logger = require('../../logger');
const { Post } = require('../../model/post');

module.exports = async (req, res) => {
  try {
    logger.info('readPostImage Route Triggered');
    const key = req.params.s3key;
    logger.info(key);
    const media = await Post.readMedia(key);
    logger.info(media);

    // Set Content-Type
    res.setHeader('Content-Type', media.contentType);

    res.status(200).send(media.buffer);
  } catch (err) {
    logger.error(err);
    return res.status(500).json({ message: 'Reading Post Image Failed' });
  }
};
