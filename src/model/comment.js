const { updateComment } = require('./data/remote/comment');

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

  static async editComment(commentId, content) {
    return await updateComment(commentId, content);
  }
}

module.exports.Comment = Comment;
