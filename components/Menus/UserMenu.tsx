import { UserContextType, useUser } from '@/providers/UserProvider';
import { ellipse } from '@/utils/index';
import Link from 'next/link';
import React from 'react';
import { Briefcase, Copy, Disc, Power } from 'react-feather';
import { toast } from 'react-toastify';
import IconButton from '../Buttons/IconButton';
import { MetamaskIcon, WalletConnectIcon } from '../Icons';
import MenuItem from '../MenuItem';
import BaseMenu from './BaseMenu';

export default function UserMenu({ ...props }) {
  const {
    state: { address, connection },
    dispatch,
  } = useUser() as UserContextType;
  const walletConnection = connection as any;
  const walletProvider = walletConnection?.l1Signer?.provider?.connection?.url;
  const WalletProviderIcon = walletProvider === 'metamask' ? <MetamaskIcon /> : <WalletConnectIcon />;

  const handleCopyAddress = () => {
    navigator.clipboard.writeText(address as string);
    toast.success('Address copied.');
  };

  const handleDisconnect = () => {
    dispatch({ type: 'disconnect' });
  };

  const MenuButtonChild = (
    <div className="btn-secondary h-10 flex space-x-2 items-center justify-start">
      {WalletProviderIcon}
      <span>{ellipse(address)}</span>
    </div>
  );

  const CopyAddress = (
    <MenuItem icon={<Copy size={20} />} onClick={handleCopyAddress}>
      <span>{ellipse(address)}</span>
    </MenuItem>
  );

  const MyAssets = (
    <MenuItem icon={<Briefcase size={20} />}>
      <Link href={`/users/${address}`}>
        <a>My Assets</a>
      </Link>
    </MenuItem>
  );

  const Disconnect = (
    <MenuItem icon={<Power size={20} />} onClick={handleDisconnect}>
      <span>Disconnect</span>
    </MenuItem>
  );

  const MenuItems = [CopyAddress, MyAssets, Disconnect];

  return <BaseMenu buttonChild={MenuButtonChild} menuItems={MenuItems} {...props} />;
}
