const { readProfile } = require('./data').profile;

class Profile {
  constructor(userId) {
    this.userId = userId;
  }

  static async readOne(userId) {
    return await readProfile(userId);
  }
}

module.exports.Profile = Profile;
