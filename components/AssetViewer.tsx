import { collection_name } from '@/constants/configs';
import { FormattedActiveOrder } from '@/helpers/formatters';
import React from 'react';
import InfiniteScroll from 'react-infinite-scroll-component';
import AssetCard from './Cards/AssetCard';
import Loading from './Loading';

interface AssetViewerProps {
  assets: Array<FormattedActiveOrder>;
  next: () => void;
  className?: string;
  infiniteScrollHeight: string;
}

const AssetViewer: React.FC<AssetViewerProps> = ({ assets, next, className, infiniteScrollHeight, ...props }) => {
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

/* <div className="relative header border-b border-normal lg:sticky lg:top-16 z-[100]">
        <div className="flex justify-between items-center">
          <div className="flex items-center">
            <div className="hidden mr-3 lg:block font-medium">{collection_name}</div>
            <div className="">{isLoading ? <Loading /> : null}</div>
          </div>
        </div>
      </div> */

export default AssetViewer;
