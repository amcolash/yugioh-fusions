import { useState } from 'react';
import { friendlyName, stats } from 'utils/util';

import { StatsOverlay } from './StatsOverlay';

export function Card({ id, onClick, small = false }: { id: number; onClick?: () => void; small?: boolean }) {
  const [showStats, setShowStats] = useState(false);
  const cardStats = stats[id];

  const inner = (
    <div
      className="grid content-baseline justify-items-center gap-2 w-36 relative"
      onMouseEnter={() => setShowStats(true)}
      onMouseLeave={() => setShowStats(false)}
    >
      <div className="relative h-fit">
        <img
          className={`${small ? 'min-w-28' : 'min-w-32'} rounded border-2 border-amber-950`}
          src={`${import.meta.env.BASE_URL}/cropped/${id}.png`}
          alt=""
        />
        <span className="absolute bottom-0 left-0 rounded-tr-sm text-sm rounded-bl-sm bg-gray-900 opacity-60 px-1">
          #{id}
        </span>

        <span className="absolute bottom-0 right-0 rounded-tl-sm text-sm text-right rounded-br-sm bg-gray-900 opacity-60 px-1">
          {cardStats.attack}
          <br />
          {cardStats.defense}
        </span>
      </div>
      <span className="text-center wrap-anywhere">{friendlyName(id)}</span>

      {showStats && cardStats.cardType === 'Monster' && <StatsOverlay card={id} />}
    </div>
  );

  if (onClick)
    return (
      <button onClick={onClick} className={`${small ? 'min-w-28' : 'min-w-32'} transparent flex p-0`}>
        {inner}
      </button>
    );
  return inner;
}
