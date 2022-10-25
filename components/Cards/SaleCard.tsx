import React, { ReactNode, useState } from 'react';
import cx from 'classnames';
import BaseCard from './BaseCard';
import Link from 'next/link';
import Image from 'next/image';
import { FormattedActiveOrder, FormattedAsset, formatWeiToNumber } from '@/utils/formatters';
import ByUser from '../ByUser';
import Price from '../Price';
import { usePrices } from '@/providers/PricesProvider';
import { SaleDetailResponse } from 'pages/api/sale-details';
import PrimaryButton from '../Buttons/PrimaryButton';
import SaleDialog from '../Dialogs/SaleDialog';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
dayjs.extend(relativeTime);
import Countdown, { CountdownRenderProps } from 'react-countdown';

type Props = {
  saleDetail: SaleDetailResponse;
  className?: string;
  type: 'upcoming' | 'ongoing' | 'ended';
};

const SaleCard: React.FC<Props> = ({ saleDetail, className, type, ...props }) => {
  const { price, currency_token_address, start_at, end_at, total_supply, quantity_sold, treasury_address, metadata } = saleDetail;
  let saleTimeLabel = 'Sale ended';
  let saleTimeValue: string | ReactNode = dayjs(end_at).fromNow();
  const countdownRenderer = ({ formatted }: CountdownRenderProps) => (
    <span suppressHydrationWarning={true}>{`${formatted.days}d ${formatted.hours}h ${formatted.minutes}m`}</span>
  );
  switch (type) {
    case 'upcoming':
      saleTimeLabel = 'Sale starts in';
      saleTimeValue = <Countdown date={dayjs(start_at).valueOf()} renderer={countdownRenderer} />;
      break;
    case 'ongoing':
      saleTimeLabel = 'Sale ends in';
      saleTimeValue = end_at ? <Countdown date={dayjs(end_at).valueOf()} renderer={countdownRenderer} /> : '∞';
      break;
    default:
      break;
  }
  const [dialogOpen, setDialogOpen] = useState(false);

  const Item = () => (
    <div className="space-y-2 p-4 pt-0">
      <div className="relative min-h-[300px]">
        <Image
          src={metadata.image}
          quality={100}
          objectFit="contain"
          objectPosition="center"
          layout="fill"
          alt={`metadata-id-${metadata.id}`}
        />
      </div>
      <h4 className="font-medium text-center mt-2">{metadata.name}</h4>
    </div>
  );

  const SaleDetails = () => {
    return (
      <div className="p-4 border-t border-card-secondary-normal">
        <div className="flex items-center justify-between py-2">
          <div className="flex flex-col justify-start items-start">
            <span className="text-secondary text-xs">{saleTimeLabel}</span>
            <span className="text-sm">{saleTimeValue}</span>
          </div>
          <div className="flex flex-col justify-end items-end">
            <span className="text-secondary text-xs">{'Supply limited to'}</span>
            <span className="text-sm">{total_supply || '∞'}</span>
          </div>
        </div>
        <PrimaryButton className="font-semibold w-full !max-h-12 !h-12" onClick={() => setDialogOpen(true)} disabled={type !== 'ongoing'}>
          {price ? `${formatWeiToNumber(price)} ETH` : 'Free Mint'}
        </PrimaryButton>
      </div>
    );
  };

  return (
    <BaseCard
      className={cx('hover:-translate-y-0.5 active:translate-y-0 hover:bg-card-secondary-hover active:bg-card-secondary-active', className)}
      {...props}
    >
      <div>
        <Item />
        <SaleDetails />
        <SaleDialog saleDetail={saleDetail} isOpen={dialogOpen} closeDialog={() => setDialogOpen(false)} />
      </div>
    </BaseCard>
  );
};

export default SaleCard;
