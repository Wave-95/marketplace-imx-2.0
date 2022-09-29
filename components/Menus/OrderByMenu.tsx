import React, { useState } from 'react';
import { useRouter } from 'next/router';
import BaseMenu from './BaseMenu';
import { order_by_config } from '@/constants/index';
import { FiltersContextType, OrderByKey, useFilters } from '@/providers/FiltersProvider';

const OrderByMenu: React.FC = () => {
  const [orderByLabel, setOrderByLabel] = useState(order_by_config.newestListing.label);
  const orderByKeys = Object.keys(order_by_config) as OrderByKey[];
  const router = useRouter();
  const { query } = router;
  const { dispatch } = useFilters() as FiltersContextType;

  const selectOrderBy = (index: number) => () => {
    const orderByKey = orderByKeys[index];
    const label = order_by_config[orderByKey].label;
    setOrderByLabel(label);
    router.replace({ query: { ...query, orderBy: orderByKey } });
    dispatch({ type: 'set_order_by_key', payload: orderByKey });
  };

  const ButtonChild = <div className="btn-secondary min-w-[125px]">{orderByLabel}</div>;

  const MenuItems = Object.values(order_by_config).map(({ label }, index) => {
    return (
      <div className="p-2 menu-item" onClick={selectOrderBy(index)} key={`order-by-option-${index}`}>
        {label}
      </div>
    );
  });

  return <BaseMenu buttonChild={ButtonChild} menuItems={MenuItems} />;
};

export default OrderByMenu;
