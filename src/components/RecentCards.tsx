import { Dispatch, type ReactNode, SetStateAction, useState } from 'react';

import { Background } from './Background';
import { AnimatedCard, Card } from './Card';

// {"2":1,"9":41,"23":11,"24":7,"32":17,"40":2,"44":18,"46":11,"97":16,"107":14,"118":9,"133":1,"157":8,"174":17,"187":11,"188":14,"233":1,"240":15,"247":11,"265":11,"267":16,"268":17,"387":18,"394":11,"395":17,"399":35,"410":10,"420":17,"421":9,"458":2,"460":1,"461":21,"486":21,"488":13,"504":12,"538":10,"544":15,"558":11,"573":20,"598":9,"611":11,"644":8}

export function RecentCards({
  addToHand,
  recentCards,
  setRecentCards,
  close,
  stats,
}: {
  addToHand: (id: number) => void;
  recentCards: Record<string, number>;
  setRecentCards: Dispatch<SetStateAction<Record<string, number>>>;
  close?: ReactNode;
  stats: Record<string, FusionStats>;
}) {
  const [bouncingCards, setBouncingCards] = useState<{ id: number; uuid: number; start: DOMRect }[]>([]);

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

export function RecentModal({
  open,
  setOpen,
  hand,
  addToHand,
  recentCards,
  setRecentCards,
  stats,
}: {
  open: boolean;
  setOpen: (open: boolean) => void;
  hand: SimpleCard[];
  addToHand: (id: number) => void;
  recentCards: Record<string, number>;
  setRecentCards: (cards: Record<string, number>) => void;
  stats: Record<string, FusionStats>;
}) {
  return (
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
                setOpen(false);
              }
            }}
            recentCards={recentCards}
            setRecentCards={setRecentCards}
            close={
              <button className="danger absolute right-4 top-4 !py-0" onClick={() => setOpen(false)}>
                X
              </button>
            }
            stats={stats}
          />
        </>
      )}
    </dialog>
  );
}
