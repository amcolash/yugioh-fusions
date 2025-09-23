import { useMemo } from 'react';
import { List, RowComponentProps } from 'react-window';

import { useIsMobile } from '../hooks/useIsMobile';
import { useField, useFusions, useHand, useSelectedCard, useShowStats } from '../utils/state';
import { getStats } from '../utils/util';
import { Card } from './Card';

const gap = 32;

export function Fusions() {
  const [hand] = useHand();
  const fusions = useFusions();
  const [selectedCard] = useSelectedCard();
  const [showStats] = useShowStats();
  const isMobile = useIsMobile();

  const filteredFusions = useMemo(
    () =>
      fusions.filter(({ id, cards, secondary }) => {
        if (!selectedCard) return true;
        return (cards.includes(selectedCard) || secondary?.cards.includes(selectedCard)) && id !== selectedCard;
      }),
    [fusions, selectedCard]
  );

  if (hand.length < 2) return null;
  if (fusions.length === 0) return <p className="text-center text-gray-400">No fusions found.</p>;

  let height = (isMobile ? 170 : 190) + gap;
  if (showStats) height -= gap * 2;

  return (
    <>
      <hr />
      <List
        className="sm:pr-2"
        rowComponent={FusionRow}
        rowCount={filteredFusions.length}
        rowHeight={height}
        rowProps={{ fusions: filteredFusions }}
      />
    </>
  );
}

function FusionRow({
  index,
  fusions,
  style,
}: RowComponentProps<{
  fusions: FusionRecord[];
}>) {
  const [hand, setHand] = useHand();
  const [field] = useField();
  const [showStats] = useShowStats();

  const { cards, id, secondary } = fusions[index];

  cards.sort((a, b) => {
    const statsA = getStats(a, field);
    const statsB = getStats(b, field);
    const attackDiff = statsA.attack - statsB.attack;

    if (attackDiff !== 0) return attackDiff;
    return statsA.defense - statsB.defense;
  });

  return (
    <div className="grid content-start gap-4" style={style} key={[...cards, secondary?.cards].join('|')}>
      {/* Extra level of wrapper to ensure everything visually works */}
      <div className="flex justify-center overflow-hidden">
        <div className="flex gap-1 overflow-x-auto">
          <Card id={cards[0]} size="x-small" fuse={1} />
          <Card id={cards[1]} size="x-small" fuse={2} />
          {secondary && <Card id={secondary.cards.find((v) => v !== id)} size="x-small" fuse={3} />}

          <span className="my-auto text-3xl">→</span>
          <Card id={secondary?.id || id} size="x-small" />
        </div>
      </div>

      {!showStats && (
        <button
          onClick={() => {
            // Favor fusing with cards on the field vs in hand. Might be excessive to do for now.
            const sorted = hand.sort((a, b) => {
              if (a.location === 'field' && b.location === 'hand') return -1;
              if (a.location === 'hand' && b.location === 'field') return 1;
              return 0;
            });

            const card1Index = sorted.findIndex((c) => c.id === cards[0]);
            const card2Index = sorted.findIndex((c) => c.id === cards[1]);
            const card3Index = secondary
              ? sorted.findIndex((c) => c.id === secondary.cards[0] || c.id === secondary.cards[1])
              : -1;

            setHand(() => {
              const newHand = sorted.filter((_, i) => i !== card1Index && i !== card2Index && i !== card3Index);
              newHand.push({ id: secondary?.id || id, location: 'field' });
              return newHand;
            });
          }}
        >
          Fuse
        </button>
      )}
    </div>
  );
}
