import React, { useState } from 'react';
import Head from 'next/head';
import Image from 'next/image';
import { toast } from 'react-toastify';
import { L1_PROVIDERS } from '@imtbl/wallet-sdk-web';
import LayoutDefault from '@/components/LayoutDefault';
import { collection_name } from '@/constants/configs';
import Container from '@/components/Containers/Container';
import IconButton from '@/components/Buttons/IconButton';
import { client, buildWalletSDK } from '@/helpers/imx';
import { UserContextType, useUser } from '@/providers/UserProvider';
import { useRouter } from 'next/router';
import { createStarkSigner, generateStarkPrivateKey, WalletConnection } from '@imtbl/core-sdk';
import { GetServerSideProps } from 'next';
import { ParsedUrlQuery } from 'querystring';
import { Mail } from 'react-feather';
import { buildMagicAndProvider } from '@/helpers/magic';
import CustomDialog from '@/components/Dialog';
import TextField from '@/components/TextField';

type LoginProps = {
  referer: string;
};
const Login: React.FC<LoginProps> = ({ referer }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [email, setEmail] = useState('');

  const { dispatch } = useUser() as UserContextType;
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

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);
  };

  const connectWallet = async (provider: L1_PROVIDERS) => {
    const walletSDK = await buildWalletSDK();
    try {
      await walletSDK.connect({ provider });
      const walletConnection = await walletSDK.getWalletConnection();
      //TODO: Remove re-casting when wallet-sdk update is released
      if (walletConnection) {
        const walletConnectionNew: WalletConnection = {
          ethSigner: walletConnection?.l1Signer,
          starkSigner: walletConnection?.l2Signer,
        };
        await client.registerOffchain(walletConnectionNew);
        const address = await walletConnectionNew?.ethSigner?.getAddress();
        dispatch({ type: 'connect', payload: walletConnectionNew });
        dispatch({ type: 'set_address', payload: address });
        router.push(referer);
      }
    } catch (e) {
      if (e instanceof Error) {
        if (e.message === 'The MetaMask provider was not found.') {
          return toast.error('Please ensure MetaMask is installed on your device before connecting.');
        }
        console.error(e.message);
        toast.error('Could not connect to wallet provider.');
      }
    }
  };

  const connectWithEmail = (email: string) => async () => {
    const { magic, provider } = buildMagicAndProvider();
    //TODO: Use real email
    const response = await magic.auth.loginWithMagicLink({ email: 'test+success@magic.link', showUI: true });
    if (response) {
      const magicSigner = provider.getSigner();
      const magicAddress = await magicSigner.getAddress();
      //TODO: Persist stark private keys: https://github.com/immutable/imx-core-sdk#1-generate-your-own-signers
      let starkPrivateKey = localStorage.getItem(magicAddress);
      if (!starkPrivateKey) {
        starkPrivateKey = generateStarkPrivateKey();
        localStorage.setItem(magicAddress, starkPrivateKey);
      }
      const starkSigner = createStarkSigner(starkPrivateKey);
      const walletConnection: WalletConnection = { ethSigner: magicSigner, starkSigner };
      dispatch({ type: 'connect', payload: walletConnection });
      dispatch({ type: 'set_address', payload: magicAddress });
      const response = await client.registerOffchain(walletConnection);
      closeDialog();
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
          <div className="flex flex-col items-center max-w-lg mb-[12rem] space-y-8">
            <h2 className="text-page">Choose a login or register method</h2>
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
          <CustomDialog title="Connect or register with Email" isOpen={isOpen} closeDialog={closeDialog}>
            <div className="space-y-4">
              <TextField label="Email" value={email} onChange={handleEmailChange} />
              <button className="btn-primary w-full font-semibold" onClick={connectWithEmail(email)}>
                Submit
              </button>
            </div>
          </CustomDialog>
        </Container>
      </LayoutDefault>
    </>
  );
};

export default Login;

export const getServerSideProps: GetServerSideProps<LoginProps, ParsedUrlQuery> = async ({ req }) => {
  const referer = req.headers.referer || '/';

  return {
    props: { referer },
  };
};
