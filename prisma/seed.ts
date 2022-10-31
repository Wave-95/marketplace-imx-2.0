import { PrismaClient } from '@prisma/client';
import { metadata, products } from './data';

const prisma = new PrismaClient();

async function main() {
  await prisma.metadata.createMany({ data: metadata });
  await prisma.product.createMany({ data: products });
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
