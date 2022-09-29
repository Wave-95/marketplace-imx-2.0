import { NextRouter } from 'next/router';
import { ParsedUrlQuery } from 'querystring';
import { SelectedFilters } from '@/providers/FiltersProvider';
import { formatObjValsToArrays } from './formatters';

export const clearQueryParams = (router: NextRouter) => {
  const { pathname, query } = router;
  const newQuery = {} as ParsedUrlQuery;
  //Remove dynamic routes from new query obj to prevent nextjs interpolation error
  const dynamicRoutes = pathname.match(/(?<=\[).+?(?=\])/);
  if (Array.isArray(dynamicRoutes) && dynamicRoutes.length) {
    dynamicRoutes.forEach((route) => {
      newQuery[route] = query[route];
    });
  }
  router.replace({ pathname, query: newQuery }, undefined, { shallow: true });
};

export const getNumSelectedFilters = (selectedFilters: SelectedFilters) => {
  let filterCount = 0;
  Object.values(selectedFilters).forEach((values) => (filterCount += values.length));
  return filterCount;
};

export const isFilterSelected = (selectedFilters: SelectedFilters, label: string, value: string) => {
  const values = selectedFilters[label];
  if (Array.isArray(values)) {
    return values.includes(value);
  } else {
    return false;
  }
};

type ToggleRouterQueryParams = {
  label: string;
  value: string;
  router: NextRouter;
};
export const toggleRouterQuery = ({ label, value, router }: ToggleRouterQueryParams) => {
  const { pathname, query } = router;
  const newQuery = formatObjValsToArrays(query);
  //Remove dynamic routes from new query obj to prevent nextjs interpolation error
  const dynamicRoutes = pathname.match(/(?<=\[).+?(?=\])/);
  if (Array.isArray(dynamicRoutes)) {
    dynamicRoutes.forEach((route) => {
      delete newQuery[route];
    });
  }
  if (Array.isArray(newQuery[label])) {
    if (newQuery[label].includes(value)) {
      removeStringFromArray(newQuery[label], value);
    } else {
      newQuery[label].push(value);
    }
  } else {
    newQuery[label] = [value];
  }
  return router.replace({ pathname, query: newQuery }, undefined, { shallow: true });
};

export const removeStringFromArray = (array: string[], string: string) => {
  const index = array.indexOf(string);
  array.splice(index, 1);
};
