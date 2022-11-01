import { NextApiHandler } from 'next';
import { prisma } from '../../../lib/prisma';

const handler: NextApiHandler = async (req, res) => {
  const { address } = req.query;
  if (typeof address !== 'string') {
    return res.status(400).json({ message: `Invalid user address: ${address}` });
  } else {
    const user = await prisma.user.findUnique({ where: { eth_address: address } });
    if (!user) {
      return res.status(404).json({ message: `No user found with address: ${address}` });
    } else {
      res.json(user);
    }
  }
};

export default handler;
