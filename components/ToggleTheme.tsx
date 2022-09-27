import { useTheme } from '@/providers';
import { MouseEvent } from 'react';
import { Moon, Sun } from 'react-feather';

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
      <button
        aria-label="Theme Mode"
        className="btn-secondary p-2 h-10 w-10 flex items-center justify-center"
        onClick={toggleDarkMode}
      >
        {isDarkMode ? <Sun size={20} /> : <Moon size={20} />}
      </button>
    </div>
  );
}

export default DarkModeToggle;
