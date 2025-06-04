const logger = require('../../../logger');
const prisma = require('./prisma');

async function createUser(email, given_name, family_name) {
  const user = await prisma.user.upsert({
    where: { email: email },
    update: {}, // No need to update anything for now
    create: {
      email: email,
      profile: {
        create: {
          nickname: given_name,
          firstName: given_name,
          lastName: family_name,
          publicEmail: email,
        },
      },
    },
    include: {
      profile: true, // Fetch profile as well
    },
  });

  logger.info('User Created');
  return user;
}

async function updateRefreshToken(userId, refreshToken) {
  await prisma.user.update({ where: { id: userId }, data: { refreshToken: refreshToken } });
  logger.info('RefreshToken Updated');
}

async function getUserById(userId) {
  return await prisma.user.findUnique({ where: { id: userId } });
}

module.exports.createUser = createUser;
module.exports.updateRefreshToken = updateRefreshToken;
module.exports.getUserById = getUserById;
