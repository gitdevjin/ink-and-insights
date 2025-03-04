const logger = require('../logger');
class Post {
  constructor() {
    logger.info('Post Object created');
  }

  save() {}
  update() {}
  delete() {}
  readAll() {}
  readOne() {}
}

module.exports.Post = Post;
