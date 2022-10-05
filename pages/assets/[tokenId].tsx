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
import AssetTransfer from '@/components/modules/AssetTransfer';
import { isSameAddress } from '@/helpers/index';
import List from '@/components/modules/List';
import OrderModule from '@/components/modules/Order';
import { AssetContextType, useAsset } from '@/providers/AssetProvider';
import { OrderContextType, useOrder } from '@/providers/OrderProvider';
import { toast } from 'react-toastify';
import { Heart, Link } from 'react-feather';
import { collection_name } from '@/constants/configs';
import Skeleton from '@/components/Skeleton';

interface AssetPageProps extends ParsedUrlQuery {
  tokenId: string;
  tab?: string;
}

const AssetPage: React.FC<AssetPageProps> = ({ tokenId, tab }) => {
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
  const page_title = `Asset | ${name || collection_name}`;

  const [selectedIndex, setSelectedIndex] = useState(Number(tab));
  const showOrder = order && selectedIndex !== 2;
  const showList = isSameAddress(address, user) && !order;

  useEffect(() => {
    dispatchAsset({ type: 'clear_asset' });
    getAsset(tokenId).then((data) => dispatchAsset({ type: 'set_asset', payload: data }));
  }, [tokenId]);

  useEffect(() => {
    getActiveOrder(tokenId).then((data) => dispatchOrder({ type: 'set_order', payload: data }));
  }, [tokenId]);

  const handleTabChange: FormEventHandler<HTMLDivElement> & ((index: number) => void) = (index) => {
    if (typeof index === 'number') {
      setSelectedIndex(index);
      router.replace({ pathname: `/assets/${tokenId}`, query: { tab: index.toString() } }, undefined, { shallow: true });
    }
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(address as string);
    toast.success('Link copied!');
  };

  const handleFavorite = () => {
    //TODO: Custom code here
  };

  const AssetImage = ({ className }: { className?: string }) => (
    <div className={className}>
      {image_url ? (
        <div className="min-w-[200px] min-h-[300px] lg:min-w-[400px] lg:min-h-[500px] relative mt-16">
          <Image
            src={image_url}
            alt={`img-token-${tokenId}`}
            quality={100}
            objectFit="contain"
            objectPosition="center"
            layout="fill"
            priority
          />
        </div>
      ) : (
        <Skeleton className="w-[200px] h-[300px] lg:w-[300px] lg:h-[500px] rounded-lg mt-16" />
      )}
    </div>
  );

  //Choose which metadata keys and in which order to display to user
  const metadataToDisplay = ['set', 'type', 'rarity', 'god', 'tribe', 'attack', 'health', 'mana'] as keyof typeof metadata;

  const Details = () => (
    <>
      <div className="lg:px-8 p-4">
        <div className="mb-4 mt-4 font-semibold text-lg">Description</div>
        <p className="text-secondary text-sm">
          Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut
          enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
        </p>
      </div>
      {metadata ? <Metadata keys={metadataToDisplay} metadata={metadata} className="lg:px-8 p-4" /> : null}
      {showList ? <List className="lg:px-8 p-4" /> : null}
    </>
  );

  const tabDetails = {
    Details: <Details />,
    History: <div></div>,
    Transfer: <AssetTransfer className="lg:px-8 p-4" />,
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
          <AssetImage className="flex-1 hidden lg:flex justify-center items-center" />
          <div
            className={`relative border-normal flex flex-shrink-0 flex-col w-full lg:mt-0 lg:w-[512px] lg:border-l h-[calc(${availHeight}-4rem)] overflow-auto`}
          >
            <div className="absolute top-8 right-8">
              <div className="flex items-center space-x-4">
                <div className="btn-secondary p-2 cursor-pointer" onClick={handleFavorite}>
                  <Heart size={20} />
                </div>
                <div className="btn-secondary p-2 cursor-pointer" onClick={handleCopyLink}>
                  <Link size={20} />
                </div>
              </div>
            </div>
            <AssetImage className="lg:hidden flex justify-center items-center" />
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
  tab?: string;
}

export const getServerSideProps: GetServerSideProps<AssetPageProps, Params> = async ({ params, query }) => {
  const { tokenId } = params!;
  let { tab = '0' } = query;
  if (Array.isArray(tab)) {
    tab = tab.pop() || '0';
  }
  return {
    props: { tokenId, tab },
  };
};
