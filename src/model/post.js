const logger = require('../logger');

const {
  writePost,
  readPost,
  deletePost,
  writePostMedia,
  readPostAll,
  readPostMedia,
  deletePostMedia,
} = require('./data').post;

console.log(require('./data').post);

class Post {
  constructor(userId, title, content, category, files, mappings) {
    this.userId = userId;
    this.title = title;
    this.content = content;
    this.category = category;
    this.files = files;
    this.mappings = mappings;
    logger.info('Post Object created');
  }

  async save() {
    try {
      const imageUrls = await writePostMedia(this.files);
      logger.info(imageUrls);

      await writePost(
        this.userId,
        this.title,
        this.content,
        this.category,
        imageUrls,
        this.mappings
      );
    } catch (err) {
      logger.error('Post save failed', err);
      throw err;
    }
  }
  update() {}
  delete() {}
  static async readAll(category) {
    return await readPostAll(category);
  }
  readOne() {}
}

module.exports.Post = Post;
