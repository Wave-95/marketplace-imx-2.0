import ByUser from '@/components/ByUser';
import LayoutDefault from '@/components/LayoutDefault';
import Metadata from '@/components/modules/Metadata';
import TabGroup from '@/components/TabGroup';
import { getActiveOrder, getAsset } from '@/helpers/imx';
import { DimensionContextType, useDimension } from '@/providers/DimensionProvider';
import { UserContextType, useUser } from '@/providers/UserProvider';
import { GetServerSideProps } from 'next';
import Head from 'next/head';
import Image from 'next/image';
import { ParsedUrlQuery } from 'querystring';
import React, { FormEventHandler, useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import Transfer from '@/components/modules/Transfer';
import { isSameAddress } from '@/helpers/index';
import List from '@/components/modules/List';
import OrderModule from '@/components/modules/Order';
import { AssetContextType, useAsset } from '@/providers/AssetProvider';
import { OrderContextType, useOrder } from '@/providers/OrderProvider';

type AssetPageProps = {
  tokenId: string;
};

const AssetPage: React.FC<AssetPageProps> = ({ tokenId }) => {
  const {
    state: { availHeight },
  } = useDimension() as DimensionContextType;
  const {
    state: { address },
  } = useUser() as UserContextType;
  const {
    state: { asset },
    dispatch: dispatchAsset,
  } = useAsset() as AssetContextType;
  const {
    state: { order },
    dispatch: dispatchOrder,
  } = useOrder() as OrderContextType;
  const { image_url, metadata, name, user } = asset;
  const router = useRouter();
  const { query } = router;
  const page_title = `Asset | ${name}`;

  const [selectedIndex, setSelectedIndex] = useState(0);
  const showOrder = order && selectedIndex === 0;
  const showList = isSameAddress(address, user) && !order;

  useEffect(() => {
    //Gets current tab selection from url query params and sets it
    const { tab } = query;
    const index = typeof tab === 'string' ? Number(tab) : 0;
    setSelectedIndex(index);
  }, [query]);

  useEffect(() => {
    getAsset(tokenId).then((data) => dispatchAsset({ type: 'set_asset', payload: data }));
  }, [tokenId]);

  useEffect(() => {
    getActiveOrder(tokenId).then((data) => dispatchOrder({ type: 'set_order', payload: data }));
  }, [tokenId]);

  const handleTabChange: FormEventHandler<HTMLDivElement> & ((index: number) => void) = (index) => {
    router.replace({ pathname: `/assets/${tokenId}`, query: { tab: index.toString() } }, undefined, { shallow: true });
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
      {showList ? <List asset={asset} className="lg:px-8 p-4" /> : null}
    </div>
  );

  const tabDetails = {
    Details: <Details />,
    History: <div></div>,
    Transfer: <Transfer tokenId={tokenId} owner={user} className="lg:px-8 p-4" />,
  };

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
            {showOrder && <OrderModule className="hidden lg:block" order={order} />}
          </div>
        </div>
        {showOrder && <OrderModule className="lg:hidden block" order={order} />}
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

  return {
    props: { tokenId },
  };
};
