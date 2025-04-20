const { writeComment, readCommentAll, readComment, updateComment, deleteComment } =
  require('./data').comment;

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
}

module.exports.Comment = Comment;
