import ConnectWallet from '@/components/Buttons/ConnectWallet';
import Centered from '@/components/Containers/Centered';
import DepositDialog from '@/components/Dialogs/DepositDialog';
import LayoutDefault from '@/components/LayoutDefault';
import UserHeader from '@/components/modules/UserHeader';
import TabGroup from '@/components/TabGroup';
import { formatWeiToNumber } from '@/helpers/formatters';
import { UserContextType, useUser } from '@/providers/UserProvider';
import Head from 'next/head';
import numeral from 'numeral';
import React, { useState } from 'react';

type BalancesPageProps = {};

const BalancesPage: React.FC<BalancesPageProps> = () => {
  const {
    state: {
      address,
      balances: { l2: l2Balances },
    },
  } = useUser() as UserContextType;
  const [depositDialogOpen, setDepositDialogOpen] = useState(false);
  const [withdrawDialogOpen, setWithdrawDialogOpen] = useState(false);

  const DepositWithdrawGroup = () => {
    return (
      <div className="space-x-4 lg:pr-8 pr-6 flex justify-end mb-8">
        <button className="btn-primary text-center h-12 font-semibold" onClick={() => setDepositDialogOpen(true)}>
          Deposit
        </button>
        <button className="btn-secondary text-center h-12 font-semibold" onClick={() => setWithdrawDialogOpen(true)}>
          Withdraw
        </button>
      </div>
    );
  };

  const BalancesTable = () => {
    const tableDataJSX = Object.entries(l2Balances).map(([symbol, data]) => {
      const balance = data?.balance || '0';
      const balanceFormatted = numeral(formatWeiToNumber(balance)).format('0[.]0[00]a');
      return (
        <tr className="border border-normal">
          <td className="px-4 py-2">{symbol}</td>
          <td className="px-4 py-2 text-sm">{balanceFormatted}</td>
        </tr>
      );
    });
    return (
      <table className="table-fixed w-full border-collapse">
        <thead className="bg-table-header text-left h-[50px] border border-normal">
          <tr>
            <th className="px-4 py-2 text-sm text-secondary font-semibold">Asset</th>
            <th className="px-4 py-2 text-sm text-secondary font-semibold">Balance</th>
          </tr>
        </thead>
        <tbody>{tableDataJSX}</tbody>
      </table>
    );
  };

  const tabMapping = {
    Balances: (
      <div className="lg:p-8 p-6">
        <BalancesTable />
      </div>
    ),
    Deposits: <div></div>,
    Withdrawals: <div></div>,
  };

  const page_title = `Balances | ${address || ''}`;

  return (
    <>
      <Head>
        <title>{page_title}</title>
        <meta name="description" content="Description goes here" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <LayoutDefault>
        <div>
          {address ? (
            <>
              <UserHeader address={address} showLink={false} />
              <DepositWithdrawGroup />
              <TabGroup tabMapping={tabMapping} tabListClassName="!justify-start lg:pl-8 pl-6" />
              <DepositDialog isOpen={depositDialogOpen} closeDialog={() => setDepositDialogOpen(false)} />
            </>
          ) : (
            <Centered className="min-h-[90vh]">
              <ConnectWallet />
            </Centered>
          )}
        </div>
      </LayoutDefault>
    </>
  );
};

export default BalancesPage;
