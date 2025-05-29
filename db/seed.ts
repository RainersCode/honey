import { PrismaClient } from '@prisma/client';
import sampleData from './sample-data';
import { hash } from '@/lib/encrypt';

async function main() {
  const prisma = new PrismaClient();
  
  // Clean up existing data
  await prisma.product.deleteMany();
  await prisma.category.deleteMany();
  await prisma.account.deleteMany();
  await prisma.session.deleteMany();
  await prisma.verificationToken.deleteMany();
  await prisma.user.deleteMany();

  // Create categories first
  const categories = [
    {
      key: 'mens-dress-shirts',
      name: "Men's Dress Shirts",
      description: 'Premium dress shirts for professional and formal occasions',
      image: '/images/categories/mens-dress-shirts.jpg',
    },
    {
      key: 'mens-sweatshirts',
      name: "Men's Sweatshirts",
      description: 'Comfortable sweatshirts and hoodies for casual wear',
      image: '/images/categories/mens-sweatshirts.jpg',
    }
  ];

  const createdCategories = await Promise.all(
    categories.map(category => prisma.category.create({ data: category }))
  );

  // Create a map for category lookup
  const categoryMap = {
    "Men's Dress Shirts": createdCategories[0].id,
    "Men's Sweatshirts": createdCategories[1].id,
  };

  // Transform products to use categoryId instead of category
  const productsWithCategoryId = sampleData.products.map(product => {
    const { category, ...productData } = product;
    return {
      ...productData,
      categoryId: categoryMap[category as keyof typeof categoryMap],
    };
  });

  await prisma.product.createMany({ data: productsWithCategoryId });
  
  const users = [];
  for (let i = 0; i < sampleData.users.length; i++) {
    users.push({
      ...sampleData.users[i],
      password: await hash(sampleData.users[i].password),
    });
    console.log(
      sampleData.users[i].password,
      await hash(sampleData.users[i].password)
    );
  }
  await prisma.user.createMany({ data: users });

  console.log('Database seeded successfully!');
}

main();
