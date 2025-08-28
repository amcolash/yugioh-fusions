import { useEffect, useState } from 'react';

// Not a big deal that this is exposed - not actually storing anything of any value, api is free, no CC
const pantryID = 'd3fde413-0898-4607-8b43-404392c50d61';
const url = `https://getpantry.cloud/apiv1/pantry/${pantryID}/basket/recentCards`;

export function updateRecentCards(cards: Record<string, number>): Promise<string | void> {
  return (
    fetch(url, {
      method: 'PUT',
      redirect: 'follow',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ cards }),
    })
      .then((response) => response.text())
      // .then((res) => console.log(res))
      .catch((error) => console.error('error updating recent cards', error))
  );
}

export function getRecentCards(): Promise<Record<string, number>> {
  return fetch(url, { redirect: 'follow', headers: { 'Content-Type': 'application/json' } })
    .then((response) => response.json())
    .then((res) => res.cards)
    .catch((error) => console.error('error getting recent cards', error));
}

function filterCards(data: Record<string, number>): Record<string, number> {
  const filtered: Record<string, number> = {};
  for (const [key, value] of Object.entries(data)) {
    if (value !== -1) filtered[key] = value;
  }
  return filtered;
}

export function usePantry() {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<Record<string, number>>({});

  useEffect(() => {
    const start = Date.now();
    getRecentCards()
      .then((data) => {
        const filtered = filterCards(data);
        setData(filtered);
        setTimeout(() => setLoading(false), Math.max(0, 250 - (Date.now() - start)));
      })
      .catch(() => {
        setTimeout(() => window.location.reload(), 2000);
      });
  }, []);

  return {
    loading,
    recentCards: data || {},
    setRecentCards: (data: Record<string, number>) => {
      updateRecentCards(data);

      const filtered = filterCards(data);
      setData(filtered);
    },
  };
}
