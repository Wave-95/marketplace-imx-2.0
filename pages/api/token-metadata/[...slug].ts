import { NextApiHandler } from 'next';
import { prisma } from '../../../lib/prisma';

const handler: NextApiHandler = async (req, res) => {
  const { slug } = req.query;
  if (Array.isArray(slug) && slug.length === 2) {
    const [token_address, token_id] = slug;
    //TODO: Return token metadata
  }
};

export default handler;
