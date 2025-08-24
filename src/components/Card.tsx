import { friendlyName, stats } from 'utils/util';

export function Card({ id, onClick }: { id: number; onClick?: () => void }) {
  const cardStats: Stats = stats[id];

  const inner = (
    <div className="grid justify-items-center gap-2 max-w-32">
      <div className="relative">
        <img className="rounded border-2 border-amber-950" src={`/cropped/${id}.png`} alt="" />
        <span className="absolute bottom-0 left-0 rounded-tr-sm rounded-bl-sm bg-gray-900 opacity-60 text-white px-1">
          #{id}
        </span>
      </div>
      <div className="grid">
        <span className="text-center text-black">{friendlyName(id)}</span>
        {cardStats.cardType === 'Monster' && (
          <span className="text-center text-black">
            {cardStats.attack} / {cardStats.defense}
          </span>
        )}
      </div>
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
