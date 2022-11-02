import PrimaryButton from '@/components/Buttons/PrimaryButton';
import SecondaryButton from '@/components/Buttons/SecondaryButton';
import SaleCard from '@/components/Cards/ProductCard';
import Centered from '@/components/Containers/Centered';
import LayoutDefault from '@/components/LayoutDefault';
import dayjs from 'dayjs';
import { GetServerSideProps } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { ParsedUrlQuery } from 'querystring';
import { Page } from 'types/page';
import { fetchURL } from '../utils/http';
import { Product } from '@prisma/client';
import Head from 'next/head';

type Props = { upcomingSales: Product[]; ongoingSales: Product[]; endedSales: Product[] };

const Home: Page<Props> = ({ upcomingSales = [], ongoingSales = [], endedSales = [] }) => {
  const Introduction = () => (
    <div className="bg-card-primary-active rounded-lg min-h-[500px] flex items-center mb-12">
      <div className="p-8 lg:p-12 grid grid-cols-1 gap-4 sm:grid-cols-2 md:gap-8 w-full">
        <div className="space-y-2 self-center mb-10">
          <h1 className="font-bold text-2xl">{'Introducing XYZ Marketplace'}</h1>
          <p>{'The one-stop-shop to buy & trade your favorite in-game items.'}</p>
          <div className="space-x-4 flex !mt-8">
            <Link href="/#store">
              <a>
                <PrimaryButton className="!px-6 !py-6 font-semibold">{'Buy Items'}</PrimaryButton>
              </a>
            </Link>
            <Link href="/trade">
              <a>
                <SecondaryButton className="!px-6 !py-6 font-semibold">{'Trade Items'}</SecondaryButton>
              </a>
            </Link>
          </div>
        </div>
        <Centered direction="col" className="space-y-4 hidden md:flex">
          <div className="relative min-h-[400px] min-w-[500px]">
            <Image src={'/handshake.png'} quality={100} objectFit="contain" objectPosition="center" layout="fill" className="rounded-lg" />
          </div>
        </Centered>
      </div>
    </div>
  );

  const Store = () => (
    <div id="store">
      <h1 className="font-bold text-2xl mb-8">XYZ Store</h1>
      {ongoingSales.length ? (
        <>
          <h1 className="font-bold text-xl mb-8">{'Ongoing Sales'}</h1>
          <div className="grid gap-4 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 mb-20">
            {ongoingSales.map((product, idx) => (
              <SaleCard product={product} type="ongoing" key={`product-${idx}`} />
            ))}
          </div>
        </>
      ) : null}

      {upcomingSales.length ? (
        <>
          <h1 className="font-bold text-xl mb-8">{'Upcoming Sales'}</h1>
          <div className="grid gap-4 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 mb-20">
            {upcomingSales.map((product, idx) => (
              <SaleCard product={product} type="upcoming" key={`product-${idx}`} />
            ))}
          </div>
        </>
      ) : null}

      {endedSales.length ? (
        <>
          <h1 className="font-bold text-xl mb-8">{'Past Sales'}</h1>
          <div className="grid gap-4 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 mb-20">
            {endedSales.map((product, idx) => (
              <SaleCard product={product} type="ended" key={`product-${idx}`} />
            ))}
          </div>
        </>
      ) : null}
    </div>
  );

  const page_title = 'Home';

  return (
    <>
      <Head>
        <title>{page_title}</title>
        <meta name="description" content="Log in" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div className="lg:px-6 px-4">
        <Introduction />
        <Store />
      </div>
    </>
  );
};

Home.getLayout = (page: React.ReactNode) => {
  return <LayoutDefault>{page}</LayoutDefault>;
};

export default Home;

export const getServerSideProps: GetServerSideProps<Props, ParsedUrlQuery> = async ({ req }) => {
  const nowUnix = dayjs(Date.now()).valueOf();

  const productsResponse = await fetchURL('products');
  const products = (await productsResponse.json()) as Product[];
  const activeSaleDetails = products.filter(({ active }) => active);

  const upcomingSales = activeSaleDetails.filter(({ sale_start_at }) => sale_start_at && nowUnix < dayjs(sale_start_at).valueOf());
  const ongoingSales = activeSaleDetails.filter(({ sale_start_at, sale_end_at }) => {
    if (sale_start_at === null && sale_end_at === null) {
      return true;
    }

    if (sale_start_at === null && sale_end_at && nowUnix < dayjs(sale_end_at).valueOf()) {
      return true;
    }

    return false;
  });
  const endedSales = activeSaleDetails.filter(({ sale_end_at }) => sale_end_at && nowUnix > dayjs(sale_end_at).valueOf());
  return {
    props: { upcomingSales, ongoingSales, endedSales },
  };
};
