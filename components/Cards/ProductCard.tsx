import React, { ReactNode, useState } from 'react';
import cx from 'classnames';
import BaseCard from './BaseCard';
import Image from 'next/image';
import { Product } from '@prisma/client';
import PrimaryButton from '../Buttons/PrimaryButton';
import ProductDialog from '../Dialogs/ProductDialog';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
dayjs.extend(relativeTime);
import Countdown, { CountdownRenderProps } from 'react-countdown';

type Props = {
  product: Product;
  className?: string;
  type: 'upcoming' | 'ongoing' | 'ended';
};

const ProductCard: React.FC<Props> = ({ product, className, type, ...props }) => {
  const {
    id,
    name,
    description,
    image,
    price,
    currency_token_address,
    sale_start_at,
    sale_end_at,
    total_supply,
    quantity_sold,
    treasury_address,
  } = product;
  let saleTimeLabel = 'Sale ended';
  let saleTimeValue: string | ReactNode = dayjs(sale_end_at).fromNow();
  const countdownRenderer = ({ formatted }: CountdownRenderProps) => (
    <span suppressHydrationWarning={true}>{`${formatted.days}d ${formatted.hours}h ${formatted.minutes}m`}</span>
  );
  switch (type) {
    case 'upcoming':
      saleTimeLabel = 'Sale starts in';
      saleTimeValue = <Countdown date={dayjs(sale_start_at).valueOf()} renderer={countdownRenderer} />;
      break;
    case 'ongoing':
      saleTimeLabel = 'Sale ends in';
      saleTimeValue = sale_end_at ? <Countdown date={dayjs(sale_end_at).valueOf()} renderer={countdownRenderer} /> : '∞';
      break;
    default:
      break;
  }
  const [dialogOpen, setDialogOpen] = useState(false);

  const Item = () => (
    <div className="space-y-2 p-4 pt-0">
      <div className="relative min-h-[300px]">
        <Image src={image} quality={100} objectFit="contain" objectPosition="center" layout="fill" alt={`product-id-${id}`} />
      </div>
      <h4 className="font-medium text-center mt-2">{name}</h4>
    </div>
  );

  const ProductDetails = () => {
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
          {price ? `${price} ETH` : 'Free Mint'}
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
        <ProductDetails />
        <ProductDialog product={product} isOpen={dialogOpen} closeDialog={() => setDialogOpen(false)} />
      </div>
    </BaseCard>
  );
};

export default ProductCard;
