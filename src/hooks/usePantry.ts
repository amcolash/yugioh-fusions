import { useEffect, useState } from 'react';

import { useRecentCardsRaw } from '../utils/state';
import { getRecentCards as getRecentCardsLS, updateRecentCards as updateRecentCardsLS } from './useLocalStorage';

// Not a big deal that this is exposed - not actually storing anything of any value, api is free, no CC
const pantryID = 'd3fde413-0898-4607-8b43-404392c50d61';
const url = `https://getpantry.cloud/apiv1/pantry/${pantryID}/basket/recentCards`;

const timeout = 7000;

export function updateRecentCards(cards: Record<string, number>): Promise<string | void> {
  return fetch(url, {
    method: 'PUT',
    redirect: 'follow',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ cards }),
    signal: AbortSignal.timeout(timeout),
  }).then((response) => response.text());
}

export function getRecentCards(): Promise<Record<string, number>> {
  return fetch(url, {
    redirect: 'follow',
    headers: { 'Content-Type': 'application/json' },
    signal: AbortSignal.timeout(timeout),
  })
    .then((response) => response.json())
    .then((res) => res.cards);
}

export function usePantry() {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useRecentCardsRaw();

  useEffect(() => {
    const start = Date.now();

    if (navigator.onLine) {
      getRecentCards()
        .then((data) => {
          setData(data);
        })
        .catch((err) => {
          console.error('error getting recent cards', err);
          setData(getRecentCardsLS());

          // retry loading if online
          // if (navigator.onLine) setTimeout(() => window.location.reload(), 5000);
        })
        .finally(() => {
          setTimeout(() => setLoading(false), Math.max(0, 150 - (Date.now() - start)));
        });
    } else {
      setData(getRecentCardsLS());
      setTimeout(() => setLoading(false), Math.max(0, 150 - (Date.now() - start)));
    }
  }, [setData]);

  useEffect(() => {
    if (Object.values(data).length === 0) return;
    if (navigator.onLine) updateRecentCards(data).catch((error) => console.error('error updating recent cards', error));
    updateRecentCardsLS(data);
  }, [data]);

  return {
    loading,
  };
}
