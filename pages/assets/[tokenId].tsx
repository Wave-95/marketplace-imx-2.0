import ByUser from '@/components/ByUser';
import LayoutDefault from '@/components/LayoutDefault';
import Metadata from '@/components/modules/Metadata';
import TabGroup from '@/components/TabGroup';
import { getActiveOrder, getAsset } from 'lib/imx';
import { useUser } from '@/providers/UserProvider';
import { GetServerSideProps } from 'next';
import Head from 'next/head';
import Image from 'next/image';
import { ParsedUrlQuery } from 'querystring';
import React, { FormEventHandler, useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import AssetTransfer from '@/components/modules/AssetTransfer';
import { isSameAddress } from '@/utils';
import List from '@/components/modules/List';
import OrderModule from '@/components/modules/Order';
import { useAsset } from '@/providers/AssetProvider';
import { useOrder } from '@/providers/OrderProvider';
import { toast } from 'react-toastify';
import { Heart, Link } from 'react-feather';
import { base_path, collection_name } from '@/constants/configs';
import Skeleton from '@/components/Skeleton';
import AssetHistory from '@/components/modules/AssetHistory';
import BackButton from '@/components/Buttons/BackButton';
import { Page } from 'types/page';
import SecondaryButton from '@/components/Buttons/SecondaryButton';

type Props = {
  tokenId: string;
  tab?: string;
  referer?: string;
};

const AssetPage: Page<Props> = ({ tokenId, tab, referer }) => {
  const {
    state: { address },
  } = useUser();
  const {
    state: { asset },
    dispatch: dispatchAsset,
  } = useAsset();
  const {
    state: { order },
    dispatch: dispatchOrder,
  } = useOrder();
  const { image_url, metadata, name, user } = asset || {};
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
    navigator.clipboard.writeText(`${base_path}${router.asPath}`);
    toast.success('Link copied!');
  };

  const handleFavorite = () => {
    //TODO: Custom code here
  };

  const AssetImage = () =>
    image_url ? (
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
    );

  //Choose which metadata keys and in which order to display to user
  const metadataToDisplay = ['set', 'type', 'rarity', 'god', 'tribe', 'attack', 'health', 'mana'] as keyof typeof metadata;

  const Details = () => (
    <>
      <div className="lg:px-8 p-4">
        <h2 className="mb-4 mt-4 font-semibold text-lg">{'Description'}</h2>
        <p className="text-secondary text-sm">
          {`Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut
          enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.`}
        </p>
      </div>
      <Metadata keys={metadataToDisplay} metadata={metadata} className="lg:px-8 p-4" />
      {showList ? <List className="lg:px-8 p-4" /> : null}
    </>
  );

  const tabMapping = {
    Details: <Details />,
    History: <AssetHistory className="lg:px-8 p-4" />,
    Transfer: <AssetTransfer className="lg:px-8 p-4" />,
  };

  return (
    <>
      <Head>
        <title>{page_title}</title>
        <meta name="description" content="Description goes here" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div className="flex-1 flex overflow-auto relative">
        <BackButton referer={referer} className="left-8 z-[10] absolute top-8 hidden lg:block" />
        <div className="hidden lg:flex flex-1 justify-center items-center h-headerless">
          <AssetImage />
        </div>
        <div className={`relative border-normal flex flex-shrink-0 flex-col w-full lg:mt-0 lg:w-[512px] lg:border-l overflow-auto`}>
          <div className="absolute top-8 right-8">
            <div className="flex items-center space-x-4">
              <SecondaryButton className="px-2 py-2" onClick={handleFavorite}>
                <Heart size={20} />
              </SecondaryButton>
              <SecondaryButton className="px-2 py-2" onClick={handleCopyLink}>
                <Link size={20} />
              </SecondaryButton>
            </div>
          </div>
          <BackButton referer={referer} className="left-8 z-[10] absolute top-8 lg:hidden" />
          <div className="lg:hidden flex justify-center items-center">
            <AssetImage />
          </div>
          <div className="p-4 space-y-6 lg:p-8">
            <h1 className="text-4xl font-bold text-center lg:text-left lg:mt-16">{name}</h1>
            <ByUser label={'Owned By'} user={user} />
          </div>
          <TabGroup
            selectedIndex={selectedIndex}
            onChange={handleTabChange}
            tabMapping={tabMapping}
            className="flex-1"
            tabListClassName="lg:justify-start lg:pl-8"
          />
          {showOrder && <OrderModule className="hidden lg:block" order={order} />}
        </div>
      </div>
      {showOrder && <OrderModule className="lg:hidden block" order={order} />}
    </>
  );
};

export default AssetPage;

AssetPage.getLayout = (page: React.ReactNode) => {
  return <LayoutDefault>{page}</LayoutDefault>;
};

type Params = ParsedUrlQuery & {
  tokenId: string;
  tab?: string;
};

export const getServerSideProps: GetServerSideProps<Props, Params> = async ({ params, query, req }) => {
  const referer = req.headers.referer || '/';

  const { tokenId } = params!;
  let { tab = '0' } = query;
  if (Array.isArray(tab)) {
    tab = tab.pop() || '0';
  }
  return {
    props: { tokenId, tab, referer },
  };
};
