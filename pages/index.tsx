import PrimaryButton from '@/components/Buttons/PrimaryButton';
import SecondaryButton from '@/components/Buttons/SecondaryButton';
import Centered from '@/components/Containers/Centered';
import LayoutDefault from '@/components/LayoutDefault';
import Image from 'next/image';
import Link from 'next/link';

const Home = () => {
  const SampleImage = ({ id }: { id: string }) => (
    <div className="w-[100px] h-[100px] lg:w-[150px] lg:h-[150px] relative dark:bg-gray-100 bg-gray-800 rounded-lg">
      <Image src={`https://rippin-imx-collection-test.s3.us-west-1.amazonaws.com/${id}.png`} layout="fill" objectFit="contain" />
    </div>
  );

  const Introduction = () => (
    <div className="bg-card-primary-active rounded-lg min-h-[500px] flex items-center mb-12">
      <div className="p-8 lg:p-12 grid grid-cols-1 gap-4 sm:grid-cols-2 md:gap-8 w-full">
        <div className="space-y-2 self-center mb-10">
          <h1 className="font-bold text-2xl">{'Introducing XYZ Marketplace'}</h1>
          <p>{'The one-stop-shop to buy & trade your favorite in-game items.'}</p>
          <div className="space-x-4 flex !mt-8">
            <Link href="/#test">
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
    <div id="primary-sales">
      <h1 className="font-bold text-2xl mb-8">Store</h1>
      <div className="grid gap-4 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5">TBD</div>
    </div>
  );

  return (
    <div className="lg:px-6 px-4">
      <Introduction />
      <Store />
    </div>
  );
};

Home.getLayout = (page: React.ReactNode) => {
  return <LayoutDefault>{page}</LayoutDefault>;
};

export default Home;
