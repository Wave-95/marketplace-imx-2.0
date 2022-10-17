import React, { useState } from 'react';
import TextField from '../TextField';
import { useAsset, useOrder, usePrices, useUser } from '@/providers';
import { isSameAddress } from '../../helpers';
import { client } from '@/helpers/imx';
import { toast } from 'react-toastify';
import { marketplace_royalty_address, marketplace_royalty_percentage, token_address } from '@/constants/configs';
import web3utils from 'web3-utils';
import Price from '../Price';
import { formatFees } from '@/helpers/formatters';
import Loading from '../Loading';
import PrimaryButton from '../Buttons/PrimaryButton';

type ListProps = {
  className?: string;
};

const List: React.FC<ListProps> = ({ ...props }) => {
  const {
    state: { asset },
  } = useAsset();
  const { token_id, user, fees } = asset || {};
  const {
    state: { address, connection },
  } = useUser();
  const {
    state: { ETHUSD },
  } = usePrices();
  const { dispatch: dispatchOrder } = useOrder();
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
    if (connection && token_id) {
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
      <h2 className="mb-4 mt-4 font-semibold text-lg">{'List'}</h2>
      <div>
        <TextField label="Price" value={amount} onChange={handleChange} disabled={!isSameAddress(address, user)} />
      </div>
      <div className="mt-8">
        <div className="mt-4 flex justify-between items-center">
          <h3 className="font-semibold text-base">{'Total Amount'}</h3>
          <Price amount={totalAmount.toString()} symbol="ETH" rate={ETHUSD} showLabel={false} />
        </div>
        <div className="mt-4">
          <h4 className="font-semibold text-sm">{'Fees'}</h4>
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

      <PrimaryButton
        className="w-full h-12 max-h-12 mt-8 font-medium text-lg flex items-center justify-center"
        onClick={handleList(amount)}
      >
        {loading ? <Loading /> : 'List Asset'}
      </PrimaryButton>
    </div>
  );
};

export default List;
