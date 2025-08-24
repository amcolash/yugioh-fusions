import { Dispatch, SetStateAction } from 'react';

import { generateSecondaryFusions, getFusions } from '../utils/util';
import { Card } from './Card';

export function Fusions({ hand, setHand }: { hand: number[]; setHand: Dispatch<SetStateAction<number[]>> }) {
  // const fusions = getFusions(hand);
  const fusions = generateSecondaryFusions(hand);

  return (
    fusions.length > 0 && (
      <>
        <h2>Fusions</h2>
        <ul className="grid gap-4">
          {fusions.map(({ id, cards, secondary }) => (
            <li
              className="overflow-auto max-w-screen"
              key={id + cards.join(',') + (secondary ? ` + ${secondary.id}` : '')}
            >
              <div className="flex gap-4">
                <Card id={cards[0]} small />
                <span className="text-3xl mt-20"> + </span>
                <Card id={cards[1]} small />
                <span className="text-3xl mt-20"> = </span>
                <Card
                  id={id}
                  small
                  onClick={() => setHand((prev) => [...prev.filter((c) => c !== cards[0] && c !== cards[1]), id])}
                />
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
          ))}
        </ul>
      </>
    )
  );
}
