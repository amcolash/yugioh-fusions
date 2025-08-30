// import createFuzzySearch from '@nozbe/microfuzz';
import { search as fuzzy } from 'fast-fuzzy';
import { useState } from 'react';
import { useAddToHand, useField } from 'utils/state';

import { Field, fieldTypes, getFieldIcon, getStats, monsterList, statsByName } from '../utils/util';
import { Card } from './Card';

export function Search() {
  const addToHand = useAddToHand();
  const [field, setField] = useField();
  const [search, setSearch] = useState('');

  let results: Stats[] = fuzzy(search, monsterList).map((name) => statsByName(name));

  if (search.match(/^\d+$/g)) results = [getStats(parseInt(search.trim()), field)];

  return (
    <>
      <div className="flex gap-4">
        <input
          type="search"
          value={search}
          className="w-full"
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
        <select value={field} onChange={(e) => setField(e.target.value as Field)}>
          {fieldTypes.map((f) => (
            <option key={f} value={f}>
              {getFieldIcon(f)}
            </option>
          ))}
        </select>
      </div>

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
