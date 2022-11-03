import { NextApiHandler } from 'next';
import { prisma } from '../../../lib/prisma';
import { client } from '../../../lib/imx';
import { Wallet, ethers } from 'ethers';
import { EthSigner } from '@imtbl/core-sdk';
import { authenticateUser, RequestWithUser } from 'lib/auth';
import { createOrderRequestSchema } from 'schemas';
import { toBN } from 'web3-utils';

export type Item = { product_id: string; quantity: number };
const handler: NextApiHandler = async (req: RequestWithUser, res) => {
  if (req.method === 'POST') {
    authenticateUser(req, res);
    createOrderRequestSchema.validate(req.body).catch((err: any) => {
      res.status(400).json({ message: 'Validation Error', errors: err.errors });
    });
    const { items }: { items: Item[] } = req.body;
    const productIds = items.map((item) => item.product_id);
    const userId = req.userId!;
    try {
      await prisma.$transaction(async (tx) => {
        const products = await tx.product.findMany({ where: { id: { in: productIds } } });
        const itemsData = items.map((item) => {
          const product = products.filter((product) => product.id === item.product_id)[0];
          const price = product.price;
          return {
            ...item,
            price,
          };
        });
        const totalCost = itemsData.reduce((prev, curr) => {
          const cost = curr.price ? toBN(curr.price).mul(toBN(curr.quantity)) : toBN(0);
          return prev.add(cost);
        }, toBN(0));
        const newOrder = await tx.order.create({
          data: {
            user_id: userId,
            state: 'AWAITING_PAYMENT',
            total_cost: totalCost.toString(),
          },
        });
        const itemsDataWithOrderIds = itemsData.map((item) => ({ ...item, order_id: newOrder.id }));
        await tx.item.createMany({
          data: itemsDataWithOrderIds,
        });
        const orderResponse = await tx.order.findUnique({
          where: { id: newOrder.id },
          include: { user: true, items: { include: { product: true } } },
        });
        res.json(orderResponse);
      });
    } catch (e) {
      console.log(e);
      res.status(500).json({ message: 'Issue creating order.' });
    }
  }

  // if (req.method === 'POST') {
  //   if (!process.env.MINTER_PRIVATE_KEY) {
  //     return res.status(500).json({ message: `Minter not set up.` });
  //   }
  //   if (!process.env.ETH_PROVIDER_URL) {
  //     return res.status(500).json({ message: `Provider not set up.` });
  //   }
  //   const { sale_detail_id, address, payment_id } = req.body;
  //   if (!sale_detail_id || !address) {
  //     res.status(400).json({ message: `Missing body param.` });
  //   }
  //   //Check if sale_detail_id exists
  //   const saleDetail = await prisma.saleDetail.findUnique({ where: { id: sale_detail_id }, include: { metadata: true } });
  //   if (!saleDetail) {
  //     return res.status(400).json({ message: `Invalid sale_detail_id: ${sale_detail_id}.` });
  //   }
  //   //Check if user exists--create one if does not exist
  //   let user = await prisma.user.findUnique({ where: { address } });
  //   if (!user) {
  //     user = await prisma.user.create({ data: { address } });
  //   }
  //   //Validate sale can happen
  //   const {
  //     active,
  //     total_supply,
  //     quantity_sold,
  //     price,
  //     metadata_id,
  //     treasury_address,
  //     currency_token_address,
  //     metadata: { token_address },
  //   } = saleDetail;
  //   if (price && !payment_id) {
  //     return res.status(400).json({ message: `You must provide a payment_id for sale_detail_id: ${sale_detail_id}.` });
  //   }
  //   if (!active) {
  //     return res.status(400).json({ message: `Sale is no longer active for sale_detail_id: ${sale_detail_id}.` });
  //   }
  //   if (total_supply && quantity_sold === total_supply) {
  //     return res.status(400).json({ message: `Sale has sold out. quantity_sold: ${saleDetail.quantity_sold}.` });
  //   }
  //   //Valide if transfer is needed
  //   if (price) {
  //     try {
  //       const transfer = await client.getTransfer({ id: payment_id });
  //       const {
  //         receiver,
  //         status,
  //         user,
  //         token: {
  //           data: { quantity, token_address: transferTokenAddress },
  //         },
  //       } = transfer;
  //       if (status !== 'success') {
  //         return res.status(400).json({ message: `Invalid payment: Transfer was not successful.` });
  //       }
  //       if (receiver !== treasury_address) {
  //         return res.status(400).json({ message: `Invalid payment: Transfer sent to ${receiver} instead of ${treasury_address}.` });
  //       }
  //       if (user !== address) {
  //         return res.status(400).json({ message: `Invalid payment: Transfer sent from ${user} instead of ${address}.` });
  //       }
  //       if (quantity !== price) {
  //         return res.status(400).json({ message: `Invalid payment: Transfer amount is ${quantity} instead of ${price}.` });
  //       }
  //       if (transferTokenAddress !== currency_token_address) {
  //         return res.status(400).json({
  //           message: `Invalid payment: Transfer currency address is ${transferTokenAddress} instead of ${currency_token_address}.`,
  //         });
  //       }
  //       const sale = await prisma.sale.findUnique({ where: { payment_id } });
  //       if (sale) {
  //         return res.status(400).json({ message: `Invalid payment: Transfer has already been honored for sale with id ${sale.id}` });
  //       }
  //     } catch (e) {
  //       return res.status(500).json({ message: `Issue resolving payment for this sale. Please try again.` });
  //     }
  //   }
  //   //Create asset in internal & map to metadata ID
  //   const mintsResponse = await client.listMints({ tokenAddress: token_address, orderBy: 'transaction_id', direction: 'desc' });
  //   const mints = mintsResponse.result;
  //   let lastTokenId = 1;
  //   if (mints.length) {
  //     lastTokenId = parseInt(mints[0].token.data.token_id!, 10);
  //   }
  //   const asset = await prisma.asset.create({ data: { id: lastTokenId + 1, metadata_id } });
  //   const provider = new ethers.providers.JsonRpcProvider(process.env.ETH_PROVIDER_URL);
  //   const signer = new Wallet(process.env.MINTER_PRIVATE_KEY, provider) as EthSigner;
  //   const mintPayload = {
  //     contract_address: token_address,
  //     users: [{ tokens: [{ id: asset.id.toString(), blueprint: asset.id.toString() }], user: address }],
  //   };
  //   //Mint asset in IMX
  //   await client.mint(signer, mintPayload);
  //   const sale = await prisma.sale.create({ data: { user_id: user.id, sale_detail_id: saleDetail.id, asset_id: asset.id, payment_id } });
  //   await prisma.saleDetail.update({ where: { id: sale_detail_id }, data: { quantity_sold: quantity_sold + 1 } });
  //   res.json(sale);
  // }
  if (req.method === 'GET') {
  }
};

export default handler;
