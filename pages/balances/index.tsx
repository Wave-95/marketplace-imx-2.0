import ConnectWalletButton from '@/components/Buttons/ConnectWalletButton';
import PrimaryButton from '@/components/Buttons/PrimaryButton';
import SecondaryButton from '@/components/Buttons/SecondaryButton';
import Centered from '@/components/Containers/Centered';
import DepositDialog from '@/components/Dialogs/DepositDialog';
import LayoutDefault from '@/components/LayoutDefault';
import UserHeader from '@/components/modules/UserHeader';
import TabGroup from '@/components/TabGroup';
import { formatWeiToNumber } from '@/helpers/formatters';
import { useUser } from '@/providers/UserProvider';
import Head from 'next/head';
import numeral from 'numeral';
import React, { useState } from 'react';
import { Page } from 'types/page';

const BalancesPage: Page = () => {
  const {
    state: {
      address,
      balances: { l2: l2Balances },
    },
  } = useUser();
  const [depositDialogOpen, setDepositDialogOpen] = useState(false);
  const [withdrawDialogOpen, setWithdrawDialogOpen] = useState(false);

  const DepositWithdrawGroup = () => {
    return (
      <div className="space-x-4 lg:pr-8 pr-6 flex justify-end mb-8">
        <PrimaryButton className="font-semibold" onClick={() => setDepositDialogOpen(true)}>
          {'Deposit'}
        </PrimaryButton>
        <SecondaryButton className="max-h-12 h-12 font-semibold" onClick={() => setWithdrawDialogOpen(true)}>
          {'Withdraw'}
        </SecondaryButton>
      </div>
    );
  };

  const BalancesTable = () => {
    const tableDataJSX = Object.entries(l2Balances).map(([symbol, data], idx) => {
      const balance = data?.balance || '0';
      const balanceFormatted = numeral(formatWeiToNumber(balance)).format('0[.]0[000]a');
      return (
        <tr className="border border-normal" key={`balance-tr-${idx}`}>
          <td className="px-4 py-2">{symbol}</td>
          <td className="px-4 py-2 text-sm">{balanceFormatted}</td>
        </tr>
      );
    });
    return (
      <table className="table-fixed w-full border-collapse">
        <thead className="bg-table-header text-left h-[50px] border border-normal">
          <tr>
            <th className="px-4 py-2 text-sm text-secondary font-semibold">{'Asset'}</th>
            <th className="px-4 py-2 text-sm text-secondary font-semibold">{'L2 Balance'}</th>
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
  };

  const page_title = `Balances | ${address || ''}`;

  return (
    <>
      <Head>
        <title>{page_title}</title>
        <meta name="description" content="Description goes here" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      {address ? (
        <>
          <UserHeader address={address} showLink={false} />
          <DepositWithdrawGroup />
          <TabGroup tabMapping={tabMapping} tabListClassName="!justify-start lg:pl-8 pl-6" />
          <DepositDialog isOpen={depositDialogOpen} closeDialog={() => setDepositDialogOpen(false)} />
        </>
      ) : (
        <Centered className="min-h-[90vh]">
          <ConnectWalletButton />
        </Centered>
      )}
    </>
  );
};

export default BalancesPage;

BalancesPage.getLayout = (page: React.ReactNode) => {
  return <LayoutDefault>{page}</LayoutDefault>;
};
