import { NextApiHandler } from 'next';
import { prisma } from '../../../lib/prisma';

const handler: NextApiHandler = async (req, res) => {
  //TODO: Validation & Error handling
  if (req.method === 'POST') {
    const {
      name,
      image,
      price = null,
      sale_start_at = null,
      sale_end_at = null,
      total_supply = null,
      quantity_sold = undefined,
      active = true,
    } = req.body;

    const newProduct = await prisma.product.create({
      data: { name, image, price, sale_start_at, sale_end_at, total_supply, quantity_sold, active },
    });
    res.json(newProduct);
  }

  if (req.method === 'GET') {
    const products = await prisma.product.findMany({ where: { active: true }, include: { product_to_metadata_rarities: true } });
    res.json(products);
  }
};

export default handler;
