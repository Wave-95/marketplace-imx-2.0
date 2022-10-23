import { token_address } from '@/constants/configs';
import { formatWeiToNumber } from '@/helpers/formatters';
import { client } from 'lib/imx';
import numeral from 'numeral';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
dayjs.extend(relativeTime);
import { useEffect, useState } from 'react';
import Table from '.';
import { Trade } from '@imtbl/core-sdk';
import Link from 'next/link';
import Image from 'next/image';
import Skeleton from '../Skeleton';

const MarketplaceActivityTable = () => {
  const [trades, setTrades] = useState<Trade[]>([]);
  const [tableData, setTableData] = useState<any[][]>([[]]);

  useEffect(() => {
    client
      .listTrades({ partyBTokenAddress: token_address, orderBy: 'created_at', direction: 'desc' })
      .then(({ result }) => setTrades(result));
  }, []);

  async function fetchAndSetTableData() {
    const tableDataPromises = trades.map(async (trade) => {
      let asset;
      const {
        a: { sold, token_type },
        b: { token_id },
        transaction_id,
        timestamp,
      } = trade;
      if (token_id) {
        asset = await client.getAsset({ tokenId: token_id, tokenAddress: token_address });
        console.log(asset);
      }
      const imageAsset = asset?.image_url ? (
        <Image src={asset?.image_url} width={60} height={80}></Image>
      ) : (
        <Skeleton className="w-10 h-10" />
      );
      const itemLink = (
        <Link href={`/assets/${token_id}`} passHref>
          <a className="hover:text-accent" target="_blank" rel="noreferrer">
            {token_id}
          </a>
        </Link>
      );
      const time = dayjs(timestamp).fromNow();
      const amount = `${numeral(formatWeiToNumber(sold)).format('0[.]0[00000]a')} ETH`;

      return [imageAsset, asset?.name, 'Trade', itemLink, time, amount];
    });
    const tableDataResults = await Promise.all(tableDataPromises);
    setTableData(tableDataResults);
  }

  useEffect(() => {
    fetchAndSetTableData();
  }, [trades]);

  const tableHeaders = ['Image', 'Name', 'Transaction Type', 'Token ID', 'Time', 'Amount'];

  return trades.length ? <Table tableHeaders={tableHeaders} tableData={tableData} /> : null;
};

export default MarketplaceActivityTable;
