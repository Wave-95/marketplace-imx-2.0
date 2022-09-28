import Head from 'next/head';
import { collection_name } from '@/constants/configs';
import LayoutDefault from '@/components/LayoutDefault';
import MetadataFilter from '@/components/MetadataFilter';
import { listActiveOrders } from '../helpers/imx';
import { formatActiveOrders, formatQueryToFilterState, FormattedActiveOrder } from '@/helpers/formatters';
import React, { useState } from 'react';
import { GetServerSideProps } from 'next';
import AssetViewer from '@/components/AssetViewer';

interface MarketplaceProps {
  initalActiveOrders: Array<FormattedActiveOrder>;
}

const Marketplace: React.FC<MarketplaceProps> = ({ initalActiveOrders, initialCursor }) => {
  const [activeOrders, setActiveOrders] = useState(initalActiveOrders);

  const page_title = `Marketplace | ${collection_name}`;

  const fetchNextData = async () => {
    console.log('fetching next');
  };

  return (
    <>
      <Head>
        <title>{page_title}</title>
        <meta name="description" content="Description goes here" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <LayoutDefault>
        <div className="flex">
          <div className="hidden lg:block w-sidebar">
            <MetadataFilter className="sticky top-16 border-r border-normal h-headerless" />
          </div>
          <AssetViewer assets={activeOrders} next={fetchNextData} className="flex-1" />
        </div>
      </LayoutDefault>
    </>
  );
};

export default Marketplace;

export const getServerSideProps: GetServerSideProps = async ({ query }) => {
  console.log(query);
  const filterState = formatQueryToFilterState({ query });
  console.log(filterState);
  const activeOrdersResponse = await listActiveOrders();
  const { result: activeOrders, cursor } = activeOrdersResponse;
  const activeOrdersFormatted = formatActiveOrders(activeOrders);

  return {
    props: { initalActiveOrders: activeOrdersFormatted, initialCursor: cursor },
  };
};
