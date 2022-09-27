import { Menu, Transition } from '@headlessui/react';
import React, { Fragment } from 'react';

interface BaseMenuProps {
  button: React.ReactNode;
  menuItems: React.ReactNode[];
}

const BaseMenu: React.FC<BaseMenuProps> = ({ button, menuItems, ...props }) => {
  return (
    <div {...props}>
      <Menu as="div" className="relative inline-block text-left">
        <Menu.Button as={React.Fragment}>{button}</Menu.Button>
        <Transition
          as={Fragment}
          enter="transition ease-out duration-100"
          enterFrom="transform opacity-0 scale-95"
          enterTo="transform opacity-100 scale-100"
          leave="transition ease-in duration-75"
          leaveFrom="transform opacity-100 scale-100"
          leaveTo="transform opacity-0 scale-95"
        >
          <Menu.Items className="absolute z-[999] right-0 mt-2 w-56 origin-top-right flex flex-col gap-1 p-2 space-y-1 border w-[12rem] rounded-popover bg-popover border-popover items-start">
            {menuItems.map((component, key) => {
              return (
                <Menu.Item as="div" key={key}>
                  {component}
                </Menu.Item>
              );
            })}
          </Menu.Items>
        </Transition>
      </Menu>
    </div>
  );
};

export default BaseMenu;
