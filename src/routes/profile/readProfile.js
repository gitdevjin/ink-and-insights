const logger = require('../../logger');
const { Profile } = require('../../model/profile');

module.exports = async (req, res) => {
  try {
    logger.info('Profile Reading Triggered');
    const userId = req.params.id;

    if (req.user.userId !== userId) {
      res.status(403).json({ message: 'You are not allowed to access this profile' });
      return;
    }

    const data = await Profile.readOne(userId);

    res.status(200).json({
      message: 'Reading User Profile Successful',
      profile: data,
    });
  } catch (err) {
    logger.error(err);
    return res.status(500).json({ message: 'Reading All Comments Failed' });
  }
};
