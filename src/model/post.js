const logger = require('../logger');

const {
  writePost,
  readPost,
  deletePost,
  writePostMedia,
  readPostAll,
  readPostMedia,
  deletePostMedia,
  updatePost,
  getAllPostMedia,
} = require('./data').post;

console.log(require('./data').post);

class Post {
  constructor(userId, title, content, category) {
    this.userId = userId;
    this.title = title;
    this.content = content;
    this.category = category;

    logger.info('Post Object created');
  }

  static async readAll(subcategory, pageNum) {
    return await readPostAll(subcategory, pageNum);
  }

  static async readOne(postId) {
    return await readPost(postId);
  }

  static async readMedia(key) {
    return await readPostMedia(key);
  }

  async save(files, mappings) {
    try {
      const imageUrls = await writePostMedia(files);
      logger.info(imageUrls);

      await writePost(this.userId, this.title, this.content, this.category, imageUrls, mappings);
    } catch (err) {
      logger.error('Post save failed', err);
      throw err;
    }
  }

  static async edit(postId, title, content, deletedImages, files, mappings) {
    logger.info('Edit triggered');
    //Write new Media
    const imageUrls = await writePostMedia(files);

    //UpdatePost
    await updatePost(postId, title, content, files, imageUrls, mappings);

    //Delete old Media
    await deletePostMedia(deletedImages);

    logger.info(imageUrls);
  }

  static async delete(postId) {
    const media = await getAllPostMedia(postId);
    console.log(media);
    const mediaUrls = media.map((img) => img.url);
    await deletePostMedia(mediaUrls);
    await deletePost(postId);
  }
}

module.exports.Post = Post;
