import { Menu } from '@headlessui/react';
import React from 'react';
import cx from 'classnames';

interface BaseMenuProps {
  buttonChild: React.ReactNode;
  menuItems: React.ReactNode[];
  menuItemsClassName?: string;
}

const BaseMenu: React.FC<BaseMenuProps> = ({ buttonChild, menuItems, menuItemsClassName, ...props }) => {
  return (
    <div {...props}>
      <Menu as="div" className="relative inline-block text-left">
        <Menu.Button>{buttonChild}</Menu.Button>
        <Menu.Items
          className={cx(
            'absolute z-[999] right-0 mt-2 origin-top-right min-w-[10rem] flex flex-col gap-1 p-2 space-y-1 border rounded-popover bg-popover border-popover items-start',
            menuItemsClassName
          )}
        >
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
