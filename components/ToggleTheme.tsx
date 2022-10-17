import { useTheme } from '@/providers';
import { MouseEvent } from 'react';
import { Moon, Sun } from 'react-feather';
import SecondaryButton from './Buttons/SecondaryButton';

function DarkModeToggle({ ...props }) {
  const { isDarkMode, toggleTheme } = useTheme();

  const toggleDarkMode = (e: MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    localStorage.setItem('marketplace-dark-mode', (!isDarkMode).toString());
    toggleTheme();

    const key = localStorage.getItem('marketplace-dark-mode');
    if (key === 'true') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  };

  return (
    <div {...props}>
      <SecondaryButton aria-label="Theme Mode" className="!px-2 !py-2 h-10 w-10 flex items-center justify-center" onClick={toggleDarkMode}>
        {isDarkMode ? <Sun size={20} /> : <Moon size={20} />}
      </SecondaryButton>
    </div>
  );
}

export default DarkModeToggle;
