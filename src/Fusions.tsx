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
              {cards.map((card) => statsById(card)?.name).join(" + ")} = {statsById(id)?.name}
            </li>
          ))}
        </ul>
      </>
    )
  );
}
