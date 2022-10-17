import { useUser } from '@/providers/UserProvider';
import Link from 'next/link';
import React from 'react';
import { Briefcase, ChevronDown, Copy, Power } from 'react-feather';
import { toast } from 'react-toastify';
import { MetamaskIcon, WalletConnectIcon } from '../Icons';
import MenuItem from './MenuItem';
import Menu from '.';
import { formatAddress } from '@/helpers/formatters';
import { useRouter } from 'next/router';
import SecondaryButton from '../Buttons/SecondaryButton';

export default function UserMenu({ ...props }) {
  const {
    state: { address, connection },
    dispatch,
  } = useUser();
  const router = useRouter();
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
    router.push('/login');
  };

  const MenuButtonChild = (
    <SecondaryButton className="h-10 space-x-1 lg:space-x-2 !justify-start pr-2" as="div">
      {WalletProviderIcon}
      <div className="flex items-center">
        <span className="hidden lg:inline text-xs lg:text-base">{formatAddress(address, 8)}</span>
      </div>
      <ChevronDown size={15} />
    </SecondaryButton>
  );

  const CopyAddress = (
    <MenuItem icon={<Copy size={20} />} onClick={handleCopyAddress}>
      <span>{formatAddress(address, 8)}</span>
    </MenuItem>
  );

  const MyAssets = (
    <Link href={`/users/${address}`}>
      <MenuItem icon={<Briefcase size={20} />}>
        <a>My Assets</a>
      </MenuItem>
    </Link>
  );

  const Disconnect = (
    <MenuItem icon={<Power size={20} />} onClick={handleDisconnect}>
      <span>Disconnect</span>
    </MenuItem>
  );

  const MenuItems = [CopyAddress, MyAssets, Disconnect];

  return <Menu buttonChild={MenuButtonChild} menuItems={MenuItems} {...props} />;
}
