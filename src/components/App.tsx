import { useEffect, useState } from 'react';
import { Tooltip } from 'react-tooltip';
import { useIsMobile } from 'utils/useIsMobile';

import { usePantry } from '../utils/pantry';
import { Background } from './Background';
import { Fusions } from './Fusions';
import { Hand } from './Hand';
import { Loader } from './Loader';
import { RecentCards, RecentModal } from './RecentCards';
import { Search } from './Search';

export const recentCardsKey = 'recentCards';

const defaultHand: SimpleCard[] = [];
// const defaultHand: SimpleCard[] = [24, 486, 147].map((id) => ({ id, location: 'hand' }));

export function App() {
  const mobile = useIsMobile();
  const { loading, recentCards, setRecentCards } = usePantry();

  const [hand, setHand] = useState<SimpleCard[]>(defaultHand);
  const [dialogOpen, setDialogOpen] = useState(false);

  useEffect(() => {
    setDialogOpen(false);
  }, [mobile]);

  const addToHand = (card: SimpleCard) => {
    setHand((prev) => [...prev, card]);

    // Update recent cards
    const newCards: Record<string, number> = { ...recentCards, [card.id]: (recentCards[card.id] || 0) + 1 };
    const entries = Object.entries(newCards).sort((a, b) => a[1] - b[1]);

    // Keep the most used 50 cards (slightly more than a deck)
    while (entries.length > 50) {
      delete newCards[entries.shift()![0]];
    }

    localStorage.setItem(recentCardsKey, JSON.stringify(newCards));
    setRecentCards(newCards);
  };

  return (
    <>
      <Background type="fixed" />
      <Loader loading={loading} />

      <div
        className={`flex gap-12 w-full justify-center transition-opacity duration-1000 delay-700 ${loading ? 'opacity-0' : 'opacity-100'}`}
      >
        <div className="grid gap-8 content-start w-screen max-w-md">
          {(hand.length === 0 || !mobile) && <h1 className="text-center">Yugi-Oh! Fusion Combinations</h1>}

          <Search addToHand={(id) => addToHand({ id, location: 'hand' })} />

          {mobile && (
            <>
              <RecentModal
                open={dialogOpen}
                setOpen={setDialogOpen}
                addToHand={(id) => addToHand({ id, location: 'hand' })}
                recentCards={recentCards}
              />
              <button onClick={() => setDialogOpen(true)}>Recent Cards</button>
            </>
          )}

          <Hand hand={hand} setHand={setHand} recentCards={recentCards} />
          <Fusions hand={hand} setHand={setHand} />
        </div>

        {!mobile && (
          <>
            <div className={hand.length > 0 && Object.keys(recentCards).length > 0 ? 'border-l border-sky-800' : ''} />
            <RecentCards addToHand={(id) => addToHand({ id, location: 'hand' })} recentCards={recentCards} />
            <Tooltip id="stats-tooltip" border="1px solid var(--color-gray-500)" opacity={0.95} />
          </>
        )}
      </div>
    </>
  );
}
