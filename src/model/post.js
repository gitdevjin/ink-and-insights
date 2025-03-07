const logger = require('../logger');

const {
  writePost,
  readPost,
  deletePost,
  writePostMedia,
  readPostMedia,
  deletePostMedia,
} = require('./data');

class Post {
  constructor(userId, content, files, mappings) {
    this.userId = userId;
    this.content = content;
    this.files = files;
    this.mappings = mappings;
    logger.info('Post Object created');
  }

  save() {}
  update() {}
  delete() {}
  readAll() {}
  readOne() {}
}

module.exports.Post = Post;
