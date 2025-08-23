import { useState } from "react";
import { Hand } from "./Hand";
import { Search } from "./Search";
import { Fusions } from "./Fusions";

export function App() {
  const [hand, setHand] = useState<number[]>([]);

  const addToHand = (id: number) => {
    setHand((prev) => [...prev, id]);
  };

  return (
    <div className="grid gap-4">
      <h1>Yugi-Oh Fusion Combinations</h1>
      <Search addToHand={addToHand} />
      <Hand hand={hand} setHand={setHand} />
      <Fusions hand={hand} />
    </div>
  );
}
