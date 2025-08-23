import { useState } from "react";
import { stats } from "./util";

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
              <button
                className="cursor-pointer"
                key={item.id}
                onClick={() => {
                  addToHand(item.id);
                  setSearch("");
                }}
              >
                {item.name}
              </button>
            </li>
          ))}
        </ul>
      )}

      {search.length > 2 && results.length === 0 && <p>No results found.</p>}
    </>
  );
}
