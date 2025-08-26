import { useState } from 'react';

import { Background } from './Background';
import { Fusions } from './Fusions';
import { Hand } from './Hand';
import { RecentModal } from './RecentModal';
import { Search } from './Search';

const recentCardsKey = 'recentCards';

export function App() {
  const [hand, setHand] = useState<number[]>([]);
  const [recentCards, setRecentCards] = useState<Record<string, number>>(
    localStorage.getItem(recentCardsKey) ? JSON.parse(localStorage.getItem(recentCardsKey)!) : {}
  );
  const [dialogOpen, setDialogOpen] = useState(false);

  const addToHand = (id: number) => {
    setHand((prev) => [...prev, id]);

    setRecentCards((prev) => {
      const newCards = { ...prev, [id]: (prev[id] || 0) + 1 };
      localStorage.setItem(recentCardsKey, JSON.stringify(newCards));
      return newCards;
    });
  };

  return (
    <div className="grid gap-8 max-w-screen">
      <Background type="fixed" />
      {hand.length === 0 && <h1 className="text-center">Yugi-Oh! Fusion Combinations</h1>}

      <Search addToHand={addToHand} />

      <RecentModal open={dialogOpen} setOpen={setDialogOpen} addToHand={addToHand} recentCards={recentCards} />
      <button onClick={() => setDialogOpen(true)}>Recent Cards</button>

      <Hand hand={hand} setHand={setHand} />
      <Fusions hand={hand} setHand={setHand} />
    </div>
  );
}
