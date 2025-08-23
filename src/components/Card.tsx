import { statsById } from "../utils/util";

export function Card({ id, onClick }: { id: number; onClick?: () => void }) {
  const stats = statsById(id);

  const inner = <img src={`/images/${id}.png`} alt="" />;

  if (onClick) return <button onClick={onClick}>{inner}</button>;
  return inner;
}
