import createFuzzySearch from '@nozbe/microfuzz';
import { useState } from 'react';

import { stats, statsByName } from '../utils/util';
import { Card } from './Card';

const fuzzySearch = createFuzzySearch(Object.values(stats).map((s) => s.name));

export function Search({ addToHand }: { addToHand: (id: number) => void }) {
  const [search, setSearch] = useState('');

  const results = fuzzySearch(search).map((result) => statsByName(result.item));

  return (
    <>
      <input type="search" value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search..." />

      {search.length > 2 && results.length > 1 && (
        <ul className="flex flex-wrap justify-center gap-4">
          {results.map((item) => (
            <li key={item.id}>
              <Card
                id={item.id}
                onClick={() => {
                  addToHand(item.id);
                  setSearch('');
                }}
              />
            </li>
          ))}
        </ul>
      )}

      {search.length > 2 && results.length === 0 && <p>No results found.</p>}
    </>
  );
}
