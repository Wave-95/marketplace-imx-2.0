import React, { useEffect, useState } from 'react';
import cx from 'classnames';
import TextField from '../TextField';
import { useAsset, useUser } from '../../providers';
import { UserContextType } from '@/providers/UserProvider';
import { isSameAddress, refreshData } from '../../helpers';
import { toast } from 'react-toastify';
import { client, getAsset, listERC721FilledOrders, listERC721Trades, listERC721Transfers } from '@/helpers/imx';
import { token_address } from '@/constants/configs';
import { AlertTriangle, Box, Send, ShoppingCart, Star } from 'react-feather';
import { AssetContextType } from '@/providers/AssetProvider';
import Loading from '../Loading';
import EventCard from '../Cards/EventCard';
import { ListOrdersResponse, ListTradesResponse, ListTransfersResponse, Order, Transfer } from '@imtbl/core-sdk';
import dayjs from 'dayjs';
import UserLink from '../Links/UserLink';

type AssetHistoryProps = {
  className?: string;
};
const AssetHistory: React.FC<AssetHistoryProps> = ({ ...props }) => {
  const {
    state: { address, connection },
  } = useUser() as UserContextType;
  const {
    state: {
      asset: { token_id, user, created_at },
    },
    dispatch,
  } = useAsset() as AssetContextType;
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
    return remainingEvents.map((event) => {
      if ('order_id' in event) {
        return event.timestamp ? <EventCard title="Trade" timestamp={event.timestamp} icon={<ShoppingCart />} /> : null;
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
        return event.timestamp ? <EventCard title={TransferTitle} timestamp={event.timestamp} icon={<Send />} /> : null;
      }
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
