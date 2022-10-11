import React, { useState } from 'react';
import { useRouter } from 'next/router';
import Menu from '.';
import { order_by_mapping } from '@/constants/index';
import { OrderByKey, useFilters } from '@/providers/FiltersProvider';
import { Check, ChevronDown } from 'react-feather';

const OrderByMenu: React.FC = () => {
  const [orderByLabel, setOrderByLabel] = useState(order_by_mapping.newestListing.label);
  const orderByKeys = Object.keys(order_by_mapping) as OrderByKey[];
  const router = useRouter();
  const { query } = router;
  const { dispatch } = useFilters();

  const selectOrderBy = (index: number) => () => {
    const orderByKey = orderByKeys[index];
    const label = order_by_mapping[orderByKey].label;
    setOrderByLabel(label);
    router.replace({ query: { ...query, orderBy: orderByKey } });
    dispatch({ type: 'set_order_by_key', payload: orderByKey });
  };

  const ButtonChild = (
    <div className="btn-secondary min-w-[125px] flex items-center space-x-2 pr-2 h-10">
      <span>{orderByLabel}</span>
      <ChevronDown size={15} />
    </div>
  );

  const MenuItems = Object.values(order_by_mapping).map(({ label }, index) => {
    const isSelected = label === orderByLabel;
    return (
      <div className="p-2 menu-item w-full" onClick={selectOrderBy(index)} key={`order-by-option-${index}`}>
        <div className="flex justify-start items-center space-x-3 text-xs lg:text-sm">
          <span className="whitespace-nowrap">{label}</span>
          {isSelected ? (
            <div className="text-accent">
              <Check />
            </div>
          ) : null}
        </div>
      </div>
    );
  });

  return <Menu buttonChild={ButtonChild} menuItems={MenuItems} />;
};

export default OrderByMenu;
