import { NextApiHandler } from 'next';
import { prisma } from '../../../lib/prisma';

const handler: NextApiHandler = async (req, res) => {
  //TODO: Validation & Error handling
  if (req.method === 'POST') {
    const {
      metadata_id,
      price = null,
      start_at = null,
      end_at = null,
      total_supply = null,
      quantity_sold = null,
      active = true,
    } = req.body;
    if (typeof metadata_id !== 'number') {
      res.status(400).json({ message: 'Invalid metadata_id.' });
    } else {
      const metadataExists = await prisma.metadata.findUnique({ where: { id: metadata_id } });
      if (!metadataExists) {
        res.status(400).json({ message: `Metadata not found for metadata_id: ${metadata_id}` });
      } else {
        const newSaleDetail = await prisma.saleDetail.create({
          data: { metadata_id, price, start_at, end_at, total_supply, quantity_sold, active },
        });
        res.json(newSaleDetail);
      }
    }
  }

  if (req.method === 'GET') {
    const saleDetails = await prisma.saleDetail.findMany({ include: { metadata: true } });
    res.json(saleDetails);
  }
  //   const { sale_detail_id } = req.query;
  //   if (typeof sale_detail_id !== 'string') {
  //     res.status(400).json({ message: 'Invalid sale_detail_id.' });
  //   } else {
  //     const id = parseInt(sale_detail_id, 10);
  //     const saleDetail = await prisma.saleDetail.findUnique({ where: { id }, include: { metadata: true } });
  //     if (!saleDetail) {
  //       res.status(404).send('Not found.');
  //     } else {
  //       res.json(saleDetail);
  //     }
  //   }
};

export default handler;
