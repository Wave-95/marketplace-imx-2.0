import React from 'react';
import Nav from './Nav';

export default function LayoutDefault({ children }: { children: React.ReactNode }) {
  return (
    <div className="h-full flex flex-col">
      <Nav />
      {children}
    </div>
  );
}
