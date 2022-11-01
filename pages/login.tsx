import React, { useState } from 'react';
import Head from 'next/head';
import Image from 'next/image';
import { toast } from 'react-toastify';
import { L1_PROVIDERS } from '@imtbl/wallet-sdk-web';
import LayoutDefault from '@/components/LayoutDefault';
import { collection_name } from '@/constants/configs';
import Container from '@/components/Containers/Container';
import IconButton from '@/components/Buttons/IconButton';
import { client, buildWalletSDK } from '../lib/imx';
import { useUser } from '@/providers/UserProvider';
import { useRouter } from 'next/router';
import { WalletConnection } from '@imtbl/core-sdk';
import { GetServerSideProps } from 'next';
import { ParsedUrlQuery } from 'querystring';
import { Mail } from 'react-feather';
import EmailLoginDialog from '@/components/Dialogs/EmailLoginDialog';
import { Page } from 'types/page';
import { getUserByAddress } from 'lib/sdk';

type Props = {
  referer: string;
};

const LoginPage: Page<Props> = ({ referer }) => {
  const [isOpen, setIsOpen] = useState(false);

  const { dispatch } = useUser();
  const router = useRouter();
  const page_title = `Login | ${collection_name}`;

  const WalletConnectIcon = () => <Image src="/wallet-connect.svg" width="25" height="25" alt="wallet-connect-login" />;
  const MetamaskIcon = () => <Image src="/metamask.svg" width="25" height="25" alt="metamask-login" />;

  const openDialog = () => {
    setIsOpen(true);
  };

  const closeDialog = () => {
    setIsOpen(false);
  };

  const connectWallet = async (provider: L1_PROVIDERS) => {
    const walletSDK = await buildWalletSDK();
    try {
      const walletConnection = await walletSDK.connect({ provider });
      //TODO: Remove re-casting when wallet-sdk update is released
      if (walletConnection) {
        const walletConnectionNew: WalletConnection = {
          ethSigner: walletConnection?.l1Signer,
          starkSigner: walletConnection?.l2Signer,
        };
        dispatch({ type: 'connect', payload: walletConnectionNew });

        const address = await walletConnectionNew?.ethSigner?.getAddress();
        dispatch({ type: 'set_address', payload: address });

        const user = await getUserByAddress(address);
        if (!user) {
          //TODO: Create new user
          await client.registerOffchain(walletConnectionNew);
        } else {
          //Store user id into context
        }

        if (referer.match(/login/)) {
          router.push('/');
        } else {
          router.push(referer);
        }
      }
    } catch (e) {
      if (e instanceof Error) {
        if (e.message === 'The MetaMask provider was not found.') {
          return toast.error('Please ensure MetaMask is installed on your device before connecting.');
        }
        console.error(e.message);
        toast.error('Could not connect to wallet provider.');
      }
      console.error(e);
    }
  };

  return (
    <>
      <Head>
        <title>{page_title}</title>
        <meta name="description" content="Log in" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Container className="items-center justify-center min-h-headerless">
        <div className="flex flex-col items-center max-w-lg mb-[12rem] space-y-8">
          <h2 className="text-page">{'Choose a login or register method'}</h2>
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
            <IconButton
              className="min-w-[300px] py-4 min-h-[55px]"
              icon={<Mail />}
              text="Connect or Register with Email"
              handleClick={openDialog}
            />
          </div>
        </div>
        <EmailLoginDialog isOpen={isOpen} closeDialog={closeDialog} />
      </Container>
    </>
  );
};

export default LoginPage;

LoginPage.getLayout = (page: React.ReactNode) => {
  return <LayoutDefault>{page}</LayoutDefault>;
};

export const getServerSideProps: GetServerSideProps<Props, ParsedUrlQuery> = async ({ req }) => {
  const referer = req.headers.referer || '/';

  return {
    props: { referer },
  };
};
