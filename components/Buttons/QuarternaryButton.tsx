import React from 'react';
import cx from 'classnames';

type Props = {
  className?: string;
  children: React.ReactNode;
  onClick?: (param: any) => void;
  disabled?: boolean;
};

const QuarternaryButton: React.FC<Props> = ({ className, children, ...props }) => {
  return (
    <button
      className={cx(
        'flex items-center justify-center text-center py-2 px-4 max-h-9 lg:max-h-10 text-xs lg:text-sm text-button-quaternary-normal hover:text-button-quaternary-active bg-button-quaternary-normal hover:bg-button-quaternary-active border-button-quaternary-normal hover:border-button-quaternary-active border',
        className
      )}
      {...props}
    >
      {children}
    </button>
  );
};

export default QuarternaryButton;
