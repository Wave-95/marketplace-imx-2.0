import React, { useEffect, useState } from 'react';
import { GetServerSideProps } from 'next';
import Head from 'next/head';
import { collection_name } from '@/constants/configs';
import AssetViewer from '@/components/AssetViewer';
import LayoutDefault from '@/components/LayoutDefault';
import MetadataFilter from '@/components/MetadataFilter';
import { listActiveOrders } from '@/helpers/imx';
import { formatActiveOrders, formatQueryToFilterState, FormattedActiveOrder } from '@/helpers/formatters';

interface MarketplaceProps {
  initalActiveOrders: Array<FormattedActiveOrder>;
  initialCursor: string;
}

const Marketplace: React.FC<MarketplaceProps> = ({ initalActiveOrders, initialCursor }) => {
  const [activeOrders, setActiveOrders] = useState(initalActiveOrders);
  const [cursor, setCursor] = useState(initialCursor);
  const [isLoading, setIsLoading] = useState(false);

  const page_title = `Marketplace | ${collection_name}`;

  const fetchData = async () => {
    setIsLoading(true);
    // const filterParams = filtersToApiRequest(filters);
    const activeOrdersResponse = await listActiveOrders({
      // ...filterParams,
    });
    const activeOrdersFormatted = formatActiveOrders(activeOrdersResponse.result);
    setActiveOrders(activeOrdersFormatted);
    setCursor(activeOrdersResponse.cursor);
    setIsLoading(false);
  };

  const fetchNextData = async () => {
    console.log('fetching next...');
    setIsLoading(true);
    // const filterParams = filtersToApiRequest(filters);
    const activeOrdersResponse = await listActiveOrders({
      // ...filterParams,
      cursor,
    });
    const activeOrdersFormatted = formatActiveOrders(activeOrdersResponse.result);
    const totalActiveOrders = activeOrders.concat(activeOrdersFormatted);
    setActiveOrders(totalActiveOrders);
    setCursor(activeOrdersResponse.cursor);
    setIsLoading(false);
  };

  //TODO: Add filters dependency after setting up store
  useEffect(() => {
    fetchData();
  }, []);

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
          <AssetViewer assets={activeOrders} isLoading={isLoading} next={fetchNextData} className="flex-1" />
        </div>
      </LayoutDefault>
    </>
  );
};

export default Marketplace;

export const getServerSideProps: GetServerSideProps = async ({ query }) => {
  console.log({ query });
  const filterState = formatQueryToFilterState({ query });
  console.log({ filterState });
  const activeOrdersResponse = await listActiveOrders();
  const { result: activeOrders, cursor } = activeOrdersResponse;
  const activeOrdersFormatted = formatActiveOrders(activeOrders);

  return {
    props: { initalActiveOrders: activeOrdersFormatted, initialCursor: cursor },
  };
};
