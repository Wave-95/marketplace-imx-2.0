import ByUser from '@/components/ByUser';
import LayoutDefault from '@/components/LayoutDefault';
import Metadata from '@/components/Metadata';
import Price from '@/components/Price';
import TabGroup from '@/components/TabGroup';
import { formatWeiToNumber } from '@/helpers/formatters';
import { client, getActiveOrder, getAsset } from '@/helpers/imx';
import { DimensionContextType, useDimension } from '@/providers/DimensionProvider';
import { PricesContextType, usePrices } from '@/providers/PricesProvider';
import { UserContextType, useUser } from '@/providers/UserProvider';
import { Asset, Order, WalletConnection } from '@imtbl/core-sdk';
import { GetServerSideProps } from 'next';
import Head from 'next/head';
import Image from 'next/image';
import { ParsedUrlQuery } from 'querystring';
import React, { useEffect, useState } from 'react';
import cx from 'classnames';
import { toast } from 'react-toastify';
import { useRouter } from 'next/router';
import Transfer from '@/components/Transfer';
import { isAddressSame, refreshData } from '@/helpers/index';
import Sell from '@/components/Sell';

type AssetPageProps = {
  tokenId: string;
  asset: Asset;
  activeOrder: Order | null;
};

const AssetPage: React.FC<AssetPageProps> = ({ tokenId, asset, activeOrder }) => {
  const {
    state: { availHeight },
  } = useDimension() as DimensionContextType;
  const {
    state: { address, connection },
  } = useUser() as UserContextType;
  const {
    state: { ETHUSD },
  } = usePrices() as PricesContextType;
  const { image_url, metadata, name, user } = asset;
  const { order_id, buy: { type, data: { quantity } = {} } = {} } = activeOrder || ({} as Order);
  const router = useRouter();
  const { query } = router;
  const page_title = `Asset | ${name}`;

  const [selectedIndex, setSelectedIndex] = useState(0);

  const handleTabChange = (index: number) => {
    router.replace({ pathname: `/assets/${tokenId}`, query: { tab: index.toString() } }, undefined, { shallow: true });
  };

  useEffect(() => {
    const { tab } = query;
    setSelectedIndex(Number(tab));
  }, [query]);

  const handleBuy = async () => {
    try {
      if (connection && address) {
        await client.createTrade(connection as WalletConnection, {
          order_id,
          user: address,
        });
        refreshData(router);
      }
    } catch (e: any) {
      if (e.message.match(/user rejected signing/)) {
        return toast.error('You have rejected the transaction.');
      }
      toast.error('There was an issue purchasing the item.');
    }
  };

  const handleCancel = async () => {
    try {
      if (connection && address) {
        await client.cancelOrder(connection as WalletConnection, {
          order_id,
        });
        refreshData(router);
      }
    } catch (e: any) {
      if (e.message.match(/user rejected signing/)) {
        return toast.error('You have rejected the transaction.');
      }
      toast.error('There was an issue cancelling the listing.');
    }
  };

  const redirectLogin = () => {
    router.push('/login');
  };

  const ImgDesktop = () => (
    <div className="flex-1 hidden lg:flex justify-center items-center">
      {image_url ? (
        <div className="w-full min-h-[500px] relative">
          <Image
            src={image_url}
            alt={`img-token-${tokenId}`}
            quality={100}
            objectFit="contain"
            objectPosition="center"
            layout="fill"
          />
        </div>
      ) : (
        <p>No image found</p>
      )}
    </div>
  );

  const ImgMobile = () => (
    <div className="lg:hidden justify-center items-center">
      {image_url ? (
        <div className="w-full min-h-[300px] relative mt-16">
          <Image
            src={image_url}
            alt={`img-token-${tokenId}`}
            quality={100}
            objectFit="contain"
            objectPosition="center"
            layout="fill"
          />
        </div>
      ) : (
        <p>No image found</p>
      )}
    </div>
  );

  //Choose which metadata keys and in which order to display to user
  const metadataToDisplay = [
    'set',
    'type',
    'rarity',
    'god',
    'tribe',
    'attack',
    'health',
    'mana',
  ] as keyof typeof metadata;

  const Details = () => (
    <div>
      {metadata ? <Metadata keys={metadataToDisplay} metadata={metadata} className="lg:px-8 p-4" /> : null}
      {isAddressSame(address, user) && !activeOrder ? (
        <Sell tokenId={tokenId} owner={user} className="lg:px-8 p-4" />
      ) : null}
    </div>
  );

  const tabDetails = {
    Details: <Details />,
    History: <div></div>,
    Transfer: <Transfer tokenId={tokenId} owner={user} className="lg:px-8 p-4" />,
  };

  const PurchaseSection = ({ className }: { className?: string }) => (
    <div className={cx('p-3 pt-4 space-y-4 border-t border-normal lg:bg-page bg-bar backdrop-blur-lg', className)}>
      <div className="grid grid-cols-2 px-1">
        <ByUser label={'Sold by'} user={user} />
        {quantity && type ? <Price amount={formatWeiToNumber(quantity)} type={type} rate={ETHUSD} /> : null}
      </div>
      <button
        className="max-h-12 w-full inline-flex items-center font-medium focusring will-change-transform btn-primary active:scale-[0.98] shadow-button disabled:shadow-none hover:opacity-90 text-lg h-12 px-6 justify-center rounded-button transition duration-[100ms] ease-out"
        onClick={connection ? (isAddressSame(address, user) ? handleCancel : handleBuy) : redirectLogin}
      >
        {connection ? (isAddressSame(address, user) ? 'Cancel Listing' : 'Buy Now') : 'Connect to Buy'}
      </button>
    </div>
  );

  return (
    <>
      <Head>
        <title>{page_title}</title>
        <meta name="description" content="Description goes here" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <LayoutDefault>
        <div className="flex-1 flex overflow-auto">
          <ImgDesktop />
          <div
            className={`border-normal flex flex-shrink-0 flex-col w-full lg:mt-0 lg:w-[512px] lg:border-l h-[calc(${availHeight}-4rem)]`}
          >
            <ImgMobile />
            <div className="p-4 space-y-6 lg:p-8">
              <h1 className="text-4xl font-bold text-center lg:text-left lg:mt-16">{name}</h1>
              <ByUser label={'Owned By'} user={user} />
            </div>
            <TabGroup
              selectedIndex={selectedIndex}
              onChange={handleTabChange}
              tabDetails={tabDetails}
              className="flex-1"
              tabListClassName="lg:justify-start lg:pl-8"
            />
            {activeOrder ? <PurchaseSection className="hidden lg:block" /> : null}
          </div>
        </div>
        {activeOrder ? <PurchaseSection className="lg:hidden block" /> : null}
      </LayoutDefault>
    </>
  );
};

export default AssetPage;

interface Params extends ParsedUrlQuery {
  tokenId: string;
}

export const getServerSideProps: GetServerSideProps<AssetPageProps, Params> = async ({ params }) => {
  const { tokenId } = params!;
  const assetResponse = await getAsset(tokenId);
  const activeOrderResponse = await getActiveOrder(tokenId);

  return {
    props: { tokenId, asset: assetResponse, activeOrder: activeOrderResponse || null },
  };
};
