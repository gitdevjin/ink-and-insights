const logger = require('../../../logger');
const prisma = require('./prisma');

async function writeComment(userId, postId, content) {
  logger.info('writeComment called [Prisma]');
  return await prisma.comment.create({
    data: { userId, postId, content },
    include: {
      user: {
        include: {
          profile: true, // this will include user.profile
        },
      },
    },
  });
}

async function readCommentAll(postId, pageNum) {
  const pageSize = 10;
  return await prisma.comment.findMany({
    where: { postId },
    skip: (pageNum - 1) * pageSize,
    take: pageSize,
    include: {
      user: {
        include: {
          profile: true,
        },
      },
    },
  });
}

async function updateComment(commentId, content) {
  return await prisma.comment.update({
    where: { id: commentId },
    data: {
      content,
    },
    include: {
      user: {
        include: {
          profile: true,
        },
      },
    },
  });
}

module.exports.writeComment = writeComment;
module.exports.readCommentAll = readCommentAll;
module.exports.updateComment = updateComment;
