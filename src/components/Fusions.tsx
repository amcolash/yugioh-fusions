import { getCustomFusions, getGeneralFusions } from '../utils/util';
import { Card } from './Card';

export function Fusions({ hand }: { hand: number[] }) {
  const customFusions = getCustomFusions(hand);
  const generalFusions = getGeneralFusions(hand);

  const fusions = [...customFusions, ...generalFusions];

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
                <Card id={id} />
              </div>
            </li>
          ))}
        </ul>
      </>
    )
  );
}
