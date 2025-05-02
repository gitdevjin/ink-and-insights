const logger = require('../../../logger');
const s3Client = require('./s3Client');
const prisma = require('./prisma');
const protocol = 'http://localhost:8080';
const {
  PutObjectCommand,
  GetObjectCommand /*DeleteObjectCommand*/,
} = require('@aws-sdk/client-s3');

async function readProfile(userId) {
  logger.info('readProfile Triggered');
  return await prisma.profile.findUnique({ where: { userId } });
}

async function updateProfile(profile) {
  logger.info('updateProfile Triggered');
  logger.info(profile);
  return await prisma.profile.update({
    where: { userId: profile.userId },
    data: {
      nickname: profile.nickname,
      firstName: profile.firstName,
      lastName: profile.lastName,
      dob: new Date(profile.dob),
      bio: profile.bio,
      location: profile.location,
    },
  });
}
async function updateImageUrl(userId, imageUrl) {
  return await prisma.profile.update({
    where: { userId },
    data: {
      imageUrl,
    },
  });
}

async function storeImage(file) {
  const s3Key = `profile/images/${Date.now()}-${file.originalname}`;
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
}

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

async function readProfileImage(key) {
  const params = {
    Bucket: process.env.AWS_S3_BUCKET_NAME,
    Key: `profile/images/${key}`,
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

module.exports.readProfile = readProfile;
module.exports.updateProfile = updateProfile;
module.exports.updateImageUrl = updateImageUrl;
module.exports.storeImage = storeImage;
module.exports.readProfileImage = readProfileImage;
