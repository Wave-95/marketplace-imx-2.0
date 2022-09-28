export type FilterValues = Array<string | number>;

export type FilterOption = {
  key: string;
  values: FilterValues;
};

export type Available = Array<FilterOption>;

export type SelectedFilters = {
  [key: string]: FilterValues;
};

export type OrderByKey = 'lowestPrice' | 'highestPrice' | 'newestListing' | 'oldestListing';
