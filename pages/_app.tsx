import { ToastProvider } from '@/providers';
import { AppProps } from 'next/app';

import '../styles/globals.css';
import '../styles/theme.css';

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <ToastProvider>
      <Component {...pageProps} />
    </ToastProvider>
  );
}

export default MyApp;
