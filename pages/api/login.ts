import { NextApiHandler } from 'next';
import { prisma } from '../../lib/prisma';
import jwt from 'jsonwebtoken';
import { utils } from 'ethers';

const handler: NextApiHandler = async (req, res) => {
  //TODO: Validation & Error handling
  if (req.method === 'POST') {
    const { eth_address, signature } = req.body;
    //Validate signature
    const signerAddress = utils.recoverAddress(utils.hashMessage(eth_address), signature);
    if (signerAddress !== eth_address) {
      res.status(401).json({ message: 'Invalid signature, signer address does not match eth_address' });
    }
    const existingUser = await prisma.user.findUnique({ where: { eth_address } });
    let user;
    if (!existingUser) {
      const newUser = await prisma.user.create({
        data: { eth_address },
      });
      user = newUser;
    } else {
      user = existingUser;
    }
    const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET as string, { expiresIn: '3d', algorithm: 'HS256' });
    res.json({ user, token });
  }
};

export default handler;
