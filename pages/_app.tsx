import { AssetProvider, FiltersProvider, OrderProvider, PricesProvider, ThemeProvider, ToastProvider, UserProvider } from '@/providers';
import useWindowSize from 'hooks';
import { AppProps } from 'next/app';
import { Page } from 'types/page';

import '../styles/globals.css';
import '../styles/theme.css';

type Props = AppProps & {
  Component: Page;
};

function MyApp({ Component, pageProps }: Props) {
  const [_w, availHeight] = useWindowSize();
  const getLayout = Component.getLayout ?? ((page) => page);

  return (
    <>
      <ThemeProvider>
        <UserProvider>
          <ToastProvider>
            <AssetProvider>
              <OrderProvider>
                <FiltersProvider>
                  <PricesProvider>{getLayout(<Component {...pageProps} />)}</PricesProvider>
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
