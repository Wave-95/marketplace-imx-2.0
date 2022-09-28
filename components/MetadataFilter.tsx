import React from 'react';
import cx from 'classnames';

interface MetadataFilterProps {
  className?: string;
}

const MetadataFilter: React.FC<MetadataFilterProps> = ({ className }) => {
  const Header = () => (
    <div className="flex items-center justify-between flex-shrink-0 h-16 px-6 pr-2 border-b bg-page border-normal">
      <div className="flex items-center space-x-2">
        <div className="font-medium">Filters</div>
        {/* <Counter number={numSelectedFilters} /> */}
      </div>
      <div
        className="h-8 px-3 -mr-1 text-sm btn-quaternary flex items-center font-medium hover:cursor-pointer"
        // onClick={clearAllFilters}
      >
        <span>Clear all</span>
      </div>
    </div>
  );
  return (
    <div className={cx('flex flex-col', className)}>
      <Header />
    </div>
  );
};

export default MetadataFilter;
