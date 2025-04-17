const { writeComment, readCommentAll } = require('./data').comment;

class Comment {
  constructor(userId, postId, content) {
    this.userId = userId;
    this.postId = postId;
    this.content = content;
  }

  async save() {
    return await writeComment(this.userId, this.postId, this.content);
  }

  static async readAll(postId, pageNum) {
    return await readCommentAll(postId, pageNum);
  }
}

module.exports.Comment = Comment;
