import React, { useEffect, useState } from 'react';
import Head from 'next/head';
import cx from 'classnames';
import { collection_name } from '@/constants/configs';
import AssetViewer from '@/components/modules/AssetViewer';
import LayoutDefault from '@/components/LayoutDefault';
import { listActiveOrders } from 'lib/imx';
import { formatActiveOrders, formatFiltersToOrdersApiRequest, FormattedActiveOrder } from 'utils/formatters';
import MetadataFilters from '@/components/modules/MetadataFilters';
import { useFilters } from '../../providers';
import Header from '@/components/Header';
import Loading from '@/components/Loading';
import OrderByMenu from '@/components/Menus/OrderByMenu';
import { Filter } from 'react-feather';
import Counter from '@/components/Counter';
import { getNumSelectedFilters } from '@/utils';
import { useWindowSize } from 'hooks';
import { Page } from 'types/page';
import SecondaryButton from '@/components/Buttons/SecondaryButton';
import Centered from '@/components/Containers/Centered';
import MarketplaceActivityTable from '@/components/Tables/MarketplaceActivityTable';

const Marketplace: Page = () => {
  const { state: filters } = useFilters();
  const [activeOrders, setActiveOrders] = useState<FormattedActiveOrder[]>([]);
  const [cursor, setCursor] = useState<string>();
  const [isLoading, setIsLoading] = useState(false);
  const [openMobileFilters, setOpenMobileFilters] = useState(false);
  const [_w, availHeight] = useWindowSize();
  const mobileFiltersHeight = `calc(${availHeight}px - 8rem)`;

  const page_title = `Marketplace | ${collection_name}`;

  const fetchData = async () => {
    setIsLoading(true);
    const filterParams = formatFiltersToOrdersApiRequest(filters);
    const activeOrdersResponse = await listActiveOrders({
      ...filterParams,
    });
    const activeOrdersFormatted = formatActiveOrders(activeOrdersResponse.result);
    setActiveOrders(activeOrdersFormatted);
    setCursor(activeOrdersResponse.cursor);
    setIsLoading(false);
  };

  const fetchNextData = async () => {
    if (!cursor) {
      return;
    }
    console.log('fetching next...');
    setIsLoading(true);
    const filterParams = formatFiltersToOrdersApiRequest(filters);
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
  }, [filters.selected, filters.orderByKey]);

  const MobileFiltersButton = () => (
    <SecondaryButton className="space-x-2 h-10 lg:hidden mr-3" onClick={() => setOpenMobileFilters(!openMobileFilters)}>
      <Filter size={15} />
      <span>{openMobileFilters ? 'Close' : 'Filters'}</span>
      <Counter number={getNumSelectedFilters(filters.selected)} />
    </SecondaryButton>
  );

  return (
    <>
      <Head>
        <title>{page_title}</title>
        <meta name="description" content="Description goes here" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      {openMobileFilters ? (
        <MetadataFilters
          className={`lg:hidden absolute w-full z-[10] top-[8rem]`}
          isMobile
          closeMobile={() => setOpenMobileFilters(false)}
          height={mobileFiltersHeight}
          showFooter
        />
      ) : null}
      <div className="flex-1 flex">
        <div className="hidden lg:block w-sidebar">
          <MetadataFilters className="sticky top-[4rem] lg:top-[5rem] border-r border-normal h-headerless" showHeader />
        </div>
        <div className="w-full">
          <Header className="border-b border-normal sticky z-[10] top-[4rem] lg:top-[5rem] max-h-[4rem]">
            <div className="flex justify-between items-center">
              <Centered>
                <h3 className="hidden mr-3 lg:block font-medium">{collection_name}</h3>
                <MobileFiltersButton />
                <div className="">{isLoading ? <Loading /> : null}</div>
              </Centered>
            </div>
            <OrderByMenu />
          </Header>
          <AssetViewer assets={activeOrders} next={fetchNextData} className={cx({ hidden: openMobileFilters })} />
        </div>
      </div>
    </>
  );
};

export default Marketplace;

Marketplace.getLayout = (page: React.ReactNode) => {
  return <LayoutDefault>{page}</LayoutDefault>;
};
