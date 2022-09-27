import { ThemeProvider, ToastProvider } from '@/providers';
import { UserProvider } from '@/providers/UserProvider';
import { AppProps } from 'next/app';

import '../styles/globals.css';
import '../styles/theme.css';

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <ThemeProvider>
      <ToastProvider>
        <UserProvider>
          <Component {...pageProps} />
        </UserProvider>
      </ToastProvider>
    </ThemeProvider>
  );
}

export default MyApp;
