import { type ReactNode } from 'react';

import { Background } from './Background';
import { Card } from './Card';

export function RecentCards({
  addToHand,
  recentCards,
  close,
  stats,
}: {
  addToHand: (id: number) => void;
  recentCards: Record<string, number>;
  close?: ReactNode;
  stats: Record<string, FusionStats>;
}) {
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

              if (statsA && statsB) return statsB.totalAttack / statsB.count - statsA.totalAttack / statsA.count;
              return b[1] - a[1];
            })
            .map(([id]) => {
              const { count, totalAttack, totalDefense } = stats[id] || {};

              return (
                <Card
                  key={id}
                  id={parseInt(id)}
                  size="x-small"
                  onClick={() => addToHand(parseInt(id))}
                  fuse={
                    count
                      ? `${count}\n${Math.floor(totalAttack / count)}\n${Math.floor(totalDefense / count)}`
                      : undefined
                  }
                />
              );
            })}
        </div>
      </div>
    </>
  );
}

export function RecentModal({
  open,
  setOpen,
  addToHand,
  recentCards,
  stats,
}: {
  open: boolean;
  setOpen: (open: boolean) => void;
  addToHand: (id: number) => void;
  recentCards: Record<string, number>;
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
      <Background type="fixed" />
      <RecentCards
        addToHand={(id) => {
          addToHand(id);
          setOpen(false);
        }}
        recentCards={recentCards}
        close={
          <button className="danger absolute right-4 top-4 !py-0" onClick={() => setOpen(false)}>
            X
          </button>
        }
        stats={stats}
      />
    </dialog>
  );
}
