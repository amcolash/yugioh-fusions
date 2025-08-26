import { stats } from 'utils/util';

import { Background } from './Background';

export function StatsOverlay({ card }: { card: number }) {
  const cardStats = stats[card];
  return (
    <div className="absolute z-1 border border-gray-300 text-gray-300 text-left rounded p-2 overflow-hidden left-[calc(100%+12px)]">
      <Background type="absolute" />

      {Object.entries(cardStats)
        .sort((a, b) => {
          if (a[0] === 'id') return -1;
          if (b[0] === 'id') return 1;
          return a[0].localeCompare(b[0]);
        })
        .filter(
          (s) => s[0] === 'subtype' || s[0] === 'type' || s[0] === 'attack' || s[0] === 'defense' || s[0] === 'id'
        )
        .map(([key, value]) => (
          <div key={key} className="text-nowrap">
            <strong className="capitalize">{key}:</strong> {Array.isArray(value) ? value.join(', ') : value}
          </div>
        ))}
    </div>
  );
}
