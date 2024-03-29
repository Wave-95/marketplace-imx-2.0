import { Tab } from '@headlessui/react';
import cx from 'classnames';
import React, { FormEventHandler } from 'react';

type TabGroupProps = {
  tabMapping: {
    [key: string]: React.ReactNode;
  };
  tabListClassName?: string;
  selectedIndex?: number;
  className?: string;
  onChange?: FormEventHandler<HTMLDivElement> & ((index: number) => void);
};

const TabGroup: React.FC<TabGroupProps> = ({ selectedIndex, onChange, tabMapping, tabListClassName, ...props }) => {
  return (
    <Tab.Group as="div" {...props} selectedIndex={selectedIndex} onChange={onChange}>
      <Tab.List className={cx('flex items-center justify-center w-full px-2 space-x-6 border-b border-normal', tabListClassName)}>
        {Object.keys(tabMapping).map((tabLabel) => (
          <Tab
            as="button"
            key={tabLabel}
            className={({ selected }) =>
              cx(
                'text-secondary hover:text-primary relative flex h-11 translate-y-px items-center overflow-hidden font-medium  transition-colors duration-200 ease-out cursor-pointer',
                selected ? 'text-primary border-b-2 border-tab-active' : ''
              )
            }
          >
            {tabLabel}
          </Tab>
        ))}
      </Tab.List>
      <Tab.Panels>
        {Object.values(tabMapping).map((component, idx) => (
          <Tab.Panel key={idx}>{component}</Tab.Panel>
        ))}
      </Tab.Panels>
    </Tab.Group>
  );
};

export default TabGroup;
