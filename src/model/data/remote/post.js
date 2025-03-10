const logger = require('../../../logger');
const s3Client = require('./s3Client');
const prisma = require('./prisma');
const protocol = 'http://localhost:8080';

const {
  PutObjectCommand /*GetObjectCommand, DeleteObjectCommand*/,
} = require('@aws-sdk/client-s3');

async function writePost(userId, title, content, category, imageUrls, blobMappings) {
  let finalContent = content;

  Object.keys(blobMappings).forEach((blobUrl, index) => {
    finalContent = finalContent.replace(blobUrl, imageUrls[index]);
  });

  logger.info(finalContent);

  await prisma.$transaction(async (prisma) => {
    const post = await prisma.post.create({
      data: { content: finalContent, title, category, userId },
    });

    const images = await prisma.image.createMany({
      data: imageUrls.map((url) => ({ postId: post.id, url })),
    });

    logger.info(post);
    logger.info(images);
  });
}

async function readPost() {}

async function deletePost() {}

async function writePostMedia(files) {
  const promises = files.map(async (file) => {
    const s3Key = `images/${Date.now()}-${file.originalname}`;
    const params = {
      Bucket: process.env.AWS_S3_BUCKET_NAME,
      Key: s3Key,
      Body: file.buffer,
      ContentType: file.mimetype,
      // ACL: 'public-read', // IAM permissions for public access
    };

    const command = new PutObjectCommand(params);
    await s3Client.send(command);

    // Construct the S3 URL manually since v3 doesn’t return Location
    const imageUrl = `${protocol}/${s3Key}`;
    return imageUrl;
  });

  return Promise.all(promises);
}

async function readPostMedia() {}

async function readPostAll(category) {
  logger.info('ReadPost Triggered');
  const posts = await prisma.post.findMany({ where: { category: category } });
  logger.info(posts);
  return posts;
}

async function deletePostMedia() {}

module.exports.writePost = writePost;
module.exports.readPost = readPost;
module.exports.deletePost = deletePost;
module.exports.writePostMedia = writePostMedia;
module.exports.readPostMedia = readPostMedia;
module.exports.deletePostMedia = deletePostMedia;
module.exports.readPostAll = readPostAll;
