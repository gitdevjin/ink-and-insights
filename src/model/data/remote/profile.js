const logger = require('../../../logger');
const prisma = require('./prisma');

async function readProfile(userId) {
  logger.info('readProfile Triggered');
  return await prisma.profile.findFirst({ where: { userId } });
}

module.exports.readProfile = readProfile;
