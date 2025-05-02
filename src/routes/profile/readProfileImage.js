const logger = require('../../logger');
const { Profile } = require('../../model/profile');

module.exports = async (req, res) => {
  try {
    logger.info('readProfileImage Route Triggered');
    const key = req.params.s3key;
    logger.info('profile image key', key);
    const image = await Profile.getProfileImage(key);

    // Set Content-Type
    res.setHeader('Content-Type', image.contentType);

    res.status(200).send(image.buffer);
  } catch (err) {
    logger.error(err);
    return res.status(500).json({ message: 'Reading Profile Image Failed' });
  }
};
