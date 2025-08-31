import { List, RowComponentProps } from 'react-window';
import { useField, useFusions, useHand, useSelectedCard } from 'utils/state';
import { useIsMobile } from 'utils/useIsMobile';
import { getStats } from 'utils/util';

import { Card } from './Card';

const gap = 32;

export function Fusions() {
  const [hand] = useHand();
  const fusions = useFusions();
  const [selectedCard] = useSelectedCard();
  const isMobile = useIsMobile();

  if (hand.length < 2) return null;
  if (fusions.length === 0) return <p className="text-center text-gray-400">No fusions found.</p>;

  const filteredFusions = fusions.filter(({ cards, secondary }) => {
    if (!selectedCard) return true;
    return cards.includes(selectedCard) || secondary?.cards.includes(selectedCard);
  });

  return (
    <>
      <hr />
      <List
        className="sm:pr-2"
        rowComponent={FusionRow}
        rowCount={filteredFusions.length}
        rowHeight={(isMobile ? 170 : 190) + gap}
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

  const { cards, id, secondary } = fusions[index];

  cards.sort((a, b) => {
    const statsA = getStats(a, field);
    const statsB = getStats(b, field);
    const attackDiff = statsA.attack - statsB.attack;

    if (attackDiff !== 0) return attackDiff;
    return statsA.defense - statsB.defense;
  });

  return (
    <div className="grid gap-4 content-start" style={style}>
      {/* Extra level of wrapper to ensure everything visually works */}
      <div className="flex justify-center overflow-hidden">
        <div className="flex gap-1 overflow-x-auto">
          <Card id={cards[0]} size="x-small" fuse={1} />
          <Card id={cards[1]} size="x-small" fuse={2} />
          {secondary && <Card id={secondary.cards.find((v) => v !== id)} size="x-small" fuse={3} />}

          <span className="text-3xl my-auto">→</span>
          <Card id={secondary?.id || id} size="x-small" />
        </div>
      </div>

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
    </div>
  );
}
