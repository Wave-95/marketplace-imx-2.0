import React from 'react';
import cx from 'classnames';
import BaseCard from './BaseCard';
import Link from 'next/link';
import Image from 'next/image';
import { FormattedActiveOrder, FormattedAsset } from '@/helpers/formatters';
import ByUser from '../ByUser';
import Price from '../Price';
import { usePrices } from '@/providers/PricesProvider';

interface AssetCardProps {
  asset: FormattedActiveOrder | FormattedAsset;
  className?: string;
}

const AssetCard: React.FC<AssetCardProps> = ({ asset, className, ...props }) => {
  let buyAmount = '';
  let buyType = 'ETH';
  if ('buyAmount' in asset) {
    buyAmount = asset.buyAmount;
    buyType = asset.buyType;
  }
  const { tokenId, name, imgUrl, user } = asset;
  const { state: prices } = usePrices();
  const priceKey = `${buyType}USD`;
  const rate = prices[priceKey];

  const Asset = () => (
    <Link href={`/assets/${tokenId}`}>
      <a>
        <div className="space-y-2 p-4 pt-0">
          <div className="relative min-h-[300px]">
            <Image src={imgUrl} quality={100} objectFit="contain" objectPosition="center" layout="fill" alt={`img-token-${tokenId}`} />
          </div>
          <h4 className="font-medium text-center mt-2">{name}</h4>
        </div>
      </a>
    </Link>
  );

  const AssetDetails = () => (
    <div className="flex items-center justify-between p-4 border-t border-normal">
      <ByUser user={user} label={buyAmount ? 'Sold by' : 'Owned by'} />
      {buyAmount && buyType ? <Price amount={buyAmount} type={buyType} rate={rate} /> : null}
    </div>
  );

  return (
    <BaseCard
      className={cx('hover:-translate-y-0.5 active:translate-y-0 hover:bg-card-secondary-hover active:bg-card-secondary-active', className)}
      {...props}
    >
      <div>
        <Asset />
        <AssetDetails />
      </div>
    </BaseCard>
  );
};

export default AssetCard;
