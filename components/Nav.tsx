import Link from 'next/link';
import DarkModeToggle from './ToggleTheme';
import UserMenu from './Menus/UserMenu';
import ConnectWalletButton from './Buttons/ConnectWalletButton';
import { useUser } from '@/providers/UserProvider';
import BalanceButton from './Buttons/BalanceButton';
import Header from './Header';
import Centered from './Containers/Centered';

export default function Nav({ ...props }) {
  const {
    state: { address },
  } = useUser();

  const LogoHome = () => (
    <Link href="/">
      <a className="font-bold text-page">Your Logo</a>
    </Link>
  );

  return (
    <Header className="sticky top-0 z-[100] border-b border-normal" {...props}>
      <LogoHome />
      <Centered className="space-x-2 lg:space-x-4 ml-auto">
        <BalanceButton />
        {address ? <UserMenu /> : <ConnectWalletButton />}
        <DarkModeToggle />
      </Centered>
    </Header>
  );
}
