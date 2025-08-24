import { useState } from 'react';

import { Background } from './Background';
import { Fusions } from './Fusions';
import { Hand } from './Hand';
import { Search } from './Search';

export function App() {
  const [hand, setHand] = useState<number[]>([]);

  const addToHand = (id: number) => {
    setHand((prev) => [...prev, id]);
  };

  return (
    <div className="grid gap-8 max-w-screen">
      <Background type="fixed" />
      <h1 className="text-center">Yugi-Oh! Fusion Combinations</h1>
      <Search addToHand={addToHand} />
      <Hand hand={hand} setHand={setHand} />
      <Fusions hand={hand} setHand={setHand} />
    </div>
  );
}
