const { readProfile, updateProfile, updateImageUrl, storeImage, readProfileImage } =
  require('./data').profile;

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

  async updateProfileImage(file) {
    const imageUrl = await storeImage(file);
    return await updateImageUrl(this.userId, imageUrl);
  }

  static async getProfileImage(key) {
    return await readProfileImage(key);
  }
}

module.exports.Profile = Profile;
