import { useState } from 'react';

import { Fusions } from './Fusions';
import { Hand } from './Hand';
import { Search } from './Search';

export function App() {
  const [hand, setHand] = useState<number[]>([138, 161, 161]);

  const addToHand = (id: number) => {
    setHand((prev) => [...prev, id]);
  };

  return (
    <div className="grid gap-4">
      <h1>Yugi-Oh Fusion Combinations</h1>
      <Search addToHand={addToHand} />
      <Hand hand={hand} setHand={setHand} />
      <Fusions hand={hand} setHand={setHand} />
    </div>
  );
}
