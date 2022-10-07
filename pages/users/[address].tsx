import Counter from '@/components/Counter';
import Header from '@/components/Header';
import LayoutDefault from '@/components/LayoutDefault';
import Loading from '@/components/Loading';
import OrderByMenu from '@/components/Menus/OrderByMenu';
import AssetViewer from '@/components/modules/AssetViewer';
import MetadataFilters from '@/components/modules/MetadataFilters';
import TabGroup from '@/components/TabGroup';
import { base_path, collection_name } from '@/constants/configs';
import {
  formatActiveOrders,
  formatAddressEllipse,
  formatAssets,
  formatFiltersToAssetsApiRequest,
  formatFiltersToOrdersApiRequest,
  FormattedActiveOrder,
  FormattedAsset,
} from '@/helpers/formatters';
import { listActiveOrders, listAssetsByAddress } from '@/helpers/imx';
import { getNumSelectedFilters } from '@/helpers/index';
import { FiltersContextType, useFilters } from '@/providers/FiltersProvider';
import useWindowSize from 'hooks';
import { GetServerSideProps } from 'next';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { ParsedUrlQuery } from 'querystring';
import React, { FormEventHandler, useEffect, useState } from 'react';
import { Copy, Filter, Link, MoreHorizontal } from 'react-feather';
import { toast } from 'react-toastify';

type UserPageProps = {
  address: string;
  tab?: string;
};

type StateData = {
  assets: FormattedAsset[];
  orders: FormattedActiveOrder[];
};

const UserPage: React.FC<UserPageProps> = ({ address, tab }) => {
  const { state: filters } = useFilters() as FiltersContextType;
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
  const handleCopyAddress = () => {
    navigator.clipboard.writeText(address);
    toast.success('Address copied.');
  };
  const handleCopyLink = () => {
    navigator.clipboard.writeText(`${base_path}${router.asPath}`);
    toast.success('User link copied.');
  };

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
    <div className="btn-secondary space-x-2 flex items-center h-10 lg:hidden mr-3" onClick={() => setOpenMobileFilters(!openMobileFilters)}>
      <Filter size={15} />
      <span>{openMobileFilters ? 'Close' : 'Filters'}</span>
      <Counter number={getNumSelectedFilters(filters.selected)} />
    </div>
  );

  const UserHeader = () => (
    <div className="px-4 lg:px-6 flex flex-col justify-center items-start min-h-[300px] space-y-4">
      <h1 className="font-semibold text-2xl">{formatAddressEllipse(address, 6)}</h1>
      <div className="flex space-x-4">
        <button className="btn-secondary p-2 flex items-center space-x-2" onClick={handleCopyAddress}>
          <Copy size={20} />
          <span>Copy Address</span>
        </button>
        <button className="btn-secondary p-2" aria-label="user-link" onClick={handleCopyLink}>
          <Link size={20} />
        </button>
        <button className="btn-secondary p-2">
          <MoreHorizontal size={20} />
        </button>
      </div>
    </div>
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
      <div className="flex overflow-auto">
        <div className="hidden lg:block w-sidebar">
          <MetadataFilters className="sticky border-r border-normal h-headerless" showHeader />
        </div>
        <div className="flex flex-col flex-1 h-[1000px]">
          <Header className="border-b border-normal sticky z-[10]">
            <div className="flex justify-between items-center">
              <div className="flex items-center">
                <div className="hidden mr-3 lg:block font-medium">{collection_name}</div>
                <MobileFiltersButton />
                <div className="">{isLoading ? <Loading /> : null}</div>
              </div>
            </div>
            <OrderByMenu />
          </Header>
          <AssetViewer assets={data} next={next} infiniteScrollHeight="100%" className="flex-1 overflow-auto" />
        </div>
      </div>
    );
  };

  const tabDetails = {
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
      <LayoutDefault>
        <div className="flex-1 flex overflow-auto relative">
          <div className="flex flex-col w-full">
            <UserHeader />
            <TabGroup
              tabDetails={tabDetails}
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
        </div>
      </LayoutDefault>
    </>
  );
};

export default UserPage;

interface Params extends ParsedUrlQuery {
  address: string;
  tab?: string;
}

export const getServerSideProps: GetServerSideProps<UserPageProps, Params> = async ({ params, query, req }) => {
  //   const referer = req.headers.referer || '/';

  const { address } = params!;
  let { tab = '0' } = query;
  if (Array.isArray(tab)) {
    tab = tab.pop() || '0';
  }
  return {
    props: { address, tab },
  };
};
