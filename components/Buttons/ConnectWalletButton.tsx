import { useRouter } from 'next/router';
import React, { SyntheticEvent } from 'react';
import cx from 'classnames';

type Props = {
  className?: string;
};

const ConnectWallet: React.FC<Props> = ({ className, ...props }) => {
  const router = useRouter();

  const redirectLogin = (e: SyntheticEvent) => {
    e.preventDefault();
    router.push('/login');
  };

  return (
    <button className={cx('btn-primary h-10', className)} onClick={redirectLogin} {...props}>
      Connect Wallet
    </button>
  );
};

export default ConnectWallet;
