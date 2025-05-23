const logger = require('../../logger');
const { Post } = require('../../model/post');

module.exports = async (req, res) => {
  try {
    const { content, title, subcategory } = req.body;
    const files = req.files || [];

    // Build mapping from Blob URLs to S3 URLs
    const blobMappings = {};
    Object.keys(req.body).forEach((key) => {
      if (key.startsWith('blobMapping:')) {
        const index = parseInt(key.split(':')[1], 10);
        blobMappings[req.body[key]] = files[index]; // Map Blob URL to file
      }
    });

    const post = new Post(req.user.userId, title, content, subcategory);
    const result = await post.save(files, blobMappings);

    res.status(200).json({ message: 'Posting bookReview Successful', post: result });
  } catch (err) {
    logger.error(err);
    return res.status(500).json({ message: 'Posting bookReview Failed' });
  }
};
