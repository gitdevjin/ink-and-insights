const logger = require('../logger');

const { writePost, readPost, deletePost, writePostMedia, readPostMedia, deletePostMedia } =
  require('./data').post;

console.log(require('./data'));
console.log(require('./data').post);

class Post {
  constructor(userId, content, files, mappings) {
    this.userId = userId;
    this.content = content;
    this.files = files;
    this.mappings = mappings;
    logger.info('Post Object created');
  }

  async save() {
    try {
      const imageUrls = await writePostMedia(this.files);
      logger.info(imageUrls);

      await writePost(this.userId, this.content, imageUrls, this.mappings);
    } catch (err) {
      logger.error('Post save failed', err);
      throw err;
    }
  }
  update() {}
  delete() {}
  readAll() {}
  readOne() {}
}

module.exports.Post = Post;
