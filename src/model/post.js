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
  getLike,
  removeLike,
  addLike,
  updateLikeCount,
  updateCommentCount,
  readPostAllByUser,
  readLikedPostByUser,
  readLikedPostCount,
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

  static async readAllByUser(userId, pageNum) {
    return await readPostAllByUser(userId, pageNum);
  }

  static async readLikedPost(userId, pageNum) {
    const totalLikedPosts = await readLikedPostCount(userId);
    const likedPosts = await readLikedPostByUser(userId, pageNum);
    return { totalLikedPosts, likedPosts };
  }

  static async readOne(userId, postId) {
    const post = await readPost(postId);
    const liked = await getLike(userId, postId);
    return { post, liked };
  }

  static async getCommentCount(postId) {
    const post = await readPost(postId);
    return post.commentCount;
  }

  static async readMedia(key) {
    return await readPostMedia(key);
  }

  async save(files, mappings) {
    try {
      const imageUrls = await writePostMedia(files);
      logger.info(imageUrls);

      return await writePost(
        this.userId,
        this.title,
        this.content,
        this.category,
        imageUrls,
        mappings
      );
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
    await updatePost(postId, title, content, imageUrls, mappings);

    //Delete old Media
    await deletePostMedia(deletedImages);

    logger.info(imageUrls);
  }

  static async delete(postId) {
    const media = await getAllPostMedia(postId);
    logger.info(media);
    const mediaUrls = media.map((img) => img.url);
    await deletePostMedia(mediaUrls);
    return await deletePost(postId);
  }

  static async toggleLike(userId, postId) {
    const existingLike = await getLike(userId, postId);
    logger.info('Exist?');
    logger.info(existingLike);

    if (existingLike) {
      await removeLike(userId, postId);
      return { message: 'Like removed', liked: false };
    } else {
      await addLike(userId, postId);
      return { message: 'Liked', liked: true };
    }
  }

  static async handleLikeCount(postId, increase) {
    await updateLikeCount(postId, increase);
  }

  static async handleCommentCount(postId, increase) {
    await updateCommentCount(postId, increase);
  }
}

module.exports.Post = Post;
