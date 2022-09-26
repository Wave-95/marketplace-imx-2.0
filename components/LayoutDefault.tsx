import React from 'react';
import Nav from './Nav';

export default function LayoutDefault({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Nav />
      {children}
    </>
  );
}
