import React, { useState } from 'react';
import cx from 'classnames';
import TextField from '../TextField';
import { useAsset, useUser } from '../../providers';
import { UserContextType } from '@/providers/UserProvider';
import { isSameAddress, refreshData } from '../../helpers';
import { toast } from 'react-toastify';
import { client, getAsset } from '@/helpers/imx';
import { token_address } from '@/constants/configs';
import { AlertTriangle } from 'react-feather';
import { AssetContextType } from '@/providers/AssetProvider';
import Loading from '../Loading';

type AssetTransferProps = {
  className?: string;
};
const AssetTransfer: React.FC<AssetTransferProps> = ({ ...props }) => {
  const {
    state: { address, connection },
  } = useUser() as UserContextType;
  const {
    state: {
      asset: { token_id, user },
    },
    dispatch,
  } = useAsset() as AssetContextType;
  const [loading, setLoading] = useState(false);
  const [recipientAddress, setRecipientAddress] = useState<string | null>(null);

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
    setLoading(true);
    try {
      await client.transfer(connection, {
        receiver: recipientAddress,
        tokenId: token_id,
        tokenAddress: token_address,
        type: 'ERC721',
      });
      setTimeout(async () => {
        const newAsset = await getAsset(token_id);
        dispatch({ type: 'set_asset', payload: newAsset });
        setLoading(false);
      }, 2000);
    } catch (e: any) {
      setLoading(false);
      if (e.message.match(/user rejected signing/)) {
        return toast.error('You have rejected the transaction.');
      }
      toast.error('There was an issue transferring the item.');
    }
    setLoading(false);
  };

  const TransferWarning = () => (
    <div className={cx('space-x-2 flex items-center mt-2', { hidden: address && isSameAddress(address, user) })}>
      <AlertTriangle size={15} />
      <span className="text-sm">
        {address ? 'You must own this asset to transfer it.' : 'Please connect your wallet to see if you own this asset.'}
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
          disabled={!isSameAddress(address, user)}
          className="mt-4"
        />
      </div>
      <button
        disabled={!isSameAddress(address, user)}
        className="btn-primary w-full h-12 max-h-12 mt-4 font-medium text-lg flex items-center justify-center"
        onClick={handleTransfer}
      >
        {loading ? <Loading /> : 'Transfer Asset'}
      </button>
    </div>
  );
};

export default AssetTransfer;
