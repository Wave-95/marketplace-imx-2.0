import React, { useState } from 'react';
import cx from 'classnames';
import TextField from '../TextField';
import { useUser } from '../../providers';
import { UserContextType } from '@/providers/UserProvider';
import { isSameAddress, refreshData } from '../../helpers';
import { toast } from 'react-toastify';
import { client } from '@/helpers/imx';
import { token_address } from '@/constants/configs';
import { useRouter } from 'next/router';
import { AlertTriangle } from 'react-feather';

type AssetTransferProps = {
  tokenId: string;
  className?: string;
  owner: string;
};
const AssetTransfer: React.FC<AssetTransferProps> = ({ tokenId, owner, ...props }) => {
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

  const TransferWarning = () => (
    <div className={cx('space-x-2 flex items-center mt-2', { hidden: address && isSameAddress(address, owner) })}>
      <AlertTriangle size={15} />
      <span className="text-sm">
        {address
          ? 'You must own this asset to transfer it.'
          : 'Please connect your wallet to see if you own this asset.'}
      </span>
    </div>
  );

  return (
    <div {...props}>
      <div className="mt-4 font-semibold text-lg">Transfer</div>
      <TransferWarning />
      <div>
        <TextField
          label="Recipient ETH address"
          value={recipientAddress}
          onChange={handleChange}
          disabled={!isSameAddress(address, owner)}
          className="mt-4"
        />
      </div>
      <button
        disabled={!isSameAddress(address, owner)}
        className="btn-primary w-full h-12 max-h-12 mt-4 font-medium text-lg"
        onClick={handleTransfer}
      >
        Transfer Asset
      </button>
    </div>
  );
};

export default AssetTransfer;
