import React from 'react';
import cx from 'classnames';

type Props = {
  className?: string;
  children: React.ReactNode;
  onClick?: (param: any) => void;
  disabled?: boolean;
};

const PrimaryButton: React.FC<Props> = ({ className, children, ...props }) => {
  return (
    <button
      className={cx(
        'flex items-center justify-center text-center py-2 px-4 max-h-9 lg:max-h-10 text-xs lg:text-sm text-button-primary-normal bg-button-primary-normal rounded-lg hover:opacity-90 active:scale-[0.98] border-normal disabled:text-button-primary-disabled disabled:bg-button-primary-disabled disabled:border-button-primary-disabled disabled:cursor-not-allowed',
        className
      )}
      {...props}
    >
      {children}
    </button>
  );
};

export default PrimaryButton;
