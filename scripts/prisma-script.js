// This file is to test and modify the database.
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  // Find the 'Review' category
  const reviewCategory = await prisma.category.findFirst({
    where: { name: 'Review' },
  });

  if (reviewCategory) {
    // Create subcategories for 'Review' category
    await prisma.subCategory.createMany({
      data: [
        { name: 'Book Review', categoryId: reviewCategory.id },
        { name: 'Movie Review', categoryId: reviewCategory.id },
        { name: 'Anime Review', categoryId: reviewCategory.id },
        { name: 'TV Show Review', categoryId: reviewCategory.id },
      ],
    });
  } else {
    console.log('Review category does not exist.');
  }

  // Find the 'Discussion' category
  const discussionCategory = await prisma.category.findFirst({
    where: { name: 'Discussion' },
  });

  if (discussionCategory) {
    // Create subcategories for 'Discussion' category
    await prisma.subCategory.createMany({
      data: [
        { name: 'Book Discussion', categoryId: discussionCategory.id },
        { name: 'Movie Discussion', categoryId: discussionCategory.id },
        { name: 'Anime Discussion', categoryId: discussionCategory.id },
        { name: 'TV Show Discussion', categoryId: discussionCategory.id },
      ],
    });
  } else {
    console.log('Discussion category does not exist.');
  }

  console.log('Subcategories created successfully!');
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
