const logger = require('../../../logger');
const prisma = require('./prisma');

async function readProfile(userId) {
  logger.info('readProfile Triggered');
  return await prisma.profile.findFirst({ where: { userId } });
}

async function updateProfile(profile) {
  logger.info('updateProfile Triggered');
  logger.info(profile);
  return await prisma.profile.update({
    where: { userId: profile.userId },
    data: {
      nickname: profile.nickname,
      firstName: profile.firstName,
      lastName: profile.lastName,
      dob: profile.dob,
      bio: profile.bio,
      location: profile.location,
    },
  });
}

module.exports.readProfile = readProfile;
module.exports.updateProfile = updateProfile;
