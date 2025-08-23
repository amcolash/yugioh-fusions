import { Card } from "./Card";
import { getAllFusions, statsById } from "./util";

export function Fusions({ hand }: { hand: number[] }) {
  const fusions = getAllFusions(hand);
  return (
    fusions.length > 0 && (
      <>
        <h2>Fusions</h2>
        <ul>
          {fusions.map(({ id, cards }) => (
            <li key={id}>
              <div className="flex gap-4">
                {cards.map((card) => (
                  <Card id={card} />
                ))}
                = <Card id={id} />
              </div>
            </li>
          ))}
        </ul>
      </>
    )
  );
}
