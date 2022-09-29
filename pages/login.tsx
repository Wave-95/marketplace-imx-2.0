import React from 'react';
import Head from 'next/head';
import Image from 'next/image';
import { toast } from 'react-toastify';
import { L1_PROVIDERS } from '@imtbl/wallet-sdk-web';
import LayoutDefault from '@/components/LayoutDefault';
import { collection_name } from '@/constants/configs';
import Container from '@/components/Container';
import IconButton from '@/components/Buttons/IconButton';
import { coreSdkWorkflows, buildWalletSDK } from '@/helpers/imx';
import { UserContextType, useUser } from '@/providers/UserProvider';
import { useRouter } from 'next/router';

const Login: React.FC = () => {
  const { dispatch } = useUser() as UserContextType;
  const router = useRouter();
  const page_title = `Login | ${collection_name}`;

  const WalletConnectIcon = () => <Image src="/wallet-connect.svg" width="25" height="25" alt="wallet-connect-login" />;
  const MetamaskIcon = () => <Image src="/metamask.svg" width="25" height="25" alt="metamask-login" />;

  const connectWallet = async (provider: L1_PROVIDERS) => {
    const walletSDK = await buildWalletSDK();
    try {
      await walletSDK.connect({ provider });
      const walletConnection = await walletSDK.getWalletConnection();
      walletConnection && (await coreSdkWorkflows.registerOffchain(walletConnection));
      const address = await walletConnection?.l1Signer?.getAddress();
      dispatch({ type: 'connect', payload: walletConnection });
      dispatch({ type: 'set_address', payload: address });
      router.push('/');
    } catch (e) {
      if (e instanceof Error) {
        if (e.message === 'The MetaMask provider was not found.') {
          return toast.error('Please install the MetaMask browser extension before connecting.');
        }
        console.error(e.message);
        toast.error('Could not connect to wallet provider.');
      }
    }
  };

  return (
    <>
      <Head>
        <title>{page_title}</title>
        <meta name="description" content="Log in" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <LayoutDefault>
        <Container className="items-center justify-center min-h-headerless">
          <div className="flex flex-col items-center max-w-lg mb-[12rem] space-y-8 prose">
            <h2 className="text-page">Please select a wallet provider</h2>
            <div className="flex flex-col space-y-6">
              <IconButton
                className="min-w-[300px] py-4 min-h-[55px]"
                icon={<MetamaskIcon />}
                text="Connect MetaMask"
                handleClick={() => connectWallet(L1_PROVIDERS.METAMASK)}
              />
              <IconButton
                className="min-w-[300px] py-4 min-h-[55px]"
                icon={<WalletConnectIcon />}
                text="Connect WalletConnect"
                handleClick={() => connectWallet(L1_PROVIDERS.WALLET_CONNECT)}
              />
            </div>
          </div>
        </Container>
      </LayoutDefault>
    </>
  );
};

export default Login;
