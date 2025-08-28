import { Dispatch, type ReactNode, SetStateAction, useEffect, useState } from 'react';
import { useDialogOpen, useFusions, useHand, useRecentCards, useShowStats } from 'utils/state';
import { useIsMobile } from 'utils/useIsMobile';
import { getStats } from 'utils/util';

import { Background } from './Background';
import { AnimatedCard, Card } from './Card';

export function RecentCards({ addToHand, close }: { addToHand: (id: number) => void; close?: ReactNode }) {
  const [recentCards, setRecentCards] = useRecentCards();
  const [showStats] = useShowStats();
  const fusions = useFusions();

  const [bouncingCards, setBouncingCards] = useState<{ id: number; uuid: number; start: DOMRect }[]>([]);

  const stats = showStats ? getStats(fusions) : undefined;

  return (
    <>
      <div className="grid gap-6 content-start h-full max-w-5xl">
        <h2 className="text-center">Recent Cards</h2>
        {close}

        <div className="flex flex-wrap justify-center gap-3 overflow-auto h-full">
          {Object.entries(recentCards)
            .sort((a, b) => {
              const statsA = stats?.[a[0]];
              const statsB = stats?.[b[0]];

              if (stats) {
                if (!statsA) return 1;
                if (!statsB) return -1;

                return statsB.totalAttack / statsB.count - statsA.totalAttack / statsA.count;
              }
              return b[1] - a[1];
            })
            .map(([id]) => {
              const { count, totalAttack, totalDefense } = stats?.[id] || { totalAttack: 0, count: 0 };
              const avgAttack = count > 0 ? Math.floor(totalAttack / count) : 0;
              const avgDefense = count > 0 ? Math.floor(totalDefense / count) : 0;

              return (
                <Card
                  key={id}
                  id={parseInt(id)}
                  size="x-small"
                  onClick={(e) => {
                    addToHand(parseInt(id));
                    const rect = (e.target as HTMLElement).getBoundingClientRect();
                    setBouncingCards((prev) => [...prev, { id: parseInt(id), uuid: Date.now(), start: rect }]);
                  }}
                  onRightClick={() => {
                    const newCards = { ...recentCards };
                    newCards[id] = -1;
                    setRecentCards(newCards);
                  }}
                  fuse={stats ? `${count}\n${avgAttack}\n${avgDefense}` : undefined}
                />
              );
            })}

          {bouncingCards.map((c) => (
            <AnimatedCard
              key={c.id}
              id={c.id}
              startRect={c.start}
              onAnimationEnd={() => {
                setBouncingCards((prev) => prev.filter((b) => b.id !== c.id));
              }}
            />
          ))}
        </div>
      </div>
    </>
  );
}

export function RecentModal({ addToHand }: { addToHand: (id: number) => void }) {
  const [hand] = useHand();
  const [open, setOpen] = useDialogOpen();
  const mobile = useIsMobile();

  useEffect(() => {
    setOpen(false);
  }, [mobile]);

  return (
    <>
      <button onClick={() => setOpen(true)}>Recent Cards</button>
      <dialog
        open={open}
        onKeyDown={(e) => {
          if (e.key === 'Escape') setOpen(false);
        }}
        className="text-white z-1 p-4 inset-0 m-auto fixed w-full h-full overflow-hidden"
      >
        {open && (
          <>
            <Background type="fixed" />
            <RecentCards
              addToHand={(id) => {
                addToHand(id);

                if (Object.values(hand).filter((c) => c.location === 'hand').length >= 4) {
                  setTimeout(() => setOpen(false), 700);
                }
              }}
              close={
                <button className="danger absolute right-4 top-4 !py-0" onClick={() => setOpen(false)}>
                  X
                </button>
              }
            />
          </>
        )}
      </dialog>
    </>
  );
}
