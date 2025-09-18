import { useEffect, useState } from 'react';

export function useDebounce<T>(value: T, delay: number = 500): { value: T; waiting: boolean } {
  const [debouncedValue, setDebouncedValue] = useState(value);
  const [waiting, setWaiting] = useState(false);

  useEffect(() => {
    setWaiting(true);

    const handler = setTimeout(() => {
      setDebouncedValue(value);
      setWaiting(false);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return { value: debouncedValue, waiting };
}
