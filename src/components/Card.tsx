import { renderToStaticMarkup } from 'react-dom/server';
import { friendlyName, stats } from 'utils/util';

import { StatsOverlay } from './StatsOverlay';

export function Card({
  id,
  onClick,
  size = 'normal',
  fuse,
}: {
  id: number;
  onClick?: () => void;
  size?: '2x-small' | 'x-small' | 'small' | 'normal';
  fuse?: number;
}) {
  const cardStats = stats[id];

  let width = 'min-w-32';
  if (size === 'small') width = 'min-w-28';
  if (size === 'x-small') width = 'w-20 sm:w-24 min-w-20';
  if (size === '2x-small') width = 'w-16 sm:w-20';

  const showText = size === 'small' || size === 'normal';

  const inner = (
    <div className={`grid content-baseline justify-items-center gap-2 relative ${showText ? 'w-36' : ''}`}>
      <div
        className="relative h-fit"
        data-tooltip-id="stats-tooltip"
        data-tooltip-html={renderToStaticMarkup(<StatsOverlay card={id} />)}
      >
        <img
          className={`${width} rounded border-2 border-amber-950`}
          src={`${import.meta.env.BASE_URL}/cropped/${id}.png`}
          alt=""
        />

        {showText && (
          <span className="absolute bottom-0 left-0 rounded-tr-sm text-sm rounded-bl-sm bg-gray-900 opacity-60 px-1">
            #{id}
          </span>
        )}

        <span className="absolute bottom-0 right-0 rounded-tl-sm text-sm text-right rounded-br-sm bg-gray-900 opacity-60 px-1">
          {cardStats.attack}
          <br />
          {cardStats.defense}
        </span>

        {fuse > 0 && (
          <span className="absolute top-0 right-0 rounded-tr-sm text-sm rounded-bl-sm bg-sky-950 text-blue-400 border-2 border-gray-300 opacity-90 px-1.5">
            {fuse}
          </span>
        )}
      </div>
      {showText && <span className="text-center wrap-anywhere">{friendlyName(id)}</span>}

      {/* TODO: Improve the stats tooltip layout */}
      {/* {showStats && window.innerWidth > 875 && cardStats.cardType === 'Monster' && <StatsOverlay card={id} />} */}
    </div>
  );

  if (onClick)
    return (
      <button onClick={onClick} className={`${width} transparent flex !p-0`}>
        {inner}
      </button>
    );
  return inner;
}
