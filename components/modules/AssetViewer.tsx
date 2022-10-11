import { FormattedActiveOrder, FormattedAsset } from '@/helpers/formatters';
import React from 'react';
import InfiniteScroll from 'react-infinite-scroll-component';
import AssetCard from '../Cards/AssetCard';

type Props = {
  assets: FormattedActiveOrder[] | FormattedAsset[];
  next: () => void;
  className?: string;
  infiniteScrollHeight?: string;
};

const AssetViewer: React.FC<Props> = ({ assets, next, className, infiniteScrollHeight, ...props }) => {
  return (
    <div className={className} {...props} id="infinite-scroll-container">
      <InfiniteScroll dataLength={assets.length} next={next} hasMore={true} loader={null} height={infiniteScrollHeight}>
        <div className="h-auto bg-page grid gap-4 p-4 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5">
          {assets.map((asset, key) => {
            return <AssetCard asset={asset} key={key} />;
          })}
        </div>
      </InfiniteScroll>
    </div>
  );
};

export default AssetViewer;
