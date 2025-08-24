import { Dispatch, SetStateAction } from 'react';

import { getFusions } from '../utils/util';
import { Card } from './Card';

export function Fusions({ hand, setHand }: { hand: number[]; setHand: Dispatch<SetStateAction<number[]>> }) {
  const fusions = getFusions(hand);

  return (
    fusions.length > 0 && (
      <>
        <h2>Fusions</h2>
        <ul className="grid gap-4">
          {fusions.map(({ id, cards }) => (
            <li key={id + cards.join(',')}>
              <div className="flex gap-4 items-center">
                <Card id={cards[0]} />
                <span className="text-3xl"> + </span>
                <Card id={cards[1]} />
                <span className="text-3xl"> = </span>
                <Card
                  id={id}
                  onClick={() => setHand((prev) => [...prev.filter((c) => c !== cards[0] && c !== cards[1]), id])}
                />
              </div>
            </li>
          ))}
        </ul>
      </>
    )
  );
}
