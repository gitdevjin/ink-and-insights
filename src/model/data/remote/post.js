const logger = require('../../../logger');
const s3Client = require('./s3Client');
const prisma = require('./prisma');
const protocol = 'http://localhost:8080';

const { PutObjectCommand, GetObjectCommand, DeleteObjectCommand } = require('@aws-sdk/client-s3');

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

    logger.info(images);
  });
}

async function updatePost(postId, title, content, imageUrls, blobMappings) {
  let finalContent = content;

  Object.keys(blobMappings).forEach((blobUrl, index) => {
    finalContent = finalContent.replace(blobUrl, imageUrls[index]);
  });

  const post = await prisma.post.update({
    where: { id: parseInt(postId) }, // Ensure postId is an integer
    data: { content: finalContent, title },
  });

  const images = await prisma.image.createMany({
    data: imageUrls.map((url) => ({ postId: post.id, url })),
  });

  logger.info(images);
  logger.info(finalContent);
}

async function readPost(postId) {
  const post = await prisma.post.findFirst({
    where: { id: parseInt(postId) },
    include: {
      images: true,
    },
  });
  return post;
}

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
    Key: `images/${key}`,
  };

  const command = new GetObjectCommand(params);

  try {
    const data = await s3Client.send(command);
    return streamToBuffer(data.Body); //Promise<buffer>
  } catch (err) {
    console.error('Error streaming image from S3:', err);
  }
}

async function readPostAll(category) {
  logger.info('ReadPostAll Triggered');
  const posts = await prisma.post.findMany({
    where: { category: category },
    select: {
      id: true,
      title: true,
      userId: true,
      createdAt: true,
      updatedAt: true,
    },
  });

  logger.info(posts);
  return posts;
}

async function deletePostMedia(deletedImages) {
  const deletePromises = deletedImages.map(async (url) => {
    logger.info(url);
    const s3Key = url.split('/').pop();
    const params = {
      Bucket: process.env.AWS_S3_BUCKET_NAME,
      Key: `images/${s3Key}`,
    };
    const command = new DeleteObjectCommand(params);

    s3Client.send(command);

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

module.exports.writePost = writePost;
module.exports.readPost = readPost;
module.exports.deletePost = deletePost;
module.exports.writePostMedia = writePostMedia;
module.exports.readPostMedia = readPostMedia;
module.exports.deletePostMedia = deletePostMedia;
module.exports.readPostAll = readPostAll;
module.exports.updatePost = updatePost;
