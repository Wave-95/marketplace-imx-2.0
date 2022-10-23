import React, { useState } from 'react';
import cx from 'classnames';
import TextField from '../TextField';
import { useAsset, useUser } from '@/providers';
import { isSameAddress } from '../../helpers';
import { toast } from 'react-toastify';
import { client, getAsset } from 'lib/imx';
import { token_address } from '@/constants/configs';
import { AlertTriangle } from 'react-feather';
import Loading from '../Loading';
import PrimaryButton from '../Buttons/PrimaryButton';

const AssetTransfer = ({ ...props }) => {
  const {
    state: { address, connection },
  } = useUser();
  const {
    state: { asset },
    dispatch,
  } = useAsset();
  const { token_id, user } = asset || {};
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
    if (!token_id) {
      return toast.error('Something went wrong.');
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
      <h2 className="mt-4 font-semibold text-lg">{'Transfer'}</h2>
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
      <PrimaryButton
        disabled={!isSameAddress(address, user)}
        className="w-full h-12 max-h-12 mt-4 font-medium text-lg"
        onClick={handleTransfer}
      >
        {loading ? <Loading /> : 'Transfer Asset'}
      </PrimaryButton>
    </div>
  );
};

export default AssetTransfer;
