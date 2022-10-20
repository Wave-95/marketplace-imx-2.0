import { PrismaClient } from '@prisma/client';
import { metadata } from './data/metadata';

const prisma = new PrismaClient();

async function main() {
  await prisma.metadata.createMany({ data: metadata });
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
