import { Metadata, SaleDetail } from '@prisma/client';
import { NextApiHandler } from 'next';
import { prisma } from '../../../lib/prisma';

export type SaleDetailResponse = SaleDetail & { metadata: Metadata };

const handler: NextApiHandler = async (req, res) => {
  //TODO: Validation & Error handling
  if (req.method === 'POST') {
    const {
      metadata_id,
      price = null,
      start_at = null,
      end_at = null,
      total_supply = null,
      quantity_sold = undefined,
      active = true,
      treasury_address,
    } = req.body;
    if (typeof metadata_id !== 'number') {
      res.status(400).json({ message: 'Invalid metadata_id.' });
    } else {
      const metadataExists = await prisma.metadata.findUnique({ where: { id: metadata_id } });
      if (!metadataExists) {
        res.status(400).json({ message: `Metadata not found for metadata_id: ${metadata_id}` });
      } else {
        const newSaleDetail = await prisma.saleDetail.create({
          data: { metadata_id, price, start_at, end_at, total_supply, quantity_sold, active, treasury_address },
        });
        res.json(newSaleDetail);
      }
    }
  }

  if (req.method === 'GET') {
    const saleDetails = await prisma.saleDetail.findMany({ where: { active: true }, include: { metadata: true } });
    res.json(saleDetails);
  }
};

export default handler;
