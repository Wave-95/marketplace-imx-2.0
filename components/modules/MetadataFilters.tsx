import { FiltersContextType, FilterValues, useFilters } from '@/providers/FiltersProvider';
import { useRouter } from 'next/router';
import React from 'react';
import { clearQueryParams, getNumSelectedFilters, isFilterSelected, toggleRouterQuery } from '@/helpers';
import Counter from '../Counter';
import cx from 'classnames';

interface MetadataFiltersProps {
  className?: string;
}

const MetadataFilters: React.FC<MetadataFiltersProps> = ({ className }) => {
  const {
    state: { available: availableFilters, selected: selectedFilters },
    dispatch,
  } = useFilters() as FiltersContextType;
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
    <div className="flex items-center justify-between flex-shrink-0 h-16 px-6 pr-2 border-b bg-page border-normal">
      <div className="flex items-center space-x-2">
        <div className="font-medium">Filters</div>
        <Counter number={getNumSelectedFilters(selectedFilters)} />
      </div>
      <div
        className="h-8 px-3 -mr-1 text-sm btn-quaternary flex items-center font-medium hover:cursor-pointer"
        onClick={clearAllFilters}
      >
        <span>Clear all</span>
      </div>
    </div>
  );

  const FilterBody = () => {
    return (
      <div className="relative flex-1">
        <div className="flex flex-col lg:absolute lg:w-full lg:h-full lg:overflow-scroll divide-y divide-normal">
          {availableFilters.map(({ key, values }) => (
            <FilterGroup label={key} values={values} key={key} />
          ))}
        </div>
      </div>
    );
  };

  const FilterGroup = ({ label, values, ...props }: { label: string; values: FilterValues }) => {
    return (
      <div className="flex flex-col" {...props}>
        <div className="sticky top-0 z-10 flex items-center justify-between h-10 px-6 pr-2 capitalize border-b border-normal bg-page">
          <span>{label}</span>
        </div>
        <div className="p-6 bg-page border-normal">
          <div className="flex flex-col space-y-2">
            {values.map((value, idx) => {
              const isFilteredSelected = isFilterSelected(selectedFilters, label, value);
              return (
                <label className="flex items-center space-x-4 cursor-pointer" key={idx}>
                  <input
                    type="checkbox"
                    className="w-4 h-4 border rounded cursor-pointer border-active text-accent focus:ring-accent bg-page"
                    checked={isFilteredSelected}
                    onChange={
                      isFilteredSelected ? handleDeselectFilter(label, value) : handleSelectFilter(label, value)
                    }
                  />
                  <span className="text-[0.75rem] btn-secondary px-2 py-1 capitalize">{value}</span>
                </label>
              );
            })}
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className={cx('flex flex-col', className)}>
      <FilterHeader />
      <FilterBody />
    </div>
  );
};

export default MetadataFilters;
