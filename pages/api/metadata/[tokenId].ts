import { NextApiHandler } from 'next';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const handler: NextApiHandler = async (req, res) => {
  const { tokenId } = req.query;
  if (typeof tokenId !== 'string') {
    res.status(400).json({ message: 'Invalid tokenId.' });
  } else {
    const id = parseInt(tokenId, 10);
    const asset = await prisma.asset.findUnique({ where: { id }, include: { metadata: true } });
    if (!asset) {
      res.status(404).send('Not found.');
    } else {
      const { metadata } = asset;
      const { id, createdAt, updatedAt, ...rest } = metadata;
      res.json(rest);
    }
  }
};

export default handler;
