const logger = require('../../logger');
const prisma = require('../../model/data/remote/prisma');

module.exports = async (req, res) => {
  try {
    const categories = await prisma.category.findMany({
      include: { subCategories: true }, // Include subcategories
    });

    logger.info('Categories Retrieved Successfully');
    res.json(categories);
  } catch (error) {
    logger.error('Error fetching categories:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};
