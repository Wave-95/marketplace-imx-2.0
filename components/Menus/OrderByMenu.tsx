import React, { useState } from 'react';
import { useRouter } from 'next/router';
import Menu from '.';
import { order_by_mapping } from '@/constants/index';
import { OrderByKey, useFilters } from '@/providers/FiltersProvider';
import { Check, ChevronDown } from 'react-feather';
import SecondaryButton from '../Buttons/SecondaryButton';
import TertiaryButton from '../Buttons/TertiaryButton';

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
    <SecondaryButton className="min-w-[125px] space-x-2 pr-2 h-10" as="div">
      <span>{orderByLabel}</span>
      <ChevronDown size={15} />
    </SecondaryButton>
  );

  const MenuItems = Object.values(order_by_mapping).map(({ label }, index) => {
    const isSelected = label === orderByLabel;
    return (
      <TertiaryButton
        className="!px-2 !py-2 !justify-start w-full space-x-3 text-xs lg:text-sm"
        onClick={selectOrderBy(index)}
        key={`order-by-option-${index}`}
      >
        <span className="whitespace-nowrap">{label}</span>
        {isSelected ? (
          <div className="text-accent">
            <Check />
          </div>
        ) : null}
      </TertiaryButton>
    );
  });

  return <Menu buttonChild={ButtonChild} menuItems={MenuItems} />;
};

export default OrderByMenu;
