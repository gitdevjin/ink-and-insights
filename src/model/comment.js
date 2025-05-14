const {
  writeComment,
  readCommentAll,
  readCommentAllByUser,
  readCommentCountByUser,
  readComment,
  updateComment,
  deleteComment,
} = require('./data').comment;

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

  static async edit(commentId, content) {
    return await updateComment(commentId, content);
  }

  static async readOne(commentId) {
    return await readComment(commentId);
  }

  static async delete(commentId) {
    return await deleteComment(commentId);
  }
  static async readAllByUser(userId, pageNum) {
    return await readCommentAllByUser(userId, pageNum);
  }
  static async getCommentCountByUser(userId) {
    return await readCommentCountByUser(userId);
  }
}

module.exports.Comment = Comment;
