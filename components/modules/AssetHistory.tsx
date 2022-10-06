import React, { useEffect, useState } from 'react';
import { Order, Transfer } from '@imtbl/core-sdk';
import dayjs from 'dayjs';
import { useAsset, usePrices } from '../../providers';
import { listERC721FilledOrders, listERC721Transfers } from '@/helpers/imx';
import { Box, Send, ShoppingCart } from 'react-feather';
import { AssetContextType } from '@/providers/AssetProvider';
import Loading from '../Loading';
import EventCard from '../Cards/EventCard';
import UserLink from '../Links/UserLink';
import Price from '../Price';
import { PricesContextType } from '@/providers/PricesProvider';
import { formatWeiToNumber } from '@/helpers/formatters';

type AssetHistoryProps = {
  className?: string;
};
const AssetHistory: React.FC<AssetHistoryProps> = ({ ...props }) => {
  const {
    state: {
      asset: { token_id, created_at },
    },
  } = useAsset() as AssetContextType;
  const {
    state: { ETHUSD },
  } = usePrices() as PricesContextType;
  const [loading, setLoading] = useState(false);
  const [remainingEvents, setRemainingEvents] = useState<Array<Transfer | Order>>([]);

  useEffect(() => {
    if (token_id) {
      const transfersPromise = listERC721Transfers(token_id);
      const tradesPromise = listERC721FilledOrders(token_id);
      Promise.all([transfersPromise, tradesPromise]).then((results) => {
        const transferEvents = results[0].result;
        const filledOrderEvents = results[1].result;
        const allEvents = [...transferEvents, ...filledOrderEvents];
        type Event = Order | Transfer;
        const sortedEvents = allEvents.sort((a: Event, b: Event) => {
          if (a.timestamp && b.timestamp) {
            return dayjs(a.timestamp).diff(dayjs(b.timestamp));
          }
          return 0;
        });
        setRemainingEvents(sortedEvents);
        setLoading(false);
      });
    }
  }, [token_id]);

  const renderRemainingEvents = () => {
    return remainingEvents.map((event, idx) => {
      if ('order_id' in event) {
        const {
          sell: {
            data: { quantity },
          },
        } = event;
        const TradeTitle = (
          <div className="flex items-center justify-between w-full">
            <div>
              <span>{'Purchased by '}</span>
              <UserLink user={event.user} accentOn />
            </div>
            <Price amount={formatWeiToNumber(quantity)} type="ETH" rate={ETHUSD} className="hidden lg:block" />
          </div>
        );
        return event.timestamp ? (
          <EventCard title={TradeTitle} timestamp={event.timestamp} icon={<ShoppingCart />} key={`event-${idx}`} />
        ) : null;
      }

      if ('receiver' in event) {
        const TransferTitle = (
          <>
            <span>{'Transfer from '}</span>
            <UserLink user={event.user} accentOn />
            <span>{' to '}</span>
            <UserLink user={event.receiver} accentOn />
          </>
        );
        return event.timestamp ? (
          <EventCard title={TransferTitle} timestamp={event.timestamp} icon={<Send />} key={`event-${idx}`} />
        ) : null;
      }
      return null;
    });
  };

  return (
    <div {...props}>
      <div className="flex flex-col justify-center items-center space-y-4">
        {created_at && <EventCard title="Minted" timestamp={created_at} icon={<Box />} />}
        {renderRemainingEvents()}
        {loading ? (
          <div className="flex items-center space-x-2 mt-4">
            <Loading />
            <p className="text-sm text-secondary">loading more events</p>
          </div>
        ) : null}
      </div>
    </div>
  );
};

export default AssetHistory;
