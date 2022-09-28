import { FiltersProvider, PricesProvider, ThemeProvider, ToastProvider, UserProvider } from '@/providers';
import { AppProps } from 'next/app';

import '../styles/globals.css';
import '../styles/theme.css';

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <ThemeProvider>
      <ToastProvider>
        <UserProvider>
          <FiltersProvider>
            <PricesProvider>
              <Component {...pageProps} />
            </PricesProvider>
          </FiltersProvider>
        </UserProvider>
      </ToastProvider>
    </ThemeProvider>
  );
}

export default MyApp;
