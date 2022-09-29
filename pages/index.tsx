import React, { useEffect, useState } from 'react';
import { GetServerSideProps } from 'next';
import Head from 'next/head';
import { collection_name } from '@/constants/configs';
import AssetViewer from '@/components/AssetViewer';
import LayoutDefault from '@/components/LayoutDefault';
import { listActiveOrders } from '@/helpers/imx';
import {
  formatActiveOrders,
  formatFiltersToApiRequest,
  formatQueryToFilterState,
  FormattedActiveOrder,
} from '@/helpers/formatters';
import MetadataFilters from '@/components/MetadataFilters';
import { useFilters } from '../providers';
import { FiltersContextType } from '@/providers/FiltersProvider';
import Header from '@/components/Header';
import Loading from '@/components/Loading';

const Marketplace: React.FC = () => {
  const { state: filters } = useFilters() as FiltersContextType;
  const [activeOrders, setActiveOrders] = useState<FormattedActiveOrder[]>([]);
  const [cursor, setCursor] = useState<string>();
  const [isLoading, setIsLoading] = useState(false);

  const page_title = `Marketplace | ${collection_name}`;

  const fetchData = async () => {
    setIsLoading(true);
    const filterParams = formatFiltersToApiRequest(filters);
    const activeOrdersResponse = await listActiveOrders({
      ...filterParams,
    });
    const activeOrdersFormatted = formatActiveOrders(activeOrdersResponse.result);
    setActiveOrders(activeOrdersFormatted);
    setCursor(activeOrdersResponse.cursor);
    setIsLoading(false);
  };

  const fetchNextData = async () => {
    console.log('fetching next...');
    setIsLoading(true);
    const filterParams = formatFiltersToApiRequest(filters);
    const activeOrdersResponse = await listActiveOrders({
      ...filterParams,
      cursor,
    });
    const activeOrdersFormatted = formatActiveOrders(activeOrdersResponse.result);
    const totalActiveOrders = activeOrders.concat(activeOrdersFormatted);
    setActiveOrders(totalActiveOrders);
    setCursor(activeOrdersResponse.cursor);
    setIsLoading(false);
  };

  useEffect(() => {
    fetchData();
  }, [filters]);

  return (
    <>
      <Head>
        <title>{page_title}</title>
        <meta name="description" content="Description goes here" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <LayoutDefault>
        <div className="flex-1 flex overflow-auto">
          <div className="hidden lg:block w-sidebar">
            <MetadataFilters className="sticky top-16 border-r border-normal h-headerless" />
          </div>
          <div className="flex flex-col flex-1 h-full lg:h-auto">
            <Header className="border-b border-normal sticky z-[100]">
              <div className="flex justify-between items-center">
                <div className="flex items-center">
                  <div className="hidden mr-3 lg:block font-medium">{collection_name}</div>
                  <div className="">{isLoading ? <Loading /> : null}</div>
                </div>
              </div>
            </Header>
            <AssetViewer
              assets={activeOrders}
              next={fetchNextData}
              infiniteScrollHeight="100%"
              className="flex-1 overflow-auto"
            />
          </div>
        </div>
      </LayoutDefault>
    </>
  );
};

export default Marketplace;

export const getServerSideProps: GetServerSideProps = async ({ query }) => {
  const filterState = formatQueryToFilterState({ query });
  const filterParams = formatFiltersToApiRequest(filterState);

  const activeOrdersResponse = await listActiveOrders({ ...filterParams });
  const { result: activeOrders, cursor } = activeOrdersResponse;
  const activeOrdersFormatted = formatActiveOrders(activeOrders);

  return {
    props: { initalActiveOrders: activeOrdersFormatted, initialCursor: cursor },
  };
};
