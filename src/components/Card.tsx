export function Card({ id, onClick }: { id: number; onClick?: () => void }) {
  const inner = <img src={`/cropped/${id}.png`} alt="" />;

  if (onClick) return <button onClick={onClick}>{inner}</button>;
  return inner;
}
