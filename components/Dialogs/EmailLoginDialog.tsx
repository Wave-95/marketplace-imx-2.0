import { client } from 'lib/imx';
import { buildMagicAndProvider } from 'lib/magic';
import { useUser } from '@/providers/UserProvider';
import { createStarkSigner, generateStarkPrivateKey, WalletConnection } from '@imtbl/core-sdk';
import { useState } from 'react';
import TextField from '../TextField';
import Dialog from '.';
import PrimaryButton from '../Buttons/PrimaryButton';

type EmailLoginDialogProps = {
  isOpen: boolean;
  closeDialog: () => void;
};

const EmailLoginDialog: React.FC<EmailLoginDialogProps> = ({ isOpen, closeDialog }) => {
  const [email, setEmail] = useState('');
  const { dispatch } = useUser();

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);
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
    <Dialog title="Connect or register with Email" isOpen={isOpen} closeDialog={closeDialog}>
      <div className="space-y-4">
        <TextField label="Email" value={email} onChange={handleEmailChange} />
        <PrimaryButton className="w-full font-semibold" onClick={connectWithEmail(email)}>
          Submit
        </PrimaryButton>
      </div>
    </Dialog>
  );
};

export default EmailLoginDialog;
