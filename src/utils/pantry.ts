import { useEffect, useState } from 'react';

import { useRecentCardsRaw } from './state';
import { filterRecentCards } from './util';

// {
//   "1": -1,
//   "2": -1,
//   "4": 1,
//   "9": 63,
//   "23": 16,
//   "24": 10,
//   "32": 26,
//   "40": 4,
//   "44": 27,
//   "46": 19,
//   "97": 22,
//   "107": 17,
//   "118": 12,
//   "133": -1,
//   "143": 1,
//   "152": 2,
//   "157": 11,
//   "174": 20,
//   "187": 14,
//   "188": 22,
//   "190": 2,
//   "191": 8,
//   "233": 4,
//   "240": -1,
//   "247": 16,
//   "265": 15,
//   "267": 22,
//   "268": 22,
//   "387": 28,
//   "394": 16,
//   "395": 26,
//   "399": 55,
//   "410": 14,
//   "420": 25,
//   "421": 11,
//   "458": -1,
//   "460": -1,
//   "461": 34,
//   "486": 31,
//   "488": 19,
//   "504": -1,
//   "534": -1,
//   "538": -1,
//   "544": 20,
//   "558": 17,
//   "573": 32,
//   "598": 12,
//   "611": -1,
//   "644": 13
// }

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

export function usePantry() {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useRecentCardsRaw();

  useEffect(() => {
    const start = Date.now();
    getRecentCards()
      .then((data) => {
        const filtered = filterRecentCards(data);
        setData(filtered);
        setTimeout(() => setLoading(false), Math.max(0, 250 - (Date.now() - start)));
      })
      .catch(() => {
        setTimeout(() => window.location.reload(), 3000);
      });
  }, []);

  useEffect(() => {
    if (Object.values(data).length === 0) return;
    updateRecentCards(data);
  }, [data]);

  return {
    loading,
  };
}
