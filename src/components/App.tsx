import { useState } from 'react';

import { Background } from './Background';
import { Fusions } from './Fusions';
import { Hand } from './Hand';
import { RecentModal } from './RecentModal';
import { Search } from './Search';

const recentCardsKey = 'recentCards';

const defaultHand: SimpleCard[] = [];
// const defaultHand: SimpleCard[] = [24, 486, 147].map((id) => ({ id, location: 'hand' }));

export function App() {
  const [hand, setHand] = useState<SimpleCard[]>(defaultHand);
  const [recentCards, setRecentCards] = useState<Record<string, number>>(
    localStorage.getItem(recentCardsKey) ? JSON.parse(localStorage.getItem(recentCardsKey)!) : {}
  );
  const [dialogOpen, setDialogOpen] = useState(false);

  const addToHand = (card: SimpleCard) => {
    setHand((prev) => [...prev, card]);

    setRecentCards((prev) => {
      const newCards = { ...prev, [card.id]: (prev[card.id] || 0) + 1 };
      localStorage.setItem(recentCardsKey, JSON.stringify(newCards));
      return newCards;
    });
  };

  return (
    <div className="grid gap-8 w-screen max-w-md">
      <Background type="fixed" />
      {hand.length === 0 && <h1 className="text-center">Yugi-Oh! Fusion Combinations</h1>}

      <Search addToHand={(id) => addToHand({ id, location: 'hand' })} />

      <RecentModal
        open={dialogOpen}
        setOpen={setDialogOpen}
        addToHand={(id) => addToHand({ id, location: 'hand' })}
        recentCards={recentCards}
      />
      <button onClick={() => setDialogOpen(true)}>Recent Cards</button>

      <Hand hand={hand} setHand={setHand} />
      <Fusions hand={hand} setHand={setHand} />
    </div>
  );
}
