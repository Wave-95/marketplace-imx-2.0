import React, { useState } from 'react';
import TextField from './TextField';
import { useUser } from '../providers';
import { UserContextType } from '@/providers/UserProvider';
import { isAddressSame, refreshData } from '../helpers';
import { toast } from 'react-toastify';
import { client } from '@/helpers/imx';
import { token_address } from '@/constants/configs';
import { useRouter } from 'next/router';

type TransferProps = {
  tokenId: string;
  className?: string;
  owner: string;
};
const Transfer: React.FC<TransferProps> = ({ tokenId, owner, ...props }) => {
  const {
    state: { address, connection },
  } = useUser() as UserContextType;
  const [recipientAddress, setRecipientAddress] = useState<string | null>(null);
  const router = useRouter();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setRecipientAddress(e.target.value);
  };

  const handleTransfer = async () => {
    if (!connection) {
      return toast.error('Please make sure your wallet is connected.');
    }

    if (!recipientAddress) {
      return toast.error('Invalid recipient address.');
    }
    await client.transfer(connection, {
      receiver: recipientAddress,
      tokenId,
      tokenAddress: token_address,
      type: 'ERC721',
    });
    refreshData(router);
  };

  return (
    <div {...props}>
      <div className="mb-4 mt-4 font-semibold text-lg">Transfer</div>
      <div>
        <TextField
          label="Recipient ETH address"
          value={recipientAddress}
          onChange={handleChange}
          disabled={!isAddressSame(address, owner)}
        />
      </div>
      <button className="btn-primary w-full h-12 max-h-12 mt-4 font-medium text-lg" onClick={handleTransfer}>
        Transfer Asset
      </button>
    </div>
  );
};

export default Transfer;
