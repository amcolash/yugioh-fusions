import { type ReactNode, use, useEffect, useState } from 'react';
import {
  useAddToHand,
  useDialogOpen,
  useFusions,
  useHand,
  useRecentCards,
  useSelectedCard,
  useShowStats,
} from 'utils/state';
import { useIsMobile } from 'utils/useIsMobile';
import { getStats, stats } from 'utils/util';

import { Background } from './Background';
import { AnimatedCard, Card } from './Card';

const statsSort = ['average_attack', 'average_defense', 'total_attack', 'total_defense', 'count'] as const;
const basicSort = ['attack', 'defense', 'id', 'level', 'name', 'usage'] as const;
type SortTypes = (typeof statsSort | typeof basicSort)[number];

export function RecentCards({ close, onAddToHand }: { onAddToHand?: () => void; close?: ReactNode }) {
  const [recentCards, setRecentCards] = useRecentCards();
  const [showStats] = useShowStats();
  const fusions = useFusions();
  const addToHand = useAddToHand();
  const [selectedCard, setSelectedCard] = useSelectedCard();

  const [sort, setSort] = useState<SortTypes>('usage');
  const [bouncingCards, setBouncingCards] = useState<{ id: number; uuid: number; start: DOMRect }[]>([]);

  const fusionStats = showStats ? getStats(fusions) : undefined;

  useEffect(() => {
    if (showStats) setSort('average_attack');
    else setSort('usage');
  }, [showStats]);

  return (
    <>
      <div className="grid gap-8 content-start h-full max-w-5xl">
        <h2 className="text-center">Recent Cards</h2>
        {close}

        <select onChange={(e) => setSort(e.target.value as SortTypes)} value={sort}>
          {(showStats ? statsSort : basicSort).map((sort) => (
            <option key={sort} value={sort}>
              {sort.replace('_', ' ').replace(/\b\w/g, (c) => c.toUpperCase())}
            </option>
          ))}
        </select>

        <div className="flex flex-wrap justify-center gap-3 overflow-auto h-full">
          {Object.entries(recentCards)
            .sort((a, b) => {
              if (sort === 'id') {
                return parseInt(a[0]) - parseInt(b[0]);
              } else if (sort === 'name') {
                return stats[a[0]].name.localeCompare(stats[b[0]].name);
              } else if (sort === 'level') {
                return stats[b[0]].level - stats[a[0]].level;
              } else if (sort === 'attack') {
                return stats[b[0]].attack - stats[a[0]].attack;
              } else if (sort === 'defense') {
                return stats[b[0]].defense - stats[a[0]].defense;
              } else if (sort === 'usage') {
                return b[1] - a[1];
              }

              if (fusionStats) {
                const statsA = fusionStats?.[a[0]];
                const statsB = fusionStats?.[b[0]];

                const avgAttackA = statsA ? statsA.totalAttack / statsA.count : 0;
                const avgAttackB = statsB ? statsB.totalAttack / statsB.count : 0;

                const avgDefenseA = statsA ? statsA.totalDefense / statsA.count : 0;
                const avgDefenseB = statsB ? statsB.totalDefense / statsB.count : 0;

                if (!statsA) return 1;
                if (!statsB) return -1;

                if (sort === 'average_attack') {
                  return avgAttackB - avgAttackA;
                } else if (sort === 'average_defense') {
                  return avgDefenseB - avgDefenseA;
                } else if (sort === 'total_attack') {
                  return statsB.totalAttack - statsA.totalAttack;
                } else if (sort === 'total_defense') {
                  return statsB.totalDefense - statsA.totalDefense;
                } else if (sort === 'count') {
                  return statsB.count - statsA.count;
                }
              }
            })
            .map(([id]) => {
              const { count, totalAttack, totalDefense } = fusionStats?.[id] || { totalAttack: 0, count: 0 };
              const avgAttack = count > 0 ? Math.floor(totalAttack / count) : 0;
              const avgDefense = count > 0 ? Math.floor(totalDefense / count) : 0;
              const showTotal = sort === 'total_attack' || sort === 'total_defense';

              return (
                <div
                  className={showStats && selectedCard === parseInt(id) ? 'ring-4 ring-blue-400 rounded' : undefined}
                  key={id}
                >
                  <Card
                    id={parseInt(id)}
                    size="x-small"
                    onClick={(e) => {
                      if (showStats) {
                        if (selectedCard === parseInt(id)) {
                          setSelectedCard(undefined);
                        } else {
                          setSelectedCard(parseInt(id));
                        }
                      } else {
                        addToHand({ id: parseInt(id), location: 'hand' });
                        onAddToHand?.();

                        const rect = (e.target as HTMLElement).getBoundingClientRect();
                        setBouncingCards((prev) => [...prev, { id: parseInt(id), uuid: Date.now(), start: rect }]);
                      }
                    }}
                    onRightClick={() => {
                      const newCards = { ...recentCards };
                      newCards[id] = -1;
                      setRecentCards(newCards);
                    }}
                    fuse={
                      fusionStats
                        ? `${count}\n${showTotal ? totalAttack : avgAttack}\n${showTotal ? totalDefense : avgDefense}`
                        : undefined
                    }
                  />
                </div>
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

export function RecentModal() {
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
              onAddToHand={() => {
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
