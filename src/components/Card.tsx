import { MouseEventHandler } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { twMerge } from 'tailwind-merge';

import { useContextMenuData, useField } from '../utils/state';
import { getFieldBonus, getStats } from '../utils/util';
import { StatsOverlay } from './StatsOverlay';

export function Card({
  id,
  onClick,
  rightClick,
  size = 'normal',
  fuse,
  showTooltip = true,
  stats = [],
  disabled,
  style,
}: {
  id: number;
  onClick?: MouseEventHandler<HTMLButtonElement>;
  rightClick?: { handler: () => void; name: string };
  size?: '2x-small' | 'x-small' | 'small' | 'normal';
  fuse?: number | string;
  showTooltip?: boolean;
  stats?: string[];
  disabled?: boolean;
  style?: React.CSSProperties;
}) {
  const [field] = useField();
  const [, setContextMenuData] = useContextMenuData();

  const cardStats = getStats(id, field);
  const bonus = getFieldBonus(id, field);
  const bonusClass = bonus > 0 ? 'text-green-400' : bonus < 0 ? 'text-red-500' : 'text-white';

  let width = 'min-w-32';
  if (size === 'small') width = 'min-w-28';
  if (size === 'x-small') width = 'w-20 sm:w-24 min-w-20';
  if (size === '2x-small') width = 'w-16 sm:w-20';

  const showText = size === 'small' || size === 'normal';
  const fuseText = stats.length > 0 ? stats.map((s) => s.split(': ')[1]).join('\n') : fuse;

  const inner = (
    <div className={twMerge('relative grid content-baseline justify-items-center gap-2', showText && 'w-36')}>
      <div
        className="relative h-fit"
        data-tooltip-id={showTooltip ? 'stats-tooltip' : undefined}
        data-tooltip-html={renderToStaticMarkup(<StatsOverlay card={id} stats={stats} background />)}
        data-tooltip-delay-show={1000}
      >
        <img
          className={`${width} rounded border-2 border-amber-950`}
          src={`${import.meta.env.BASE_URL}/cropped/${id}.png`}
          alt=""
          loading="lazy"
        />

        {showText && (
          <span className="absolute bottom-0 left-0 rounded-tr-sm rounded-bl-sm bg-gray-900 px-1 text-sm opacity-60">
            #{id}
          </span>
        )}

        {cardStats.cardType === 'Monster' && (
          <span
            className={`absolute right-0 bottom-0 rounded-tl-sm rounded-br-sm bg-gray-900 px-1 text-right text-sm opacity-60 ${bonusClass}`}
          >
            {cardStats.attack}
            <br />
            {cardStats.defense}
          </span>
        )}

        {fuseText !== undefined && (
          <span
            className={`absolute ${typeof fuseText === 'string' ? 'bottom-0.5' : 'top-0.5'} right-0.5 rounded-tl-sm rounded-br-sm border-2 border-gray-300 bg-sky-950 px-1.5 text-right text-xs whitespace-pre text-blue-400 opacity-90`}
          >
            {fuseText}
          </span>
        )}
      </div>
      {showText && <span className="text-center wrap-anywhere">{cardStats.name}</span>}
    </div>
  );

  return (
    <button
      disabled={disabled}
      onClick={(e) => {
        if (onClick) {
          onClick(e);
          navigator.vibrate?.(50);
        }
      }}
      onContextMenu={(e) => {
        e.preventDefault();

        setContextMenuData({
          card: id,
          actions: [rightClick],
          stats,
        });
      }}
      className={twMerge(
        `${width} transparent flex !p-0`,
        !onClick && 'hover:!brightness-100',
        disabled && 'cursor-not-allowed brightness-50 hover:!brightness-50'
      )}
      style={style}
    >
      {inner}
    </button>
  );
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
      <Card id={id} size="x-small" showTooltip={false} />
    </div>
  );
}
