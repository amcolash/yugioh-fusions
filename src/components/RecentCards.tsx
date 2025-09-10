import { type ReactNode, useEffect, useState } from 'react';
import { twMerge } from 'tailwind-merge';

import { Breakpoint, useBreakpoint } from '../hooks/useBreakpoint';
import {
  useAddToHand,
  useExcludedCards,
  useField,
  useFusionFilter,
  useFusions,
  useHand,
  useRecentCards,
  useSelectedCard,
  useShowStats,
} from '../utils/state';
import { approximateRatio, getDeckStats, getFusionStats, getStats } from '../utils/util';
import { AnimatedCard, Card } from './Card';
import { Modal } from './Modal';
import { Select } from './Select';

const statsSort = ['average_attack', 'average_defense', 'total_attack', 'total_defense', 'count'] as const;
const basicSort = ['attack', 'defense', 'id', 'level', 'name', 'usage'] as const;
type SortTypes = (typeof statsSort | typeof basicSort)[number];

export function RecentCards({ onAddToHand }: { onAddToHand?: () => void; close?: ReactNode }) {
  const [recentCards, setRecentCards] = useRecentCards();
  const [showStats] = useShowStats();
  const fusions = useFusions();
  const addToHand = useAddToHand();
  const [selectedCard, setSelectedCard] = useSelectedCard();
  const [excludedCards, setExcludedCards] = useExcludedCards();
  const [field] = useField();
  const [fusionFilter, setFusionFilter] = useFusionFilter();
  const breakpoint = useBreakpoint();

  const [sort, setSort] = useState<SortTypes>('name');
  const [bouncingCards, setBouncingCards] = useState<{ id: number; uuid: number; start: DOMRect }[]>([]);

  const fusionStats = getFusionStats(fusions, field);
  const deckStats = getDeckStats(fusions, field);

  useEffect(() => {
    if (showStats) setSort('average_attack');
    else {
      setSort('name');
      setSelectedCard(undefined);
      setExcludedCards([]);
    }
  }, [showStats, setSelectedCard, setExcludedCards]);

  const header = showStats
    ? `Fusion Stats (Attack ${deckStats.attack}, Defense ${deckStats.defense})`
    : `Recent Cards (${Object.values(recentCards).length})`;

  return (
    <>
      <div className="grid gap-8 content-start h-full max-w-5xl">
        <h2 className="text-center px-8">{header}</h2>
        <div className="flex flex-wrap xl:flex-nowrap gap-x-8 gap-y-4">
          <Select
            label="Sort By"
            value={sort}
            setValue={setSort}
            options={(showStats ? statsSort : basicSort).map((sort) => ({
              label: sort.replace('_', ' ').replace(/\b\w/g, (c) => c.toUpperCase()),
              value: sort,
            }))}
            fullWidth
          />

          {showStats && (
            <Select
              label="Fusion Type"
              value={fusionFilter}
              setValue={setFusionFilter}
              options={[
                { label: 'Two Card', value: 'primary' },
                { label: 'Three Card', value: 'secondary' },
                { label: 'All', value: 'all' },
              ]}
              fullWidth={breakpoint < Breakpoint.xl}
            />
          )}
        </div>

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

              if (showStats) {
                const fusionStatsA = fusionStats[a[0]];
                const fusionStatsB = fusionStats[b[0]];

                if (!fusionStatsA) return 1;
                if (!fusionStatsB) return -1;

                const {
                  totalAttack: totalAttackA,
                  totalDefense: totalDefenseA,
                  primary: primaryA,
                  secondary: secondaryA,
                } = fusionStatsA;
                const {
                  totalAttack: totalAttackB,
                  totalDefense: totalDefenseB,
                  primary: primaryB,
                  secondary: secondaryB,
                } = fusionStatsB;

                const countA = primaryA + secondaryA;
                const countB = primaryB + secondaryB;

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
              const { primary, secondary, totalAttack, totalDefense } = fusionStats[id] || {
                totalAttack: 0,
                totalDefense: 0,
                primary: 0,
                secondary: 0,
              };

              const count = primary + secondary;

              const avgAttack = count > 0 ? Math.floor(totalAttack / count) : 0;
              const avgDefense = count > 0 ? Math.floor(totalDefense / count) : 0;
              const showTotal = sort === 'total_attack' || sort === 'total_defense';

              const stats = [];
              if (showStats) {
                if (fusionFilter === 'all') {
                  stats.push(`Fusion Ratio: ${approximateRatio(primary, secondary)}`);
                  stats.push(`Secondary / Tertiary Fusions: ${primary}/${secondary}`);
                }
                if (fusionFilter === 'primary') stats.push(`Primary Fusions: ${primary}`);
                if (fusionFilter === 'secondary') stats.push(`Secondary Fusions: ${secondary}`);

                if (showTotal) {
                  stats.push(`Avg Attack: ${avgAttack}`);
                  stats.push(`Avg Defense: ${avgDefense}`);
                } else {
                  stats.push(`Total Attack: ${totalAttack}`);
                  stats.push(`Total Defense: ${totalDefense}`);
                }
              }

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
                    stats={stats}
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

export function RecentCardsMobile() {
  const [hand] = useHand();
  const [open, setOpen] = useState(false);

  return (
    <>
      <button onClick={() => setOpen(true)}>Recent Cards</button>
      <Modal open={open} setOpen={setOpen}>
        <RecentCards
          onAddToHand={() => {
            if (Object.values(hand).filter((c) => c.location === 'hand').length >= 4) {
              setTimeout(() => setOpen(false), 400);
            }
          }}
        />
      </Modal>
    </>
  );
}
