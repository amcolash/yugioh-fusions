import { Dispatch, Fragment, SetStateAction } from 'react';

import { generateSecondaryFusions, getFusions } from '../utils/util';
import { Card } from './Card';

export function Fusions({ hand, setHand }: { hand: number[]; setHand: Dispatch<SetStateAction<number[]>> }) {
  // const fusions = getFusions(hand);
  const fusions = generateSecondaryFusions(hand);

  if (hand.length < 2) return null;

  return (
    <>
      <h2 className="text-center">Fusions</h2>
      {fusions.length > 0 ? (
        <ul className="grid gap-10 justify-center">
          {fusions.map(({ id, cards, secondary }) => (
            <Fragment key={id + cards.join(',') + (secondary ? ` + ${secondary.id}` : '')}>
              <li className="overflow-auto max-w-screen grid gap-2">
                <div className="flex gap-4 justify-center">
                  <Card id={cards[0]} small />
                  <span className="text-3xl mt-20"> + </span>
                  <Card id={cards[1]} small />
                  <span className="text-3xl mt-20"> = </span>
                  <Card id={id} small />
                  {secondary && (
                    <>
                      <span className="text-3xl mt-20"> + </span>
                      <Card id={secondary.cards.find((v) => v !== id)} small />
                      <span className="text-3xl mt-20"> = </span>
                      <Card id={secondary.id} small />
                    </>
                  )}
                </div>
              </li>
              <button
                className="p-1"
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
                Fuse
              </button>
            </Fragment>
          ))}
        </ul>
      ) : (
        <p className="text-center text-gray-400">No fusions found.</p>
      )}
    </>
  );
}
