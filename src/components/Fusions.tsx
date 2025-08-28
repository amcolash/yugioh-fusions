import { Dispatch, Fragment, SetStateAction } from 'react';

import { generateSecondaryFusions, stats } from '../utils/util';
import { Card } from './Card';

export function Fusions({ hand, setHand }: { hand: SimpleCard[]; setHand: Dispatch<SetStateAction<SimpleCard[]>> }) {
  const fusions = generateSecondaryFusions(hand);

  if (hand.length < 2) return null;
  if (fusions.length === 0) return <p className="text-center text-gray-400">No fusions found.</p>;

  return (
    <>
      <hr />
      <ul className="grid gap-6">
        {fusions.map(({ id, cards, secondary }) => (
          <Fragment key={id + cards.join(',') + (secondary ? ` + ${secondary.id}` : '')}>
            <div className="grid gap-4">
              <li className="overflow-auto max-w-screen grid gap-2">
                <div className="flex gap-1 justify-center">
                  <Card id={cards[0]} size="x-small" fuse={1} />
                  <Card id={cards[1]} size="x-small" fuse={2} />
                  {secondary && <Card id={secondary.cards.find((v) => v !== id)} size="x-small" fuse={3} />}

                  <span className="text-3xl my-auto">→</span>
                  <Card id={secondary?.id || id} size="x-small" />
                </div>
              </li>
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
          </Fragment>
        ))}
      </ul>
    </>
  );
}
