import Link from 'next/link';
import DarkModeToggle from './ToggleTheme';

export default function Nav({ ...props }) {
  const LogoHome = () => (
    <Link href="/">
      <a className="font-bold btn-quarternary text-page">Your Logo</a>
    </Link>
  );

  return (
    <div className="relative lg:sticky top-0 z-[100]" {...props}>
      <header className="h-16 px-4 lg:px-6 bg-header border-b border-normal flex items-center justify-between">
        <LogoHome />
        <DarkModeToggle />
      </header>
    </div>
  );
}
