import { useEffect, useState } from 'react';

// Not a big deal that this is exposed - not actually storing anything of any value, api is free, no CC
const pantryID = 'd3fde413-0898-4607-8b43-404392c50d61';
const url = `https://getpantry.cloud/apiv1/pantry/${pantryID}/basket/recentCards`;

export function updateRecentCards(cards: Record<string, number>): Promise<string | void> {
  const body = JSON.stringify({ cards });
  console.log(body);

  return fetch(url, { method: 'PUT', redirect: 'follow', headers: { 'Content-Type': 'application/json' }, body })
    .then((response) => response.text())
    .then((res) => console.log(res))
    .catch((error) => console.error('error updating recent cards', error));
}

export function getRecentCards(): Promise<Record<string, number>> {
  return fetch(url, { redirect: 'follow', headers: { 'Content-Type': 'application/json' } })
    .then((response) => response.json())
    .then((res) => res.cards)
    .catch((error) => console.error('error getting recent cards', error));
}

export function usePantry() {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<Record<string, number>>({});

  useEffect(() => {
    getRecentCards()
      .then((data) => {
        setData(data);
        setTimeout(() => setLoading(false), 1000);
      })
      .catch(() => {
        window.location.reload();
      });
  }, []);

  return {
    loading,
    recentCards: data || {},
    setRecentCards: (data: Record<string, number>) => {
      setData(data);
      updateRecentCards(data);
    },
  };
}
