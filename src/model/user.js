const { createUser, updateRefreshToken, getUserById } = require('./data').user;

class User {
  static async create(email, givenName, familyName) {
    return await createUser(email, givenName, familyName);
  }

  static async updateToken(userId, refreshToken) {
    await updateRefreshToken(userId, refreshToken);
  }

  static async findUserById(userId) {
    return await getUserById(userId);
  }
}

module.exports.User = User;
