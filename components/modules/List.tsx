import React, { useState } from 'react';
import TextField from '../TextField';
import { usePrices, useUser } from '../../providers';
import { UserContextType } from '@/providers/UserProvider';
import { isSameAddress, refreshData } from '../../helpers';
import { client } from '@/helpers/imx';
import { toast } from 'react-toastify';
import { marketplace_royalty_address, marketplace_royalty_percentage, token_address } from '@/constants/configs';
import web3 from 'web3';
import { useRouter } from 'next/router';
import { Asset } from '@imtbl/core-sdk';
import Price from '../Price';
import { PricesContextType } from '@/providers/PricesProvider';
import { formatFees } from '@/helpers/formatters';

type ListProps = {
  asset: Asset;
};
const List: React.FC<ListProps> = ({ asset, ...props }) => {
  const { token_id, user, fees } = asset;
  const {
    state: { address, connection },
  } = useUser() as UserContextType;
  const {
    state: { ETHUSD },
  } = usePrices() as PricesContextType;
  const [amount, setAmount] = useState('0');
  const router = useRouter();

  //Add marketplace maker fee
  let totalFees;
  if (fees && marketplace_royalty_address && marketplace_royalty_percentage) {
    totalFees = fees.concat({
      type: 'ecosystem',
      address: marketplace_royalty_address,
      percentage: Number(marketplace_royalty_percentage),
    });
  }
  const formattedFees = totalFees ? formatFees(totalFees) : [];
  const hasFees = formattedFees.length > 0;
  const totalFeePercentage = totalFees ? totalFees.reduce((prev, curr) => prev + curr.percentage, 0) : 0;
  const totalAmount = Number(amount) * (1 + totalFeePercentage / 100);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setAmount(e.target.value);
  };

  const handleList = (amount: string) => async () => {
    const amountWei = web3.utils.toWei(amount);
    //https://docs.x.immutable.com/docs/fees/
    const makerFees =
      marketplace_royalty_address && marketplace_royalty_percentage
        ? [{ address: marketplace_royalty_address, fee_percentage: Number(marketplace_royalty_percentage) }]
        : undefined;
    if (connection) {
      try {
        await client.createOrder(connection, {
          buy: { type: 'ETH', amount: amountWei },
          sell: { type: 'ERC721', tokenId: token_id, tokenAddress: token_address },
          fees: makerFees,
        });
        refreshData(router);
      } catch (e: any) {
        if (e.message.match(/user rejected signing/)) {
          return toast.error('You have rejected the transaction.');
        }
        toast.error('There was an issue listing the item.');
      }
    } else {
      toast.error('Please make sure your wallet is connected.');
    }
  };

  return (
    <div {...props}>
      <div className="mb-4 mt-4 font-semibold text-lg">List</div>
      <div>
        <TextField label="Price" value={amount} onChange={handleChange} disabled={!isSameAddress(address, user)} />
      </div>
      <div className="mt-8">
        <div className="mt-4 flex justify-between items-center">
          <div className="font-semibold text-base">Total Amount</div>
          <Price amount={totalAmount.toString()} type="ETH" rate={ETHUSD} showLabel={false} />
        </div>
        <div className="mt-4">
          <div className="font-semibold text-sm">Fees</div>
          <div className="mt-2">
            {hasFees ? (
              formattedFees.map((fee, idx) => (
                <div className="flex justify-between items-center" key={`fee-${idx}`}>
                  <span className="text-xs text-secondary">{fee.label}</span>
                  <span className="text-sm text-primary">{`${fee.value}%`}</span>
                </div>
              ))
            ) : (
              <div className="flex justify-between items-center">
                <span className="text-xs text-secondary">No fees found</span>
                <span className="text-sm text-primary">n/a</span>
              </div>
            )}
          </div>
        </div>
      </div>

      <button className="btn-primary w-full h-12 max-h-12 mt-8 font-medium text-lg" onClick={handleList(amount)}>
        List Asset
      </button>
    </div>
  );
};

export default List;
