import { AssetProvider, FiltersProvider, OrderProvider, PricesProvider, ThemeProvider, ToastProvider, UserProvider } from '@/providers';
import useWindowSize from 'hooks';
import { AppProps } from 'next/app';

import '../styles/globals.css';
import '../styles/theme.css';

function MyApp({ Component, pageProps }: AppProps) {
  const [_w, availHeight] = useWindowSize();
  return (
    <>
      <ThemeProvider>
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
      </ThemeProvider>
      <style global jsx>{`
        div#__next {
          height: ${availHeight}px;
        }
      `}</style>
    </>
  );
}

export default MyApp;
