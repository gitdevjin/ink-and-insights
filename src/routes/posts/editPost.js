const logger = require('../../logger');
const { Post } = require('../../model/post');

module.exports = async (req, res) => {
  try {
    const { content, title } = req.body;
    const postId = parseInt(req.params.id);
    const files = req.files || [];

    const deletedImages = [];
    Object.keys(req.body).forEach((key) => {
      if (key.startsWith('deletedImages')) {
        const index = parseInt(key.replace('deletedImages', ''), 10);
        deletedImages[index] = req.body[key];
      }
    });

    console.log('Deleted Images:', deletedImages);
    const oldPost = await Post.readOne(req.user.userId, postId);
    console.log(oldPost);
    console.log('userid:', req.user.userId);

    if (oldPost.post.userId !== req.user.userId) {
      return res.status(403).json({ message: 'You have no right to edit this post' });
    }

    // Build mapping from Blob URLs to S3 URLs
    const blobMappings = {};
    Object.keys(req.body).forEach((key) => {
      if (key.startsWith('blobMapping:')) {
        const index = parseInt(key.split(':')[1], 10);
        blobMappings[req.body[key]] = files[index]; // Map Blob URL to file
      }
    });

    logger.info('blobMappings', blobMappings);

    const post = await Post.edit(postId, title, content, deletedImages, files, blobMappings);

    res.status(200).json({ message: 'Editing bookReview Successful', post: post });
  } catch (err) {
    logger.error(err);
    return res.status(500).json({ message: 'Posting bookReview Failed' });
  }
};
