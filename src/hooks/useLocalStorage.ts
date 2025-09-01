import { useEffect } from 'react';

import { useRecentCardsRaw } from '../utils/state';

const localStorageKey = 'recentCards';

export function updateRecentCards(cards: Record<string, number>) {
  localStorage.setItem(localStorageKey, JSON.stringify(cards));
}

export function getRecentCards(): Record<string, number> {
  const data = localStorage.getItem(localStorageKey);
  return JSON.parse(data || '{}');
}

export function useLocalStorage() {
  const [data, setData] = useRecentCardsRaw();

  useEffect(() => {
    setData(getRecentCards());
  }, []);

  useEffect(() => {
    if (Object.values(data).length === 0) return;
    updateRecentCards(data);
  }, [data]);

  return { loading: false };
}
