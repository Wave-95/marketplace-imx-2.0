import React, { useState } from 'react';
import cx from 'classnames';
import TextField from './TextField';
import { useUser } from '../providers';
import { UserContextType } from '@/providers/UserProvider';
import { isAddressSame, refreshData } from '../helpers';
import { client } from '@/helpers/imx';
import { toast } from 'react-toastify';
import { token_address } from '@/constants/configs';
import { TokenAmount } from '@imtbl/core-sdk';
import web3 from 'web3';
import { useRouter } from 'next/router';

type SellProps = {
  tokenId: string;
  className?: string;
  owner: string;
};
const Sell: React.FC<SellProps> = ({ tokenId, owner, ...props }) => {
  const {
    state: { address, connection },
  } = useUser() as UserContextType;
  const [amount, setAmount] = useState('');
  const router = useRouter();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setAmount(e.target.value);
  };

  const handleList = (amount: string) => async () => {
    const amountWei = web3.utils.toWei(amount);
    if (connection) {
      await client.createOrder(connection, {
        buy: { type: 'ETH', amount: amountWei },
        sell: { type: 'ERC721', tokenId, tokenAddress: token_address },
      });
      refreshData(router);
    } else {
      toast.error('Please make sure your wallet is connected.');
    }
  };

  return (
    <div {...props}>
      <div className="mb-4 mt-4 font-semibold text-lg">Sell</div>
      <div>
        <TextField label="Price" value={amount} onChange={handleChange} disabled={!isAddressSame(address, owner)} />
      </div>
      <button className="btn-primary w-full h-12 max-h-12 mt-4 font-medium text-lg" onClick={handleList(amount)}>
        List Asset
      </button>
    </div>
  );
};

export default Sell;
