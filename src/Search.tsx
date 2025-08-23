import { useState } from "react";
import { stats, statsByName } from "./util";
import { Card } from "./Card";
import { fuzzySubstringMatch } from "./fuzzy-search";

export function Search({ addToHand }: { addToHand: (id: number) => void }) {
  const [search, setSearch] = useState("");

  const results = fuzzySubstringMatch(
    search,
    Object.values(stats).map((s) => s.name)
  ).map((name) => statsByName(name));

  return (
    <>
      <input type="search" value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search..." />

      {search.length > 2 && results.length > 1 && (
        <ul className="grid gap-1">
          {results.map((item) => (
            <li key={item.id}>
              <Card
                id={item.id}
                onClick={() => {
                  addToHand(item.id);
                  setSearch("");
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
