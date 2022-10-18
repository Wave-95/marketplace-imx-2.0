import ConnectWalletButton from '@/components/Buttons/ConnectWalletButton';
import PrimaryButton from '@/components/Buttons/PrimaryButton';
import SecondaryButton from '@/components/Buttons/SecondaryButton';
import Centered from '@/components/Containers/Centered';
import DepositDialog from '@/components/Dialogs/DepositDialog';
import WithdrawDialog from '@/components/Dialogs/WithdrawDialog';
import LayoutDefault from '@/components/LayoutDefault';
import UserHeader from '@/components/modules/UserHeader';
import TabGroup from '@/components/TabGroup';
import BalancesTable from '@/components/Tables/BalancesTable';
import DepositsTable from '@/components/Tables/DepositsTable';
import WithdrawalsTable from '@/components/Tables/WithdrawalsTable';
import { client } from '@/helpers/imx';
import { useUser } from '@/providers/UserProvider';
import Head from 'next/head';
import React, { useEffect, useState } from 'react';
import { Page } from 'types/page';

const BalancesPage: Page = () => {
  const {
    state: { address },
    dispatch,
  } = useUser();
  const [depositDialogOpen, setDepositDialogOpen] = useState(false);
  const [withdrawDialogOpen, setWithdrawDialogOpen] = useState(false);

  useEffect(() => {
    if (address) {
      client
        .listDeposits({ user: address, orderBy: 'created_at' })
        .then(({ result }) => dispatch({ type: 'set_deposits', payload: result }));

      client
        .listWithdrawals({ user: address, orderBy: 'created_at' })
        .then(({ result }) => dispatch({ type: 'set_withdrawals', payload: result }));
    }
  }, [address]);

  const DepositWithdrawGroup = () => {
    return (
      <div className="space-x-4 lg:pr-8 pr-6 flex justify-end mb-8">
        <PrimaryButton className="lg:max-h-12 lg:h-12 font-semibold" onClick={() => setDepositDialogOpen(true)}>
          {'Deposit'}
        </PrimaryButton>
        <SecondaryButton className="lg:max-h-12 lg:h-12 font-semibold" onClick={() => setWithdrawDialogOpen(true)}>
          {'Withdraw'}
        </SecondaryButton>
      </div>
    );
  };

  const tabMapping = {
    Balances: (
      <div className="lg:p-8 p-6">
        <BalancesTable />
      </div>
    ),
    Deposits: (
      <div className="lg:p-8 p-6">
        <DepositsTable />
      </div>
    ),
    Withdrawals: (
      <div className="lg:p-8 p-6">
        <WithdrawalsTable />
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
          <WithdrawDialog isOpen={withdrawDialogOpen} closeDialog={() => setWithdrawDialogOpen(false)} />
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
