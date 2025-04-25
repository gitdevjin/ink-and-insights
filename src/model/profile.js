const { readProfile, updateProfile } = require('./data').profile;

class Profile {
  constructor(userId) {
    this.userId = userId;
  }

  static async readOne(userId) {
    return await readProfile(userId);
  }

  /**
  @profile is object 
  * **/
  static async edit(profile) {
    return await updateProfile(profile);
  }
}

module.exports.Profile = Profile;
