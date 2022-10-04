import { Tab } from '@headlessui/react';
import cx from 'classnames';

type TabGroupProps = {
  tabDetails: {
    [key: string]: React.ReactNode;
  };
  tabListClassName?: string;
  selectedIndex?: number;
  className?: string;
};

const TabGroup: React.FC<TabGroupProps> = ({ tabDetails, tabListClassName, ...props }) => {
  return (
    <Tab.Group as="div" {...props}>
      <Tab.List
        className={cx(
          'flex items-center justify-center w-full px-2 space-x-6 border-b border-normal',
          tabListClassName
        )}
      >
        {Object.keys(tabDetails).map((tabLabel) => (
          <Tab
            as="div"
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
        {Object.values(tabDetails).map((component, idx) => (
          <Tab.Panel key={idx}>{component}</Tab.Panel>
        ))}
      </Tab.Panels>
    </Tab.Group>
  );
};

export default TabGroup;
