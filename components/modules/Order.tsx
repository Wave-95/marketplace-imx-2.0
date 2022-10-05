import React, { useState } from 'react';
import cx from 'classnames';
import { Order, WalletConnection } from '@imtbl/core-sdk';
import web3utils from 'web3-utils';
import ByUser from '../ByUser';
import Price from '../Price';
import { formatWeiToNumber } from '@/helpers/formatters';
import { PricesContextType, usePrices } from '@/providers/PricesProvider';
import { UserContextType, useUser } from '@/providers/UserProvider';
import { isSameAddress } from '@/helpers/index';
import { client, getAsset } from '@/helpers/imx';
import { useRouter } from 'next/router';
import { toast } from 'react-toastify';
import Loading from '../Loading';
import { OrderContextType, useOrder } from '@/providers/OrderProvider';
import { AssetContextType, useAsset } from '@/providers/AssetProvider';

type OrderProps = {
  className?: string;
  order: Order;
};

const Order: React.FC<OrderProps> = ({ className, order }) => {
  const [loading, setLoading] = useState(false);
  const { order_id, user, buy: { type, data: { quantity } = {} } = {}, sell: { data: { token_id } = {} } = {} } = order || ({} as Order);
  const {
    state: { ETHUSD },
  } = usePrices() as PricesContextType;
  const {
    state: { address, connection, balances },
  } = useUser() as UserContextType;
  const { dispatch: dispatchOrder } = useOrder() as OrderContextType;
  const { dispatch: dispatchAsset } = useAsset() as AssetContextType;
  const router = useRouter();

  const handleBuy = async () => {
    const balanceETH = balances?.ETH?.balance;
    const balanceETHBN = web3utils.toBN(balanceETH);
    const quantityBN = web3utils.toBN(quantity as string);

    if (balanceETHBN.lt(quantityBN)) {
      return toast.error('Insufficient funds to purchase asset.');
    }

    setLoading(true);
    try {
      if (connection && address) {
        await client.createTrade(connection as WalletConnection, {
          order_id,
          user: address,
        });
        setTimeout(() => {
          token_id && getAsset(token_id).then((data) => dispatchAsset({ type: 'set_asset', payload: data }));
          setLoading(false);
          dispatchOrder({ type: 'clear_order' });
        }, 4000);
      }
    } catch (e: any) {
      setLoading(false);

      if (e.message.match(/user rejected signing/)) {
        return toast.error('You have rejected the transaction.');
      }
      toast.error('There was an issue purchasing the item.');
    }
  };

  const handleCancel = async () => {
    setLoading(true);
    try {
      if (connection && address) {
        await client.cancelOrder(connection as WalletConnection, {
          order_id,
        });
        dispatchOrder({ type: 'clear_order' });
      }
    } catch (e: any) {
      if (e.message.match(/user rejected signing/)) {
        setLoading(false);
        return toast.error('You have rejected the transaction.');
      }
      toast.error('There was an issue cancelling the listing.');
    }
    setLoading(false);
  };

  const redirectLogin = () => {
    router.push('/login');
  };

  const isOwner = isSameAddress(address, user);
  const buttonText = connection ? (isOwner ? 'Cancel Listing' : 'Buy Now') : 'Connect to Buy';

  return (
    <div className={cx('', className)}>
      <div className={cx('p-3 pt-4 space-y-4 border-t border-normal lg:bg-page bg-bar backdrop-blur-lg', className)}>
        <div className="grid grid-cols-2 px-1">
          <ByUser label={'Sold by'} user={user} />
          {quantity && type ? <Price amount={formatWeiToNumber(quantity)} type={type} rate={ETHUSD} /> : null}
        </div>
        <button
          className="max-h-12 w-full inline-flex items-center font-medium focusring will-change-transform btn-primary active:scale-[0.98] shadow-button disabled:shadow-none hover:opacity-90 text-lg h-12 px-6 justify-center rounded-button transition duration-[100ms] ease-out"
          onClick={connection ? (isOwner ? handleCancel : handleBuy) : redirectLogin}
        >
          {loading ? <Loading /> : buttonText}
        </button>
      </div>
    </div>
  );
};

export default Order;
