import { Dispatch, Fragment, SetStateAction } from 'react';

import { generateSecondaryFusions, stats } from '../utils/util';
import { Card } from './Card';

export function Fusions({ hand, setHand }: { hand: number[]; setHand: Dispatch<SetStateAction<number[]>> }) {
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

                  <span className="text-3xl mt-10">→</span>
                  <Card id={secondary?.id || id} size="x-small" />
                </div>
              </li>
              <button
                onClick={() => {
                  if (!secondary) setHand((prev) => [...prev.filter((c) => c !== cards[0] && c !== cards[1]), id]);
                  else {
                    setHand((prev) => [
                      ...prev.filter(
                        (c) => c !== cards[0] && c !== cards[1] && c !== secondary.cards[0] && c !== secondary.cards[1]
                      ),
                      secondary.id,
                    ]);
                  }
                }}
              >
                Fuse ({stats[secondary?.id || id].attack})
              </button>
            </div>
          </Fragment>
        ))}
      </ul>
    </>
  );
}
