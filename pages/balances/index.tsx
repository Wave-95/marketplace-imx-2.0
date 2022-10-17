import ConnectWalletButton from '@/components/Buttons/ConnectWalletButton';
import PrimaryButton from '@/components/Buttons/PrimaryButton';
import SecondaryButton from '@/components/Buttons/SecondaryButton';
import Centered from '@/components/Containers/Centered';
import DepositDialog from '@/components/Dialogs/DepositDialog';
import WithdrawDialog from '@/components/Dialogs/WithdrawDialog';
import LayoutDefault from '@/components/LayoutDefault';
import UserHeader from '@/components/modules/UserHeader';
import TabGroup from '@/components/TabGroup';
import { formatWeiToNumber, toLocalTime } from '@/helpers/formatters';
import { client } from '@/helpers/imx';
import { useUser } from '@/providers/UserProvider';
import Head from 'next/head';
import numeral from 'numeral';
import React, { useEffect, useState } from 'react';
import { Page } from 'types/page';

const BalancesPage: Page = () => {
  const {
    state: {
      address,
      balances: { l2: l2Balances },
      deposits,
      withdrawals,
    },
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

  const DepositsTable = () => {
    if (!deposits) {
      return null;
    }
    const filteredDeposits = deposits.filter(({ token }) => token.type === 'ETH' || token.type === 'ERC20');
    const tableDataJSX = filteredDeposits.map(({ status, token, timestamp }, idx) => {
      const amount = token?.data?.quantity;
      const amountFormatted = numeral(formatWeiToNumber(amount)).format('0[.]0[000]a');
      const symbol = token?.data?.symbol || 'ETH';

      return (
        <tr className="border border-normal" key={`balance-tr-${idx}`}>
          <td className="px-4 py-2">{symbol}</td>
          <td className="px-4 py-2 text-sm">{amountFormatted}</td>
          <td className="px-4 py-2 text-sm">{toLocalTime(timestamp)}</td>
          <td className="px-4 py-2 text-sm capitalize">{status}</td>
        </tr>
      );
    });
    return (
      <table className="table-fixed w-full border-collapse">
        <thead className="bg-table-header text-left h-[50px] border border-normal">
          <tr>
            <th className="px-4 py-2 text-sm text-secondary font-semibold">{'Asset'}</th>
            <th className="px-4 py-2 text-sm text-secondary font-semibold">{'Amount'}</th>
            <th className="px-4 py-2 text-sm text-secondary font-semibold">{'Date'}</th>
            <th className="px-4 py-2 text-sm text-secondary font-semibold">{'Status'}</th>
          </tr>
        </thead>
        <tbody>{tableDataJSX}</tbody>
      </table>
    );
  };

  const WithdrawalsTable = () => {
    if (!withdrawals) {
      return null;
    }
    const filteredWithdrawals = withdrawals.filter(({ token }) => token.type === 'ETH' || token.type === 'ERC20');
    const tableDataJSX = filteredWithdrawals.map(({ rollup_status, token, timestamp }, idx) => {
      const amount = token?.data?.quantity;
      const amountFormatted = numeral(formatWeiToNumber(amount)).format('0[.]0[000]a');
      const symbol = token?.data?.symbol || 'ETH';

      return (
        <tr className="border border-normal" key={`balance-tr-${idx}`}>
          <td className="px-4 py-2">{symbol}</td>
          <td className="px-4 py-2 text-sm">{amountFormatted}</td>
          <td className="px-4 py-2 text-sm">{toLocalTime(timestamp)}</td>
          <td className="px-4 py-2 text-sm capitalize">{rollup_status}</td>
        </tr>
      );
    });
    return (
      <table className="table-fixed w-full border-collapse">
        <thead className="bg-table-header text-left h-[50px] border border-normal">
          <tr>
            <th className="px-4 py-2 text-sm text-secondary font-semibold">{'Asset'}</th>
            <th className="px-4 py-2 text-sm text-secondary font-semibold">{'Amount'}</th>
            <th className="px-4 py-2 text-sm text-secondary font-semibold">{'Date'}</th>
            <th className="px-4 py-2 text-sm text-secondary font-semibold">{'Status'}</th>
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
