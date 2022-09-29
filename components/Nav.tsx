import Link from 'next/link';
import DarkModeToggle from './ToggleTheme';
import UserMenu from './Menus/UserMenu';
import ConnectWallet from './Buttons/ConnectWallet';
import { UserContextType, useUser } from '@/providers/UserProvider';
import Balance from './Buttons/Balance';

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
    <div className="relative lg:sticky lg:top-0 z-[100]" {...props}>
      <header className="header border-b border-normal">
        <LogoHome />
        <div className="flex items-center space-x-4 ml-auto">
          <Balance />
          {address ? <UserMenu /> : <ConnectWallet />}
          <DarkModeToggle className="hidden lg:block" />
        </div>
      </header>
    </div>
  );
}
