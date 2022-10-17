import React from 'react';
import TertiaryButton from '../Buttons/TertiaryButton';

type Props = {
  children: React.ReactNode;
  onClick?: () => void;
  icon?: React.ReactNode;
};

const MenuItem: React.FC<Props> = ({ children, onClick, icon, ...props }) => {
  return (
    <TertiaryButton className="text-base h-10 rounded-lg !justify-start px-2 space-x-4 flex-1 w-full" onClick={onClick} {...props}>
      {icon}
      {children}
    </TertiaryButton>
  );
};

export default MenuItem;
