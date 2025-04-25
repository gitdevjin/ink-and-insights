const logger = require('../../logger');
const { Profile } = require('../../model/profile');

module.exports = async (req, res) => {
  try {
    logger.info('Profile Reading Triggered');
    const userId = req.params.id;
    const profile = req.body;

    logger.info(profile);

    if (req.user.userId !== userId) {
      res.status(403).json({ message: 'You are not allowed to edit this profile' });
      return;
    }

    const data = await Profile.edit(profile);

    res.status(200).json({
      message: 'Editing Profile Successful',
      profile: data,
    });
  } catch (err) {
    logger.error(err);
    return res.status(500).json({ message: 'Editing Profile Failed' });
  }
};
