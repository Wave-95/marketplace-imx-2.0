import { UserContextType, useUser } from '@/providers/UserProvider';
import Link from 'next/link';
import React from 'react';
import { Briefcase, ChevronDown, Copy, Power } from 'react-feather';
import { toast } from 'react-toastify';
import { MetamaskIcon, WalletConnectIcon } from '../Icons';
import MenuItem from './MenuItem';
import BaseMenu from './BaseMenu';
import { formatAddressEllipse } from '@/helpers/formatters';

export default function UserMenu({ ...props }) {
  const {
    state: { address, connection },
    dispatch,
  } = useUser() as UserContextType;
  const walletConnection = connection as any;
  const walletProvider = walletConnection?.ethSigner?.provider?.connection?.url;
  let WalletProviderIcon;

  switch (walletProvider) {
    case 'metamask':
      WalletProviderIcon = <MetamaskIcon />;
      break;
    case 'walletConnect':
      WalletProviderIcon = <WalletConnectIcon />;
      break;
    default:
      WalletProviderIcon = null;
      break;
  }

  const handleCopyAddress = () => {
    navigator.clipboard.writeText(address as string);
    toast.success('Address copied.');
  };

  const handleDisconnect = () => {
    dispatch({ type: 'disconnect' });
  };

  const MenuButtonChild = (
    <div className="btn-secondary h-10 flex space-x-1 lg:space-x-2 items-center justify-start pr-2">
      {WalletProviderIcon}
      <div className="flex items-center">
        <span className="hidden lg:inline text-xs lg:text-base">{formatAddressEllipse(address)}</span>
      </div>
      <ChevronDown size={15} />
    </div>
  );

  const CopyAddress = (
    <MenuItem icon={<Copy size={20} />} onClick={handleCopyAddress}>
      <span>{formatAddressEllipse(address)}</span>
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
