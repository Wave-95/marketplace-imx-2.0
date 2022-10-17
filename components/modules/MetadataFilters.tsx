import { FilterValues, useFilters } from '@/providers/FiltersProvider';
import { useRouter } from 'next/router';
import React from 'react';
import { clearQueryParams, getNumSelectedFilters, isFilterSelected, toggleRouterQuery } from '@/helpers';
import Counter from '../Counter';
import cx from 'classnames';
import { Filter } from 'react-feather';
import PrimaryButton from '../Buttons/PrimaryButton';
import SecondaryButton from '../Buttons/SecondaryButton';
import QuarternaryButton from '../Buttons/QuarternaryButton';

type Props = {
  id?: string;
  className?: string;
  isMobile?: boolean;
  showHeader?: boolean;
  showFooter?: boolean;
  height?: string;
  closeMobile?: () => void;
};

const MetadataFilters: React.FC<Props> = ({ className, isMobile = false, height, showHeader, showFooter, closeMobile, ...props }) => {
  const {
    state: { available: availableFilters, selected: selectedFilters },
    dispatch,
  } = useFilters();
  const router = useRouter();

  const handleSelectFilter = (label: string, value: string) => () => {
    dispatch({ type: 'select_filter', payload: { label, value } });
    toggleRouterQuery({ label, value, router });
  };

  const handleDeselectFilter = (label: string, value: string) => () => {
    dispatch({ type: 'deselect_filter', payload: { label, value } });
    toggleRouterQuery({ label, value, router });
  };

  const clearAllFilters = () => {
    dispatch({ type: 'clear_selected_filters' });
    clearQueryParams(router);
  };

  const FilterHeader = () => (
    <div className="flex items-center justify-between flex-shrink-0 h-16 px-6 pr-2 border-b bg-page border-normal border-t-0">
      <div className="flex items-center space-x-2">
        <Filter size={15} />
        <div className="font-medium">{'Filters'}</div>
        <Counter number={getNumSelectedFilters(selectedFilters)} />
      </div>
      <QuarternaryButton className="h-8 px-3 -mr-1 text-sm font-medium" onClick={clearAllFilters}>
        {'Clear all'}
      </QuarternaryButton>
    </div>
  );

  const FilterBody = () => {
    return (
      <div className="relative flex-1 overflow-auto">
        <div className="flex flex-col lg:absolute lg:w-full lg:h-full lg:overflow-scroll divide-y divide-normal">
          {availableFilters.map(({ key, values }) => (key ? <FilterGroup label={key} values={values} key={key} /> : null))}
        </div>
      </div>
    );
  };

  const FilterFooter = () => (
    <div className="h-16 bg-page border-t border-normal sticky bottom-0 px-6 items-center grid grid-cols-2 gap-4">
      <SecondaryButton className="flex-1 !max-h-12 !h-12 font-semibold" onClick={clearAllFilters}>
        Clear all
      </SecondaryButton>
      <PrimaryButton className="flex-1 !max-h-12 !h-12 font-semibold" onClick={closeMobile}>
        OK
      </PrimaryButton>
    </div>
  );

  const FilterGroup = ({ label, values, ...props }: { label: string; values: FilterValues }) => {
    return (
      <div className="flex flex-col" {...props}>
        <div className="sticky top-0 z-10 flex items-center justify-between h-10 px-6 pr-2 capitalize border-b border-normal bg-page">
          <span>{label}</span>
        </div>
        <div className="p-6 bg-page border-normal">
          <div className="flex flex-col space-y-2">
            {values.map((value, idx) => {
              if (!value) {
                return null;
              }
              const isFilteredSelected = isFilterSelected(selectedFilters, label, value);
              const handleFilterToggle = isFilteredSelected ? handleDeselectFilter(label, value) : handleSelectFilter(label, value);
              return (
                <label className="flex items-center space-x-4 cursor-pointer" key={idx}>
                  <input
                    type="checkbox"
                    className="w-4 h-4 border rounded cursor-pointer border-active text-accent focus:ring-accent bg-page"
                    checked={isFilteredSelected}
                    onChange={handleFilterToggle}
                  />
                  <SecondaryButton className="text-xs !px-2 !py-1 capitalize" onClick={handleFilterToggle}>
                    {value}
                  </SecondaryButton>
                </label>
              );
            })}
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className={cx('flex flex-col bg-page border border-normal border-t-0', className)} id="metadata-filter" {...props}>
      {showHeader ? <FilterHeader /> : null}
      <FilterBody />
      {isMobile ? <FilterFooter /> : null}
      {height ? (
        <style global jsx>{`
          div#metadata-filter {
            height: ${height};
          }
        `}</style>
      ) : null}
    </div>
  );
};

export default MetadataFilters;
