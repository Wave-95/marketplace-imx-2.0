import Link from 'next/link';
import DarkModeToggle from './ToggleTheme';
import UserMenu from './Menus/UserMenu';
import ConnectWallet from './Buttons/ConnectWallet';
import { UserContextType, useUser } from '@/providers/UserProvider';
import Balance from './Buttons/Balance';
import Header from './Header';

export default function Nav({ ...props }) {
  const {
    state: { address },
  } = useUser() as UserContextType;

  const LogoHome = () => (
    <Link href="/">
      <a className="font-bold btn-quarternary text-page">Your Logo</a>
    </Link>
  );

  return (
    <div className="relative sticky top-0 z-[100]" {...props}>
      <Header className="border-b border-normal">
        <LogoHome />
        <div className="flex items-center space-x-2 lg:space-x-4 ml-auto">
          <Balance />
          {address ? <UserMenu /> : <ConnectWallet />}
          <DarkModeToggle />
        </div>
      </Header>
    </div>
  );
}
