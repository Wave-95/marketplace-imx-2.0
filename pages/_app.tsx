import {
  AssetProvider,
  DimensionProvider,
  FiltersProvider,
  OrderProvider,
  PricesProvider,
  ThemeProvider,
  ToastProvider,
  UserProvider,
} from '@/providers';
import { AppProps } from 'next/app';

import '../styles/globals.css';
import '../styles/theme.css';

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <ThemeProvider>
      <DimensionProvider>
        <UserProvider>
          <ToastProvider>
            <AssetProvider>
              <OrderProvider>
                <FiltersProvider>
                  <PricesProvider>
                    <Component {...pageProps} />
                  </PricesProvider>
                </FiltersProvider>
              </OrderProvider>
            </AssetProvider>
          </ToastProvider>
        </UserProvider>
      </DimensionProvider>
    </ThemeProvider>
  );
}

export default MyApp;
