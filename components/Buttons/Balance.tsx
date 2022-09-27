import { UserContextType, useUser } from '@/providers/UserProvider';
import { formatCurrency } from '@/utils/index';
import Link from 'next/link';
import React, { useEffect, useState } from 'react';
import { EthIcon } from '../Icons';

const Balance: React.FC = ({ ...props }) => {
  const {
    state: { address },
  } = useUser() as UserContextType;

  const [balanceETH, setBalanceETH] = useState('0');

  useEffect(() => {
    //TODO: Get balance and set ETH balance
  }, [address]);

  if (!address) return null;

  return (
    <div className="flex items-stretch justify-between h-10 border rounded-button border-normal" {...props}>
      <div className="flex items-center justify-center px-4 pr-0 space-x-2">
        <span>{formatCurrency(balanceETH)}</span>
        <EthIcon />
        <Link href="/balances">
          <a>
            <button className="btn-secondary">Balances</button>
          </a>
        </Link>
      </div>
    </div>
  );
};

export default Balance;
