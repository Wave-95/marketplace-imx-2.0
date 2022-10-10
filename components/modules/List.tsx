import React, { useState } from 'react';
import TextField from '../TextField';
import { useAsset, useOrder, usePrices, useUser } from '../../providers';
import { UserContextType } from '@/providers/UserProvider';
import { isSameAddress, refreshData } from '../../helpers';
import { client } from '@/helpers/imx';
import { toast } from 'react-toastify';
import { marketplace_royalty_address, marketplace_royalty_percentage, token_address } from '@/constants/configs';
import web3utils from 'web3-utils';
import Price from '../Price';
import { PricesContextType } from '@/providers/PricesProvider';
import { formatFees } from '@/helpers/formatters';
import { OrderContextType } from '@/providers/OrderProvider';
import Loading from '../Loading';
import { AssetContextType } from '@/providers/AssetProvider';

type ListProps = {
  className?: string;
};

const List: React.FC<ListProps> = ({ ...props }) => {
  const {
    state: { asset },
  } = useAsset() as AssetContextType;
  const { token_id, user, fees } = asset;
  const {
    state: { address, connection },
  } = useUser() as UserContextType;
  const {
    state: { ETHUSD },
  } = usePrices() as PricesContextType;
  const { dispatch: dispatchOrder } = useOrder() as OrderContextType;
  const [amount, setAmount] = useState('');
  const [loading, setLoading] = useState(false);

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
    setLoading(true);
    const amountWei = web3utils.toWei(amount);
    //https://docs.x.immutable.com/docs/fees/
    const makerFees =
      marketplace_royalty_address && marketplace_royalty_percentage
        ? [{ address: marketplace_royalty_address, fee_percentage: Number(marketplace_royalty_percentage) }]
        : undefined;
    if (connection) {
      try {
        const { order_id } = await client.createOrder(connection, {
          buy: { type: 'ETH', amount: amountWei },
          sell: { type: 'ERC721', tokenId: token_id, tokenAddress: token_address },
          fees: makerFees,
        });
        setTimeout(async () => {
          const order = await client.getOrder({ id: order_id.toString(), includeFees: true });
          dispatchOrder({ type: 'set_order', payload: order });
          setLoading(false);
        }, 2000);
      } catch (e: any) {
        setLoading(false);
        if (e.message.match(/user rejected signing/)) {
          return toast.error('You have rejected the transaction.');
        }
        toast.error('There was an issue listing the item.');
      }
    } else {
      toast.error('Please make sure your wallet is connected.');
      setLoading(false);
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

      <button
        className="btn-primary w-full h-12 max-h-12 mt-8 font-medium text-lg flex items-center justify-center"
        onClick={handleList(amount)}
      >
        {loading ? <Loading /> : 'List Asset'}
      </button>
    </div>
  );
};

export default List;
