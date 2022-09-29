import { FormattedActiveOrder } from '@/helpers/formatters';
import React from 'react';
import InfiniteScroll from 'react-infinite-scroll-component';
import AssetCard from './Cards/AssetCard';

interface AssetViewerProps {
  assets: Array<FormattedActiveOrder>;
  next: () => void;
  height: string;
  isLoading: Boolean;
  className?: string;
}

const AssetViewer: React.FC<AssetViewerProps> = ({ assets, isLoading, next, height, className, ...props }) => {
  return (
    <InfiniteScroll dataLength={assets.length} next={next} hasMore={true} loader={null} height={height}>
      <div className="bg-page grid gap-4 p-4 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5">
        {assets.map((asset, key) => {
          return <AssetCard asset={asset} key={key} />;
        })}
      </div>
    </InfiniteScroll>
  );
};

export default AssetViewer;
