import { type ReactNode, useEffect, useState } from 'react';
import { twMerge } from 'tailwind-merge';
import {
  useAddToHand,
  useDialogOpen,
  useExcludedCards,
  useField,
  useFusions,
  useHand,
  useRecentCards,
  useSelectedCard,
  useShowStats,
} from 'utils/state';
import { useIsMobile } from 'utils/useIsMobile';
import { getFusionStats, getStats } from 'utils/util';

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
  const [excludedCards, setExcludedCards] = useExcludedCards();
  const [field] = useField();

  const [sort, setSort] = useState<SortTypes>('name');
  const [bouncingCards, setBouncingCards] = useState<{ id: number; uuid: number; start: DOMRect }[]>([]);

  const fusionStats = showStats ? getFusionStats(fusions, field) : undefined;

  useEffect(() => {
    if (showStats) setSort('average_attack');
    else {
      setSort('name');
      setSelectedCard(undefined);
      setExcludedCards([]);
    }
  }, [showStats]);

  return (
    <>
      <div className="grid gap-8 content-start h-full max-w-5xl">
        <h2 className="text-center">Recent Cards ({Object.values(recentCards).length})</h2>
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
              const baseStatsA = getStats(parseInt(a[0]), field);
              const baseStatsB = getStats(parseInt(b[0]), field);

              if (sort === 'id') {
                return parseInt(a[0]) - parseInt(b[0]);
              } else if (sort === 'name') {
                return baseStatsA.name.localeCompare(baseStatsB.name);
              } else if (sort === 'level') {
                return baseStatsB.level - baseStatsA.level;
              } else if (sort === 'attack') {
                return baseStatsB.attack - baseStatsA.attack;
              } else if (sort === 'defense') {
                return baseStatsB.defense - baseStatsA.defense;
              } else if (sort === 'usage') {
                return b[1] - a[1];
              }

              if (fusionStats) {
                const fusionStatsA = fusionStats?.[a[0]];
                const fusionStatsB = fusionStats?.[b[0]];

                if (!fusionStatsA) return 1;
                if (!fusionStatsB) return -1;

                const { totalAttack: totalAttackA, totalDefense: totalDefenseA, count: countA } = fusionStatsA;
                const { totalAttack: totalAttackB, totalDefense: totalDefenseB, count: countB } = fusionStatsB;

                const avgAttackA = totalAttackA / countA;
                const avgAttackB = totalAttackB / countB;

                const avgDefenseA = totalDefenseA / countA;
                const avgDefenseB = totalDefenseB / countB;

                if (sort === 'average_attack') {
                  return avgAttackB - avgAttackA;
                } else if (sort === 'average_defense') {
                  return avgDefenseB - avgDefenseA;
                } else if (sort === 'total_attack') {
                  return totalAttackB - totalAttackA;
                } else if (sort === 'total_defense') {
                  return totalDefenseB - totalDefenseA;
                } else if (sort === 'count') {
                  return countB - countA;
                }
              }
            })
            .map(([id]) => {
              const { count, totalAttack, totalDefense } = fusionStats?.[id] || {
                totalAttack: 0,
                totalDefense: 0,
                count: 0,
              };

              const avgAttack = count > 0 ? Math.floor(totalAttack / count) : 0;
              const avgDefense = count > 0 ? Math.floor(totalDefense / count) : 0;
              const showTotal = sort === 'total_attack' || sort === 'total_defense';

              return (
                <div
                  className={twMerge(
                    showStats && selectedCard === parseInt(id) && 'ring-4 ring-blue-400 rounded',
                    showStats && excludedCards.includes(parseInt(id)) && 'ring-4 ring-red-400'
                  )}
                  key={id}
                >
                  <Card
                    id={parseInt(id)}
                    size="x-small"
                    onClick={(e) => {
                      if (showStats) {
                        if (excludedCards.includes(parseInt(id))) {
                          const newExcluded = excludedCards.filter((card) => card !== parseInt(id));
                          setExcludedCards(newExcluded);
                        }

                        if (selectedCard === parseInt(id)) {
                          setSelectedCard(undefined);
                        } else {
                          setSelectedCard(parseInt(id));
                        }
                      } else {
                        // Add timeout to instantly animate card and prevent stutter for re-calc fusions
                        setTimeout(() => {
                          addToHand({ id: parseInt(id), location: 'hand' });
                          onAddToHand?.();
                        }, 50);

                        const rect = (e.target as HTMLElement).getBoundingClientRect();
                        setBouncingCards((prev) => [...prev, { id: parseInt(id), uuid: Date.now(), start: rect }]);
                      }
                    }}
                    onRightClick={() => {
                      if (showStats) {
                        if (selectedCard === parseInt(id)) setSelectedCard(undefined);

                        if (excludedCards.includes(parseInt(id))) {
                          const newExcluded = excludedCards.filter((card) => card !== parseInt(id));
                          setExcludedCards(newExcluded);
                        } else {
                          const newExcluded = [...excludedCards, parseInt(id)];
                          setExcludedCards(newExcluded);
                        }
                      } else {
                        const newCards = { ...recentCards };
                        newCards[id] = -1;
                        setRecentCards(newCards);
                      }
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
