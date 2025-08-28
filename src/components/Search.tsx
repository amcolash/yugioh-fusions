// import createFuzzySearch from '@nozbe/microfuzz';
import { search as fuzzy } from 'fast-fuzzy';
import { useState } from 'react';
import { useAddToHand } from 'utils/state';

import { friendlyName, stats, statsByName } from '../utils/util';
import { Card } from './Card';

const searchList = Object.values(stats)
  .filter((s) => s.cardType === 'Monster')
  .map((s) => friendlyName(s.id));

export function Search() {
  const addToHand = useAddToHand();
  const [search, setSearch] = useState('');

  let results: Stats[] = fuzzy(search, searchList).map((name) => statsByName(name));

  if (search.match(/^\d+$/g)) results = [stats[search.trim()]];

  return (
    <>
      <input
        type="search"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        onKeyDown={(e) => {
          // On enter, add first result to hand
          if (e.key === 'Enter' && results.length > 0) {
            addToHand({ id: results[0].id, location: 'hand' });
            setSearch('');
          }
        }}
        placeholder="Search by name or id"
      />

      {(results.length === 1 || (search.length > 2 && results.length > 1)) && (
        <ul className="flex flex-wrap justify-center gap-4">
          {results.map((item) => (
            <li key={item.id}>
              <Card
                id={item.id}
                onClick={() => {
                  addToHand({ id: item.id, location: 'hand' });
                  setSearch('');
                }}
              />
            </li>
          ))}
        </ul>
      )}

      {search.length > 2 && results.length === 0 && <p className="text-center text-gray-400 pt-6">No results found.</p>}
    </>
  );
}
