import React from 'react';
import BaseMenu from './BaseMenu';

export default function UserMenu({ ...props }) {
  const TriggerComponent = <button>Connect Wallet</button>;
  return <BaseMenu button={TriggerComponent} menuItems={[TriggerComponent, TriggerComponent]} {...props} />;
}
