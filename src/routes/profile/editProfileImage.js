const logger = require('../../logger');
const { Profile } = require('../../model/profile');

module.exports = async (req, res) => {
  try {
    const file = req.file;
    const userId = req.params.id;

    if (userId !== req.user.userId) {
      res.status(403).json({ message: 'You have no right to update this profile' });
    }

    const profile = new Profile(userId);
    const updatedProfile = await profile.updateProfileImage(file);

    res
      .status(200)
      .json({ message: 'Editing Profile Image Successful', imageUrl: updatedProfile.imageUrl });
  } catch (err) {
    logger.error(err);
    return res.status(500).json({ message: 'Editing Profile Image Failed' });
  }
};
