import { FormattedActiveOrder, FormattedAsset } from '@/utils/formatters';
import React from 'react';
import InfiniteScroll from 'react-infinite-scroll-component';
import AssetCard from '../Cards/AssetCard';
import Centered from '../Containers/Centered';

type Props = {
  assets: FormattedActiveOrder[] | FormattedAsset[];
  next: () => void;
  className?: string;
  infiniteScrollHeight?: string;
};

//#id is set to infinite-scroll-container so that { height: 100% } can be given to child div. See globals.css file

const AssetViewer: React.FC<Props> = ({ assets, next, className, infiniteScrollHeight, ...props }) => {
  return assets.length ? (
    <div className={className} {...props} id="infinite-scroll-container">
      <InfiniteScroll dataLength={assets.length} next={next} hasMore={true} loader={null} height={infiniteScrollHeight}>
        <div className="h-auto bg-page grid gap-4 p-4 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5">
          {assets.map((asset, key) => {
            return <AssetCard asset={asset} key={key} />;
          })}
        </div>
      </InfiniteScroll>
    </div>
  ) : (
    <Centered className="w-full h-[50vh] text-secondary text-lg">{'Could not find any items listed for sale.'}</Centered>
  );
};

export default AssetViewer;
