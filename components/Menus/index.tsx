import { Menu as HeadlessMenu } from '@headlessui/react';
import React from 'react';
import cx from 'classnames';

interface MenuProps {
  buttonChild: React.ReactNode;
  menuItems: React.ReactNode[];
  menuItemsClassName?: string;
}

const Menu: React.FC<MenuProps> = ({ buttonChild, menuItems, menuItemsClassName, ...props }) => {
  return (
    <div {...props}>
      <HeadlessMenu as="div" className="relative inline-block text-left">
        <HeadlessMenu.Button>{buttonChild}</HeadlessMenu.Button>
        <HeadlessMenu.Items
          className={cx(
            'absolute z-[999] right-0 mt-2 origin-top-right min-w-[10rem] flex flex-col gap-1 p-2 space-y-1 border rounded-popover bg-popover border-popover items-start',
            menuItemsClassName
          )}
        >
          {menuItems.map((component, key) => {
            return (
              <HeadlessMenu.Item as="div" key={key} className="w-full">
                {component}
              </HeadlessMenu.Item>
            );
          })}
        </HeadlessMenu.Items>
      </HeadlessMenu>
    </div>
  );
};

export default Menu;
