import { useIsomorphicLayoutEffect } from 'hooks';
import React, { useState } from 'react';
import Nav from './Nav';

export default function LayoutDefault({ children }: { children: React.ReactNode }) {
  const [availHeight, setAvailHeight] = useState<string>('800');

  const handleResize = () => {
    setAvailHeight(window.innerHeight.toString());
  };

  useIsomorphicLayoutEffect(() => {
    setAvailHeight(window.innerHeight.toString());

    // Add event listener
    window.addEventListener('resize', handleResize);

    // Call handler right away so state gets updated with initial window size
    handleResize();

    // Remove event listener on cleanup
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <div className="h-full lg:h-auto flex flex-col">
      <Nav />
      {children}
      <style global jsx>{`
        div#__next {
          height: ${availHeight}px;
        }
      `}</style>
    </div>
  );
}
