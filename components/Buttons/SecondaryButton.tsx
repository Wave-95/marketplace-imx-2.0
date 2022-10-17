import React from 'react';
import cx from 'classnames';

type Props = {
  className?: string;
  children: React.ReactNode;
  onClick?: (param: any) => void;
  disabled?: boolean;
  as?: 'button' | 'div';
};

const SecondaryButton: React.FC<Props> = ({ className, children, as = 'button', ...props }) => {
  const styles =
    'flex items-center justify-center text-center py-2 px-4 max-h-9 lg:max-h-10 text-xs lg:text-sm text-button-secondary-normal dark:text-button-secondary-active bg-button-secondary-normal dark:bg-button-secondary-active border-button-secondary-normal dark:border-button-secondary-active hover:bg-button-secondary-hover font-semibold rounded-lg hover:opacity-90 active:scale-[0.98]';

  if (as === 'button') {
    return (
      <button className={cx(styles, className)} {...props}>
        {children}
      </button>
    );
  }

  if (as === 'div') {
    return (
      <div className={cx(styles, 'cursor-pointer', className)} {...props}>
        {children}
      </div>
    );
  }

  return null;
};

export default SecondaryButton;
