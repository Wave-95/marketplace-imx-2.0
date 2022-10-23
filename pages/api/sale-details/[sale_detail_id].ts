import { NextApiHandler } from 'next';
import { prisma } from '../../../lib/prisma';

const handler: NextApiHandler = async (req, res) => {
  const { sale_detail_id } = req.query;
  if (typeof sale_detail_id !== 'string') {
    res.status(400).json({ message: 'Invalid sale_detail_id.' });
  } else {
    const id = parseInt(sale_detail_id, 10);
    const saleDetail = await prisma.saleDetail.findUnique({ where: { id }, include: { metadata: true } });
    if (!saleDetail) {
      res.status(404).send('Not found.');
    } else {
      res.json(saleDetail);
    }
  }
};

export default handler;
