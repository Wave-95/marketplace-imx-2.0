import { NextApiHandler } from 'next';
import { prisma } from '../../../lib/prisma';

const handler: NextApiHandler = async (req, res) => {
  //TODO: Validation & Error handling
  if (req.method === 'POST') {
    const { eth_address } = req.body;
    console.log(req.body);
    console.log(typeof req.body);
    console.log(eth_address);

    const newUser = await prisma.user.create({
      data: { eth_address },
    });
    res.json(newUser);
  }
};

export default handler;
