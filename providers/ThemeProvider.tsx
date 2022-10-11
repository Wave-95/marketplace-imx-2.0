import { createContext, useContext, useEffect, useState } from 'react';

type UseThemeProps = {
  isDarkMode?: boolean;
  toggleTheme: () => void;
};

type ThemeProviderProps = {
  children?: any;
};

export const ThemeContext = createContext<UseThemeProps>({
  isDarkMode: true,
  toggleTheme: () => {},
});

export const useTheme = () => useContext(ThemeContext);

export const ThemeProvider = ({ children }: ThemeProviderProps) => {
  const [isDarkMode, setIsDarkMode] = useState(true);

  useEffect(() => {
    const key = localStorage.getItem('marketplace-dark-mode');
    if (!key || key === 'true') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    // Default to dark mode if no preference config
    setIsDarkMode(!key || key === 'true');
  }, []);

  const toggleTheme = () => {
    setIsDarkMode(!isDarkMode);
  };

  return (
    <>
      <ThemeContext.Provider
        value={{
          isDarkMode,
          toggleTheme,
        }}
      >
        {children}
      </ThemeContext.Provider>
    </>
  );
};
