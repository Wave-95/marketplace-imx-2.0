import Link from 'next/link';
import DarkModeToggle from './ToggleTheme';

export default function Nav({ ...props }) {
  const LogoHome = () => (
    <Link href="/">
      <a className="font-bold btn-quarternary text-page">Your Logo</a>
    </Link>
  );

  return (
    <div className="sticky top-0 z-[100]" {...props}>
      <header className="header border-b border-normal">
        <LogoHome />
        <DarkModeToggle />
      </header>
    </div>
  );
}
