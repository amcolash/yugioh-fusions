import { MouseEventHandler } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { useField } from 'utils/state';
import { getFieldBonus, getStats } from 'utils/util';

import { StatsOverlay } from './StatsOverlay';

export function Card({
  id,
  onClick,
  onRightClick,
  size = 'normal',
  fuse,
  showStats = true,
}: {
  id: number;
  onClick?: MouseEventHandler<HTMLButtonElement>;
  onRightClick?: () => void;
  size?: '2x-small' | 'x-small' | 'small' | 'normal';
  fuse?: number | string;
  showStats?: boolean;
}) {
  const [field] = useField();
  const cardStats = getStats(id, field);
  const bonus = getFieldBonus(id, field);
  const bonusClass = bonus > 0 ? 'text-green-400' : bonus < 0 ? 'text-red-500' : 'text-white';

  let width = 'min-w-32';
  if (size === 'small') width = 'min-w-28';
  if (size === 'x-small') width = 'w-20 sm:w-24 min-w-20';
  if (size === '2x-small') width = 'w-16 sm:w-20';

  const showText = size === 'small' || size === 'normal';

  const inner = (
    <div className={`grid content-baseline justify-items-center gap-2 relative ${showText ? 'w-36' : ''}`}>
      <div
        className="relative h-fit"
        data-tooltip-id={showStats ? 'stats-tooltip' : undefined}
        data-tooltip-html={renderToStaticMarkup(<StatsOverlay card={id} />)}
        data-tooltip-delay-show={1000}
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

        <span
          className={`absolute bottom-0 right-0 rounded-tl-sm text-sm text-right rounded-br-sm bg-gray-900 opacity-60 px-1 ${bonusClass}`}
        >
          {cardStats.attack}
          <br />
          {cardStats.defense}
        </span>

        {fuse !== undefined && (
          <span
            className={`absolute ${typeof fuse === 'string' ? 'bottom-0' : 'top-0'} right-0 rounded-tr-sm text-sm text-right whitespace-pre rounded-bl-sm bg-sky-950 text-blue-400 border-2 border-gray-300 opacity-90 px-1.5`}
          >
            {fuse}
          </span>
        )}
      </div>
      {showText && <span className="text-center wrap-anywhere">{cardStats.name}</span>}
    </div>
  );

  if (onClick)
    return (
      <button
        onClick={onClick}
        onContextMenu={(e) => {
          onRightClick();
          e.preventDefault();
        }}
        className={`${width} transparent flex !p-0`}
      >
        {inner}
      </button>
    );
  return inner;
}

export function AnimatedCard({
  id,
  startRect,
  onAnimationEnd,
}: {
  id: number;
  startRect: DOMRect;
  onAnimationEnd: () => void;
}) {
  const handleAnimationEnd = () => {
    onAnimationEnd(); // Tell the parent to remove this card from state.
  };

  return (
    <div
      className="animate-bounce-and-drop"
      style={{
        position: 'fixed',
        left: `${startRect.left}px`,
        top: `${startRect.top}px`,
        width: `${startRect.width}px`,
        height: `${startRect.height}px`,
      }}
      onAnimationEnd={handleAnimationEnd}
    >
      <Card id={id} size="x-small" showStats={false} />
    </div>
  );
}
