import Head from 'next/head';
import { collection_name } from '@/constants/configs';
import LayoutDefault from '@/components/LayoutDefault';
import TestDiv from '@/components/TestDiv';

export default function Marketplace() {
  const page_title = `Marketplace | ${collection_name}`;
  return (
    <>
      <Head>
        <title>{page_title}</title>
        <meta name="description" content="Description goes here" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <LayoutDefault>
        <div className="h-headerless overflow-scroll lg:h-auto lg:overflow-auto">
          <TestDiv />
          <TestDiv />
          <TestDiv />
          <TestDiv />
          <TestDiv />
          <TestDiv />
          <TestDiv />
          <TestDiv />
          <TestDiv />
          <TestDiv />
          <TestDiv />
          <TestDiv />
          <TestDiv />
          <TestDiv />
          <TestDiv />
          <TestDiv />
          <TestDiv />
        </div>
      </LayoutDefault>
    </>
  );
}
