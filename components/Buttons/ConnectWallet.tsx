import { useRouter } from 'next/router';
import React, { SyntheticEvent } from 'react';

export default function ConnectWallet({ ...props }) {
  const router = useRouter();

  const redirectLogin = (e: SyntheticEvent) => {
    e.preventDefault();
    router.push('/login');
  };

  return (
    <button className="btn-primary" onClick={redirectLogin} {...props}>
      Connect Wallet
    </button>
  );
}
