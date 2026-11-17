import { useEffect, useState } from 'react';

import { useRecentCardsRaw } from '../utils/state';
import { getRecentCards as getRecentCardsLS, updateRecentCards as updateRecentCardsLS } from './useLocalStorage';

const url = 'https://yugioh-fusions-storage.amcolash.workers.dev/recentCards';

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
    .then((response) => {
      if (!response.ok) {
        throw new Error(`Failed to fetch recent cards: ${response.status}`);
      }
      return response.json();
    })
    .then((res) => res?.cards || {});
}

export function useCloudflare() {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useRecentCardsRaw();

  useEffect(() => {
    const start = Date.now();

    if (navigator.onLine) {
      getRecentCards()
        .then((data) => {
          setData(data || getRecentCardsLS() || {});
        })
        .catch((err) => {
          console.error('error getting recent cards', err);
          setData(getRecentCardsLS() || {});
        })
        .finally(() => {
          setTimeout(() => setLoading(false), Math.max(0, 150 - (Date.now() - start)));
        });
    } else {
      setData(getRecentCardsLS() || {});
      setTimeout(() => setLoading(false), Math.max(0, 150 - (Date.now() - start)));
    }
  }, [setData]);

  useEffect(() => {
    if (!data || Object.values(data).length === 0) return;
    if (navigator.onLine) updateRecentCards(data).catch((error) => console.error('error updating recent cards', error));
    updateRecentCardsLS(data);
  }, [data]);

  return {
    loading,
  };
}
