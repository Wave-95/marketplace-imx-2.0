import { Menu } from '@headlessui/react';
import React from 'react';

interface BaseMenuProps {
  buttonChild: React.ReactNode;
  menuItems: React.ReactNode[];
}

const BaseMenu: React.FC<BaseMenuProps> = ({ buttonChild, menuItems, ...props }) => {
  return (
    <div {...props}>
      <Menu as="div" className="relative inline-block text-left">
        <Menu.Button>{buttonChild}</Menu.Button>
        <Menu.Items className="absolute z-[999] right-0 mt-2 origin-top-right min-w-[10rem] flex flex-col gap-1 p-2 space-y-1 border rounded-popover bg-popover border-popover items-start">
          {menuItems.map((component, key) => {
            return (
              <Menu.Item as="div" key={key} className="w-full">
                {component}
              </Menu.Item>
            );
          })}
        </Menu.Items>
      </Menu>
    </div>
  );
};

export default BaseMenu;
