import SecondaryButton from '@/components/Buttons/SecondaryButton';
import Counter from '@/components/Counter';
import Header from '@/components/Header';
import LayoutDefault from '@/components/LayoutDefault';
import Loading from '@/components/Loading';
import AssetViewer from '@/components/modules/AssetViewer';
import MetadataFilters from '@/components/modules/MetadataFilters';
import UserHeader from '@/components/modules/UserHeader';
import TabGroup from '@/components/TabGroup';
import { collection_name } from '@/constants/configs';
import {
  formatActiveOrders,
  formatAssets,
  formatFiltersToAssetsApiRequest,
  formatFiltersToOrdersApiRequest,
  FormattedActiveOrder,
  FormattedAsset,
} from 'utils/formatters';
import { listActiveOrders, listAssetsByAddress } from 'lib/imx';
import { getNumSelectedFilters } from '@/utils';
import { useFilters } from '@/providers/FiltersProvider';
import useWindowSize from 'hooks';
import { GetServerSideProps } from 'next';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { ParsedUrlQuery } from 'querystring';
import React, { FormEventHandler, useEffect, useState } from 'react';
import { Filter } from 'react-feather';
import { Page } from 'types/page';

type Props = {
  address: string;
  tab?: string;
};

const UserPage: Page<Props> = ({ address, tab }) => {
  const { state: filters } = useFilters();
  const [isLoading, setIsLoading] = useState(false);
  const [openMobileFilters, setOpenMobileFilters] = useState(false);
  const [assets, setAssets] = useState<FormattedAsset[]>([]);
  const [orders, setOrders] = useState<FormattedActiveOrder[]>([]);
  const [assetsCursor, setAssetsCursor] = useState('');
  const [ordersCursor, setOrdersCursor] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(Number(tab));
  const [_w, availHeight] = useWindowSize();
  const mobileFiltersHeight = `calc(${availHeight}px - 4rem)`;
  const router = useRouter();

  const handleTabChange: FormEventHandler<HTMLDivElement> & ((index: number) => void) = (index) => {
    if (typeof index === 'number') {
      setSelectedIndex(index);
      router.replace({ pathname: `/users/${address}`, query: { tab: index.toString() } }, undefined, { shallow: true });
    }
  };

  const fetchAssets = async () => {
    setIsLoading(true);
    const filterParams = formatFiltersToAssetsApiRequest(filters);
    const assetsResponse = await listAssetsByAddress(address, {
      ...filterParams,
    });
    const assetsFormatted = formatAssets(assetsResponse.result);
    setAssets(assetsFormatted);
    setAssetsCursor(assetsResponse.cursor);
    setIsLoading(false);
  };

  const fetchNextAssets = async () => {
    if (!assetsCursor) {
      return;
    }
    setIsLoading(true);
    const filterParams = formatFiltersToAssetsApiRequest(filters);
    const assetsResponse = await listAssetsByAddress(address, {
      ...filterParams,
      cursor: assetsCursor,
    });
    const assetsFormatted = formatAssets(assetsResponse.result);
    const totalAssets = assets.concat(assetsFormatted);
    setAssets(totalAssets);
    setAssetsCursor(assetsResponse.cursor);
    setIsLoading(false);
  };

  const fetchOrders = async () => {
    setIsLoading(true);
    const filterParams = formatFiltersToOrdersApiRequest(filters);
    const activeOrdersResponse = await listActiveOrders({
      user: address,
      ...filterParams,
    });
    const activeOrdersFormatted = formatActiveOrders(activeOrdersResponse.result);
    setOrders(activeOrdersFormatted);
    setOrdersCursor(activeOrdersResponse.cursor);
    setIsLoading(false);
  };

  const fetchNextOrders = async () => {
    if (!ordersCursor) {
      return;
    }
    setIsLoading(true);
    const filterParams = formatFiltersToOrdersApiRequest(filters);
    const activeOrdersResponse = await listActiveOrders({
      user: address,
      ...filterParams,
      cursor: ordersCursor,
    });
    const activeOrdersFormatted = formatActiveOrders(activeOrdersResponse.result);
    const totalOrders = orders.concat(activeOrdersFormatted);
    setOrders(totalOrders);
    setOrdersCursor(activeOrdersResponse.cursor);
    setIsLoading(false);
  };

  useEffect(() => {
    fetchAssets();
    fetchOrders();
  }, [address, filters]);

  const MobileFiltersButton = () => (
    <SecondaryButton className="space-x-2 h-10 lg:hidden mr-3" onClick={() => setOpenMobileFilters(!openMobileFilters)}>
      <Filter size={15} />
      <span>{openMobileFilters ? 'Close' : 'Filters'}</span>
      <Counter number={getNumSelectedFilters(filters.selected)} />
    </SecondaryButton>
  );

  type OwnerOrSaleProps = {
    data: FormattedAsset[] | FormattedActiveOrder[];
    next: () => void;
  };
  const OwnedOrOnSale: React.FC<OwnerOrSaleProps> = ({ data, next }) => {
    if (openMobileFilters) {
      return null;
    }

    return (
      <div className="flex">
        <div className="hidden lg:block w-sidebar">
          <MetadataFilters className="sticky border-r border-normal h-headerless top-[4rem] lg:top-[5rem]" showHeader />
        </div>
        <div className="w-full">
          <Header className="border-b border-normal sticky z-[10] top-[4rem] lg:top-[5rem] max-h-[4rem]">
            <div className="flex justify-between items-center">
              <div className="flex items-center">
                <div className="hidden mr-3 lg:block font-medium">{collection_name}</div>
                <MobileFiltersButton />
                <div className="">{isLoading ? <Loading /> : null}</div>
              </div>
            </div>
          </Header>
          <AssetViewer assets={data} next={next} />
        </div>
      </div>
    );
  };

  const tabMapping = {
    Owned: <OwnedOrOnSale data={assets} next={fetchNextAssets} />,
    'On Sale': <OwnedOrOnSale data={orders} next={fetchNextOrders} />,
    History: <></>,
  };

  const page_title = `Users | ${address || ''}`;

  return (
    <>
      <Head>
        <title>{page_title}</title>
        <meta name="description" content="Description goes here" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div>
        <UserHeader address={address} />
        <TabGroup
          tabMapping={tabMapping}
          className="w-full"
          tabListClassName="!justify-start lg:pl-6 pl-4"
          selectedIndex={selectedIndex}
          onChange={handleTabChange}
        />
      </div>
      {openMobileFilters ? (
        <MetadataFilters
          className={`lg:hidden absolute w-full z-[10] top-0`}
          isMobile
          closeMobile={() => setOpenMobileFilters(false)}
          showHeader
          height={mobileFiltersHeight}
        />
      ) : null}
    </>
  );
};

export default UserPage;

UserPage.getLayout = (page: React.ReactNode) => {
  return <LayoutDefault>{page}</LayoutDefault>;
};

type Params = ParsedUrlQuery & {
  address: string;
  tab?: string;
};

export const getServerSideProps: GetServerSideProps<Props, Params> = async ({ params, query }) => {
  const { address } = params!;
  let { tab = '0' } = query;
  if (Array.isArray(tab)) {
    tab = tab.pop() || '0';
  }
  return {
    props: { address, tab },
  };
};
