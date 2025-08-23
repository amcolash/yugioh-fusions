import { useState } from "react";
import { stats } from "./util";
import { Card } from "./Card";

export function Search({ addToHand }: { addToHand: (id: number) => void }) {
  const [search, setSearch] = useState("");

  const results = Object.values(stats).filter((item) => item.name.toLowerCase().includes(search.toLowerCase()));

  return (
    <>
      <input type="search" value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search..." />

      {search.length > 2 && results.length > 1 && (
        <ul className="grid gap-1">
          {results.map((item) => (
            <li>
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
