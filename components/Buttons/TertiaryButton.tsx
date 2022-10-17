import React from 'react';
import cx from 'classnames';

type Props = {
  className?: string;
  children: React.ReactNode;
  onClick?: (param: any) => void;
  disabled?: boolean;
};

const TertiaryButton: React.FC<Props> = ({ className, children, ...props }) => {
  return (
    <button
      className={cx(
        'flex items-center justify-center text-center py-2 px-4 max-h-9 lg:max-h-10 rounded-lg text-xs lg:text-sm text-button-tertiary-normal hover:text-button-tertiary-active bg-button-tertiary-normal border-button-tertiary-normal hover:border-button-tertiary-active hover:bg-button-tertiary-hover',
        className
      )}
      {...props}
    >
      {children}
    </button>
  );
};

export default TertiaryButton;
