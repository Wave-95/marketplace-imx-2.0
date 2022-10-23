import { NextApiHandler } from 'next';
import { prisma } from '../../../lib/prisma';

const handler: NextApiHandler = async (req, res) => {
  const { token_id } = req.query;
  if (typeof token_id !== 'string') {
    res.status(400).json({ message: 'Invalid token_id.' });
  } else {
    const id = parseInt(token_id, 10);
    const asset = await prisma.asset.findUnique({ where: { id }, include: { metadata: true } });
    if (!asset) {
      res.status(404).send('Not found.');
    } else {
      const { metadata } = asset;
      const { id, created_at, updated_at, ...rest } = metadata;
      res.json(rest);
    }
  }
};

export default handler;
