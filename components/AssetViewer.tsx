import { collection_name } from '@/constants/configs';
import { FormattedActiveOrder } from '@/helpers/formatters';
import React from 'react';
import InfiniteScroll from 'react-infinite-scroll-component';
import AssetCard from './Cards/AssetCard';
import Loading from './Loading';

interface AssetViewerProps {
  assets: Array<FormattedActiveOrder>;
  next: () => void;
  isLoading: Boolean;
  className?: string;
}

const AssetViewer: React.FC<AssetViewerProps> = ({ assets, isLoading, next, className, ...props }) => {
  return (
    <div className={className} {...props}>
      <div className="header border-b border-normal sticky top-16">
        <div className="flex justify-between items-center">
          <div className="flex items-center">
            <div className="hidden mr-3 lg:block font-medium">{collection_name}</div>
            <div className="">{isLoading ? <Loading /> : null}</div>
          </div>
        </div>
      </div>
      <InfiniteScroll dataLength={assets.length} next={next} hasMore={true} loader={null} height="calc(100vh - 8rem)">
        <div className="h-full bg-page grid gap-4 p-4 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5">
          {assets.map((asset, key) => {
            return <AssetCard asset={asset} key={key} />;
          })}
        </div>
      </InfiniteScroll>
    </div>
  );
};

export default AssetViewer;
