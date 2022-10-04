import React, { useEffect } from 'react';
import Link from 'next/link';
import { UserContextType, useUser } from '@/providers/UserProvider';
import { formatBalances, formatCurrency, formatWeiToNumber } from '@/helpers/formatters';
import { EthIcon } from '../Icons';
import { client } from '@/helpers/imx';

const Balance: React.FC = ({ ...props }) => {
  const {
    state: { address, balances },
    dispatch,
  } = useUser() as UserContextType;

  const balanceETH = balances?.ETH?.balance || '0';

  useEffect(() => {
    if (address) {
      client
        .listBalances({ owner: address })
        .then((response) => dispatch({ type: 'set_balances', payload: formatBalances(response.result) }));
    }
  }, [address]);

  if (!address) return null;

  return (
    <div className="flex items-stretch justify-between h-10 border rounded-button border-normal" {...props}>
      <div className="flex items-center justify-center px-4 pr-0 space-x-2">
        <span>{formatCurrency(formatWeiToNumber(balanceETH))}</span>
        <EthIcon />
        <Link href="/balances">
          <a>
            <button className="btn-secondary text-xs lg:text-base h-10">Balances</button>
          </a>
        </Link>
      </div>
    </div>
  );
};

export default Balance;
