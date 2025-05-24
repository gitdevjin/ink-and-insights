const logger = require('../../../logger');
const s3Client = require('./s3Client');
const prisma = require('./prisma');
const protocol = 'http://localhost:8080';

const { PutObjectCommand, GetObjectCommand, DeleteObjectCommand } = require('@aws-sdk/client-s3');

async function readPost(postId) {
  const id = parseInt(postId);

  try {
    const post = await prisma.post.update({
      where: { id },
      data: { view: { increment: 1 } }, // Increment view count
      select: {
        id: true,
        title: true,
        content: true,
        userId: true,
        createdAt: true,
        updatedAt: true,
        subCategory: true,
        view: true,
        likeCount: true,
        commentCount: true,
        images: true,
        user: {
          include: {
            profile: {
              select: { nickname: true },
            },
          },
        },
      },
    });

    return post;
  } catch (err) {
    logger.info(err);
    return null;
  }
}

async function writePost(userId, title, content, subCategory, imageUrls, blobMappings) {
  let finalContent = content;

  Object.keys(blobMappings).forEach((blobUrl, index) => {
    finalContent = finalContent.replace(blobUrl, imageUrls[index]);
  });

  const subCategoryId = parseInt(subCategory);
  logger.info(finalContent);

  const post = await prisma.$transaction(async (prisma) => {
    const post = await prisma.post.create({
      data: { content: finalContent, title, subCategoryId, userId },
    });

    const images = await prisma.image.createMany({
      data: imageUrls.map((url) => ({ postId: post.id, url })),
    });

    logger.info(images);
    return post;
  });
  return post;
}

async function updatePost(postId, title, content, imageUrls, blobMappings) {
  let finalContent = content;

  Object.keys(blobMappings).forEach((blobUrl, index) => {
    finalContent = finalContent.replace(blobUrl, imageUrls[index]);
  });

  const post = await prisma.post.update({
    where: { id: postId },
    data: { content: finalContent, title },
  });

  const images = await prisma.image.createMany({
    data: imageUrls.map((url) => ({ postId: post.id, url })),
  });

  logger.info(images);
  logger.info(finalContent);
  return post;
}

async function deletePost(id) {
  return await prisma.post.delete({ where: { id } });
}

async function writePostMedia(files) {
  const promises = files.map(async (file) => {
    const s3Key = `post/images/${Date.now()}-${file.originalname}`;
    const params = {
      Bucket: process.env.AWS_S3_BUCKET_NAME,
      Key: s3Key,
      Body: file.buffer,
      ContentType: file.mimetype,
      // ACL: 'public-read', // IAM permissions for public access
    };

    const command = new PutObjectCommand(params);
    await s3Client.send(command);

    // ImageUrls to replace blobUrls with in content
    const imageUrl = `${protocol}/${s3Key}`;
    return imageUrl;
  });

  return Promise.all(promises);
}

// Convert a stream of data into a Buffer, by collecting
// chunks of data until finished, then assembling them together.
// We wrap the whole thing in a Promise so it's easier to consume.
const streamToBuffer = (stream) =>
  new Promise((resolve, reject) => {
    // As the data streams in, we'll collect it into an array.
    const chunks = [];

    // Streams have events that we can listen for and run
    // code.  We need to know when new `data` is available,
    // if there's an `error`, and when we're at the `end`
    // of the stream.

    // When there's data, add the chunk to our chunks list
    stream.on('data', (chunk) => chunks.push(chunk));
    // When there's an error, reject the Promise
    stream.on('error', reject);
    // When the stream is done, resolve with a new Buffer of our chunks
    stream.on('end', () => resolve(Buffer.concat(chunks)));
  });

async function readPostMedia(key) {
  const params = {
    Bucket: process.env.AWS_S3_BUCKET_NAME,
    Key: `post/images/${key}`,
  };

  const command = new GetObjectCommand(params);

  try {
    const data = await s3Client.send(command);
    const buffer = await streamToBuffer(data.Body);
    return { buffer, contentType: data.ContentType };
  } catch (err) {
    console.error('Error streaming image from S3:', err);
  }
}

async function readPostAll(subCategoryId, pageNum) {
  logger.info('ReadPostAll Triggered');

  const pageSize = 15;

  const posts = await prisma.post.findMany({
    where: { subCategoryId },
    skip: (pageNum - 1) * pageSize,
    take: pageSize,
    select: {
      id: true,
      title: true,
      userId: true,
      createdAt: true,
      updatedAt: true,
      subCategory: true,
      view: true,
      likeCount: true,
      commentCount: true,
      user: {
        select: {
          profile: {
            select: {
              nickname: true, // Get only the nickname
            },
          },
        },
      },
    },
  });

  logger.info(posts);
  return posts;
}

async function readPostAllByUser(userId, pageNum) {
  logger.info('ReadPostAllByUser Triggered');

  const pageSize = 15;

  const posts = await prisma.post.findMany({
    where: { userId },
    skip: (pageNum - 1) * pageSize,
    take: pageSize,
    select: {
      id: true,
      title: true,
      userId: true,
      createdAt: true,
      updatedAt: true,
      subCategory: {
        select: {
          name: true,
        },
      },
      view: true,
      likeCount: true,
      commentCount: true,
      user: {
        select: {
          profile: {
            select: {
              nickname: true, // Get only the nickname
            },
          },
        },
      },
    },
  });

  logger.info(posts);
  return posts;
}

async function readPostTopByStandard(postNum, standard) {
  const posts = await prisma.post.findMany({
    orderBy: {
      [standard]: 'desc',
    },
    take: postNum,
    select: {
      id: true,
      title: true,
      userId: true,
      createdAt: true,
      updatedAt: true,
      subCategory: true,
      view: true,
      likeCount: true,
      commentCount: true,
      user: {
        select: {
          profile: {
            select: {
              nickname: true,
            },
          },
        },
      },
    },
  });

  logger.info(posts);
  return posts;
}

async function readLikedPostByUser(userId, pageNum) {
  logger.info('ReadLikedPostAllByUser Triggered');

  if (!userId || typeof userId !== 'string') {
    throw new Error('Invalid userId');
  }
  if (pageNum < 1) {
    throw new Error('Page number must be at least 1');
  }
  const pageSize = 15;

  return await prisma.postLike.findMany({
    where: { userId },
    skip: (pageNum - 1) * pageSize,
    take: pageSize,
    select: {
      post: {
        select: {
          id: true,
          title: true,
          userId: true,
          createdAt: true,
          updatedAt: true,
          subCategory: {
            select: {
              name: true,
            },
          },
          view: true,
          likeCount: true,
          commentCount: true,
          user: {
            select: {
              profile: {
                select: {
                  nickname: true,
                },
              },
            },
          },
        },
      },
    },
  });
}

async function getSearchResult(keyword, page, max) {
  logger.info('getSearch Result Triggered');

  const posts = await prisma.post.findMany({
    where: {
      title: {
        contains: keyword,
        mode: 'insensitive',
      },
    },
    skip: (page - 1) * max,
    take: max,
    select: {
      id: true,
      title: true,
      userId: true,
      createdAt: true,
      updatedAt: true,
      subCategory: {
        select: {
          name: true,
        },
      },
      view: true,
      likeCount: true,
      commentCount: true,
      user: {
        select: {
          profile: {
            select: {
              nickname: true,
            },
          },
        },
      },
    },
  });

  logger.info(posts);
  return posts;
}

async function getLikedPostCount(userId) {
  return await prisma.postLike.count({ where: { userId } });
}

async function getAllPostMedia(id) {
  const media = await prisma.image.findMany({ where: { postId: id } });
  return media;
}

async function deletePostMedia(deletedImages) {
  const deletePromises = deletedImages.map(async (url) => {
    const s3Key = url.split('/').pop();
    logger.info('s3Key:', s3Key);
    const params = {
      Bucket: process.env.AWS_S3_BUCKET_NAME,
      Key: `images/${s3Key}`,
    };
    const command = new DeleteObjectCommand(params);
    const s3Response = await s3Client.send(command);
    logger.info('S3 Delete Response:', s3Response);

    await prisma.image.deleteMany({
      where: {
        url: {
          in: deletedImages, // Match any URLs that are in the deletedImages array
        },
      },
    });
  });

  await Promise.all(deletePromises);
}

async function getLike(userId, postId) {
  return await prisma.postLike.findUnique({
    where: {
      postId_userId: { postId, userId },
    },
  });
}
async function removeLike(userId, postId) {
  return await prisma.postLike.delete({
    where: {
      postId_userId: { postId, userId },
    },
  });
}
async function addLike(userId, postId) {
  return await prisma.postLike.create({
    data: {
      userId,
      postId,
    },
  });
}

async function updateLikeCount(postId, increase) {
  await prisma.post.update({
    where: { id: postId },
    data: {
      likeCount: {
        [increase ? 'increment' : 'decrement']: 1,
      },
    },
  });
}

async function updateCommentCount(postId, increase) {
  await prisma.post.update({
    where: { id: postId },
    data: {
      commentCount: {
        [increase ? 'increment' : 'decrement']: 1,
      },
    },
  });
}

async function getPostCountByUser(userId) {
  return await prisma.post.count({
    where: { userId },
  });
}

async function getPostCountByCategory(subCategoryId) {
  return await prisma.post.count({
    where: { subCategoryId },
  });
}

async function getPostCountByKeyword(keyword) {
  return await prisma.post.count({
    where: {
      title: {
        contains: keyword,
        mode: 'insensitive',
      },
    },
  });
}

module.exports.writePost = writePost;
module.exports.readPost = readPost;
module.exports.deletePost = deletePost;
module.exports.writePostMedia = writePostMedia;
module.exports.readPostMedia = readPostMedia;
module.exports.deletePostMedia = deletePostMedia;
module.exports.readPostAll = readPostAll;
module.exports.updatePost = updatePost;
module.exports.getAllPostMedia = getAllPostMedia;
module.exports.getLike = getLike;
module.exports.removeLike = removeLike;
module.exports.addLike = addLike;
module.exports.updateLikeCount = updateLikeCount;
module.exports.updateCommentCount = updateCommentCount;
module.exports.readPostAllByUser = readPostAllByUser;
module.exports.readLikedPostByUser = readLikedPostByUser;
module.exports.getLikedPostCount = getLikedPostCount;
module.exports.getPostCountByUser = getPostCountByUser;
module.exports.getPostCountByCategory = getPostCountByCategory;
module.exports.readPostTopByStandard = readPostTopByStandard;
module.exports.getPostCountByKeyword = getPostCountByKeyword;
module.exports.getSearchResult = getSearchResult;
