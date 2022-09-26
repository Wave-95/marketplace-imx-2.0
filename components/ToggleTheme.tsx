import { useTheme } from '@/providers';
import { Moon, Sun } from 'react-feather';

function DarkModeToggle({ ...props }) {
  const { isDarkMode, toggleTheme } = useTheme();

  const toggleDarkMode = () => {
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
      <button aria-label="Theme Mode" className="p-2 btn-secondary" onClick={toggleDarkMode}>
        {isDarkMode ? <Sun /> : <Moon />}
      </button>
    </div>
  );
}

export default DarkModeToggle;
