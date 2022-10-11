import Link from 'next/link';
import DarkModeToggle from './ToggleTheme';
import UserMenu from './Menus/UserMenu';
import ConnectWalletButton from './Buttons/ConnectWalletButton';
import { useUser } from '@/providers/UserProvider';
import BalanceButton from './Buttons/BalanceButton';
import Header from './Header';

export default function Nav({ ...props }) {
  const {
    state: { address },
  } = useUser();

  const LogoHome = () => (
    <Link href="/">
      <a className="font-bold btn-quarternary text-page">Your Logo</a>
    </Link>
  );

  return (
    <div className="sticky top-0 z-[100]" {...props}>
      <Header className="border-b border-normal">
        <LogoHome />
        <div className="flex items-center space-x-2 lg:space-x-4 ml-auto">
          <BalanceButton />
          {address ? <UserMenu /> : <ConnectWalletButton />}
          <DarkModeToggle />
        </div>
      </Header>
    </div>
  );
}
