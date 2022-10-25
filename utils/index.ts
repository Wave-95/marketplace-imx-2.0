import { NextRouter } from 'next/router';
import { ParsedUrlQuery } from 'querystring';
import { SelectedFilters } from '@/providers/FiltersProvider';
import { formatObjValsToArrays } from './formatters';
import { server_base_uri } from '@/constants/configs';

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

export const fetchURL = async (endpoint: string) => {
  return await fetch(`${server_base_uri}/${endpoint}`);
};

export const getNumSelectedFilters = (selectedFilters: SelectedFilters) => {
  let filterCount = 0;
  Object.values(selectedFilters).forEach((values) => (filterCount += values.length));
  return filterCount;
};

export const isSameAddress = (addr1?: string | null, addr2?: string | null) => {
  if (typeof addr1 === 'string' && typeof addr2 === 'string') {
    return addr1.toLowerCase() === addr2.toLowerCase();
  }
  return false;
};

export const isFilterSelected = (selectedFilters: SelectedFilters, label: string, value: string) => {
  const values = selectedFilters[label];
  if (Array.isArray(values)) {
    return values.includes(value);
  } else {
    return false;
  }
};

export const refreshData = (router: NextRouter) => {
  router.replace(router.asPath);
};

type ToggleRouterQueryParams = {
  label: string;
  value: string;
  router: NextRouter;
};
export const toggleRouterQuery = ({ label, value, router }: ToggleRouterQueryParams) => {
  const { pathname, query } = router;
  const newQuery = formatObjValsToArrays(query);
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
