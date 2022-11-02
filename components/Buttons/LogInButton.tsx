import { useRouter } from 'next/router';
import React, { SyntheticEvent } from 'react';
import cx from 'classnames';
import PrimaryButton from './PrimaryButton';

type Props = {
  className?: string;
};

const LogInButton: React.FC<Props> = ({ className, ...props }) => {
  const router = useRouter();

  const redirectLogin = (e: SyntheticEvent) => {
    e.preventDefault();
    router.push('/login');
  };

  return (
    <PrimaryButton className={cx('font-semibold', className)} onClick={redirectLogin} {...props}>
      {'Log in'}
    </PrimaryButton>
  );
};

export default LogInButton;
