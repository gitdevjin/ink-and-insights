const express = require('express');
const router = express.Router();
const logger = require('../logger');
const authenticate = require('../auth/authenticate');
const multer = require('multer');
const s3Client = require('../model/data/remote/s3Client');
const {
  PutObjectCommand /*GetObjectCommand, DeleteObjectCommand*/,
} = require('@aws-sdk/client-s3');
const prisma = require('../model/data/remote/prisma');

const upload = multer({ storage: multer.memoryStorage() });

router.use('/auth', require('./auth'));

// For testing Authenticate middleware
router.post('/auth/test', authenticate, (req, res) => {
  res.status(200).json({ message: 'You are Authenticated' });
});

router.post('/post/test', authenticate, upload.array('images'), async (req, res) => {
  console.log('**REQUEST BODY;');
  console.log(req.body);
  console.log(req.files);
  logger.info(req.user);

  const { content } = req.body;
  const files = req.files || [];

  // Build mapping from Blob URLs to S3 URLs
  const blobMappings = {};
  Object.keys(req.body).forEach((key) => {
    if (key.startsWith('blobMapping:')) {
      const index = parseInt(key.split(':')[1], 10);
      blobMappings[req.body[key]] = files[index]; // Map Blob URL to file
    }
  });

  // Upload files to S3 using v3 client
  const imageUrls = await Promise.all(
    files.map(async (file) => {
      const s3Key = `posts/${Date.now()}-${file.originalname}`;
      const params = {
        Bucket: process.env.AWS_S3_BUCKET_NAME,
        Key: s3Key,
        Body: file.buffer,
        ContentType: file.mimetype,
        // ACL: 'public-read', // IAM permissions for public access
      };

      const command = new PutObjectCommand(params);
      await s3Client.send(command);
      console.log(s3Key);

      // Construct the S3 URL manually since v3 doesn’t return Location
      const s3Url = `http://${process.env.AWS_S3_BUCKET_NAME}.s3.${process.env.AWS_REGION}.amazonaws.com/${s3Key}`;
      return s3Url;
    })
  );

  let finalContent = content;
  Object.keys(blobMappings).forEach((blobUrl, index) => {
    finalContent = finalContent.replace(blobUrl, imageUrls[index]);
  });

  console.log(finalContent);

  const post = await prisma.post.create({
    data: { content: finalContent, userId: req.user.userId },
  });

  const images = await prisma.image.createMany({
    data: imageUrls.map((url) => ({ postId: post.id, url })),
  });

  logger.info(images);

  console.log('**REQUEST BODY END;');

  res.status(200).json({ message: finalContent });
});

router.get('/', (req, res) => {
  // Client's shouldn't cache this response (always request it fresh)
  res.setHeader('Cache-Control', 'no-cache');
  // Send a 200 'OK' response
  res.status(200).json("it's home, and healthy");
});

module.exports = router;
