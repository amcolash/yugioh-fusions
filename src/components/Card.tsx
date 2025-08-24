import { useState } from 'react';
import { friendlyName, stats } from 'utils/util';

import { StatsOverlay } from './StatsOverlay';

export function Card({ id, onClick }: { id: number; onClick?: () => void }) {
  const [showStats, setShowStats] = useState(false);
  const cardStats = stats[id];

  const inner = (
    <div
      className="grid justify-items-center gap-2 w-32 relative"
      onMouseEnter={() => setShowStats(true)}
      onMouseLeave={() => setShowStats(false)}
    >
      <div className="relative h-fit">
        <img
          className="rounded border-2 border-amber-950"
          src={`${import.meta.env.BASE_URL}/cropped/${id}.png`}
          alt=""
        />
        <span className="absolute bottom-0 left-0 rounded-tr-sm rounded-bl-sm bg-gray-900 opacity-60 px-1">#{id}</span>
      </div>
      <span className="text-center">{friendlyName(id)}</span>

      {showStats && cardStats.cardType === 'Monster' && <StatsOverlay card={id} />}
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
