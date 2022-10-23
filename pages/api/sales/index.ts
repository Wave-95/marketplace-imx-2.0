import { NextApiHandler } from 'next';
import { prisma } from '../../../lib/prisma';
import { client } from '../../../lib/imx';
import { Wallet, ethers } from 'ethers';
import { EthSigner } from '@imtbl/core-sdk';
import { token_address } from '@/constants/configs';

const handler: NextApiHandler = async (req, res) => {
  //TODO: Validation & Error handling
  if (req.method === 'POST') {
    if (!process.env.MINTER_PRIVATE_KEY) {
      return res.status(500).json({ message: `Minter not set up.` });
    }

    if (!process.env.ETH_PROVIDER_URL) {
      return res.status(500).json({ message: `Provider not set up.` });
    }

    const { sale_detail_id, transfer_signature, address } = req.body;
    console.log(sale_detail_id, transfer_signature, address);
    if (!sale_detail_id || !address) {
      res.status(400).json({ message: `Missing body param.` });
    }
    //Check if sale_detail_id exists
    const saleDetail = await prisma.saleDetail.findUnique({ where: { id: sale_detail_id } });
    if (!saleDetail) {
      return res.status(400).json({ message: `Invalid sale_detail_id: ${sale_detail_id}.` });
    }

    //Check if user exists--create one if does not exist
    let user = await prisma.user.findUnique({ where: { address } });
    if (!user) {
      user = await prisma.user.create({ data: { address } });
    }

    //Validate sale can happen
    const { active, total_supply, quantity_sold, price, metadata_id } = saleDetail;
    if (!active) {
      return res.status(400).json({ message: `Sale is no longer active for sale_detail_id: ${sale_detail_id}.` });
    }
    if (total_supply && quantity_sold === total_supply) {
      return res.status(400).json({ message: `Sale has sold out. quantity_sold: ${saleDetail.quantity_sold}.` });
    }

    //Valide if transfer is needed
    if (price) {
    }

    //Create asset in internal & map to metadata ID
    const asset = await prisma.asset.create({ data: { metadata_id } });
    const provider = new ethers.providers.JsonRpcProvider(process.env.ETH_PROVIDER_URL);
    const signer = new Wallet(process.env.MINTER_PRIVATE_KEY, provider) as EthSigner;
    const mintPayload = {
      contract_address: token_address,
      users: [{ tokens: [{ id: asset.id.toString(), blueprint: asset.id.toString() }], user: address }],
    };
    //Mint asset in IMX
    await client.mint(signer, mintPayload);

    const sale = await prisma.sale.create({ data: { user_id: user.id, sale_detail_id: saleDetail.id, asset_id: asset.id } });
    //Return Sale
    res.json(sale);
  }

  if (req.method === 'GET') {
    const sales = await prisma.sale.findMany();
    res.json(sales);
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
