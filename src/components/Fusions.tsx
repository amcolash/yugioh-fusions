import { Card } from "./Card";
import { getAllFusions } from "../utils/util";

export function Fusions({ hand }: { hand: number[] }) {
  const fusions = getAllFusions(hand);
  return (
    fusions.length > 0 && (
      <>
        <h2>Fusions</h2>
        <ul className="grid gap-4">
          {fusions.map(({ id, cards }) => (
            <li key={id + cards.join(",")}>
              <div className="flex gap-4 items-center">
                <Card id={cards[0]} /> +
                <Card id={cards[1]} />
                = <Card id={id} />
              </div>
            </li>
          ))}
        </ul>
      </>
    )
  );
}
