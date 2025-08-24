import { stats } from 'utils/util';

export function Card({ id, onClick }: { id: number; onClick?: () => void }) {
  const inner = (
    <div className="grid justify-items-center gap-2 max-w-32">
      <img src={`/cropped/${id}.png`} alt="" />
      <span className="text-center text-black">{stats[id].name}</span>
    </div>
  );

  if (onClick)
    return (
      <button onClick={onClick} className="transparent">
        {inner}
      </button>
    );
  return inner;
}
