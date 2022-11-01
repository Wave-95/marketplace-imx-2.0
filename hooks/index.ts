import { useEffect, useLayoutEffect, useState } from 'react';

export const useIsomorphicLayoutEffect = typeof window !== 'undefined' ? useLayoutEffect : useEffect;

export const useWindowSize = () => {
  const [size, setSize] = useState([0, 0]);
  useEffect(() => {
    function updateSize() {
      setSize([window.innerWidth, window.innerHeight]);
    }
    window.addEventListener('resize', updateSize);
    updateSize();
    return () => window.removeEventListener('resize', updateSize);
  }, []);
  return size;
};

export const useCart = () => {
  const [cart, setCartState] = useState<any[]>([]);

  const handleStorageChange = ({ key, newValue }: StorageEvent) => {
    console.log(key, newValue);
    if (key === 'marketplace:CART_INFO' && newValue) {
      setCartState(JSON.parse(newValue));
    }
  };

  useEffect(() => {
    const setCurrentStorage = () => {
      const currentValue = localStorage.getItem('marketplace:CART_INFO');
      if (currentValue) {
        setCartState(JSON.parse(currentValue));
      } else {
        setCartState([]);
      }
    };
    setCurrentStorage();
    addEventListener('storage', handleStorageChange);
    return removeEventListener('storage', handleStorageChange);
  }, []);

  const setCart = (value: any[]) => {
    setCartState(value);
    const valueJSON = JSON.stringify(value);
    localStorage.setItem('marketplace:CART_INFO', valueJSON);
  };

  return [cart, setCart] as const;
};
