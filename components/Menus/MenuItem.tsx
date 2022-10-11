import React from 'react';

type Props = {
  children: React.ReactNode;
  onClick?: () => void;
  icon?: React.ReactNode;
};

const MenuItem: React.FC<Props> = ({ children, onClick, icon, ...props }) => {
  return (
    <div className="menu-item w-full text-base" onClick={onClick} {...props}>
      {icon}
      {children}
    </div>
  );
};

export default MenuItem;
