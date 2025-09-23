import { search as fuzzy } from 'fast-fuzzy';
import { useDebounce } from 'hooks/useDebounce';
import { RowComponentProps } from 'react-window';

import { useAddToHand, useField, useSearch, useShowStats } from '../utils/state';
import { cardList, fieldTypes, getStats, statsByName } from '../utils/util';
import { Card } from './Card';
import { Select } from './Select';

export function Search() {
  const addToHand = useAddToHand();
  const [field, setField] = useField();
  const [search, setSearch] = useSearch();
  const [showStats] = useShowStats();
  const { value: debouncedSearch, waiting } = useDebounce(search);

  if (showStats) return null;

  // Show all cards, but show monsters first
  let results: Stats[] = fuzzy(debouncedSearch, cardList)
    .map((name, index) => ({ ...statsByName(name), index }))
    .sort((a, b) => a.index - b.index);

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
            if (e.key === 'Enter' && results.length > 0 && results[0].cardType === 'Monster') {
              addToHand({ id: results[0].id, location: 'hand' });
              setSearch('');
            }
          }}
          placeholder="Search by name or id"
        />

        <Select
          value={field}
          setValue={setField}
          options={fieldTypes.map((f) => ({
            label: f,
            value: f,
            icon: `${import.meta.env.BASE_URL}field/${f}.png`,
          }))}
        />
      </div>
      {!waiting && search.length > 0 && (
        <>
          {(results.length === 1 || (search.length > 2 && results.length > 0)) && (
            <ul className="flex flex-wrap justify-center gap-4 overflow-y-auto pt-1">
              {results.map((item) => (
                <li key={item.id}>
                  <Card
                    id={item.id}
                    disabled={item.cardType !== 'Monster'}
                    onClick={
                      item.cardType === 'Monster'
                        ? () => {
                            addToHand({ id: item.id, location: 'hand' });
                            setSearch('');
                          }
                        : undefined
                    }
                  />
                </li>
              ))}
            </ul>
          )}

          {(search.length <= 2 || results.length === 0) && (
            <p className="pt-6 text-center text-gray-400">No results found.</p>
          )}
        </>
      )}
    </>
  );
}

// TODO: virtualize this as things slow down with large results
function SearchResult({
  result,
  style,
}: RowComponentProps<{
  result: Stats;
}>) {
  const addToHand = useAddToHand();
  const [, setSearch] = useSearch();

  return (
    <Card
      id={result.id}
      disabled={result.cardType !== 'Monster'}
      onClick={
        result.cardType === 'Monster'
          ? () => {
              addToHand({ id: result.id, location: 'hand' });
              setSearch('');
            }
          : undefined
      }
      style={style}
    />
  );
}
