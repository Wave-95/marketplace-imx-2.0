import { PriceProvider, ThemeProvider, ToastProvider, UserProvider } from '@/providers';
import { AppProps } from 'next/app';

import '../styles/globals.css';
import '../styles/theme.css';

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <ThemeProvider>
      <ToastProvider>
        <UserProvider>
          <PriceProvider>
            <Component {...pageProps} />
          </PriceProvider>
        </UserProvider>
      </ToastProvider>
    </ThemeProvider>
  );
}

export default MyApp;
