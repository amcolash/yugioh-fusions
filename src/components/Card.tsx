import { useIsMobile } from 'hooks/useIsMobile';
import { MouseEventHandler } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';

import { useField, useModalData } from '../utils/state';
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
}: {
  id: number;
  onClick?: MouseEventHandler<HTMLButtonElement>;
  rightClick?: { handler: () => void; name: string };
  size?: '2x-small' | 'x-small' | 'small' | 'normal';
  fuse?: number | string;
  showTooltip?: boolean;
  stats?: string[];
}) {
  const mobile = useIsMobile();
  const [field] = useField();
  const [, setModalData] = useModalData();

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
    <div className={`grid content-baseline justify-items-center gap-2 relative ${showText ? 'w-36' : ''}`}>
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

        {fuseText !== undefined && (
          <span
            className={`absolute ${typeof fuseText === 'string' ? 'bottom-0' : 'top-0'} right-0 rounded-tr-sm text-xs text-right whitespace-pre rounded-bl-sm bg-sky-950 text-blue-400 border-2 border-gray-300 opacity-90 px-1.5`}
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
      onClick={(e) => {
        if (onClick) {
          onClick(e);
          navigator.vibrate?.(50);
        }
      }}
      onContextMenu={(e) => {
        if (mobile) {
          e.preventDefault();

          setModalData({
            card: id,
            actions: [rightClick],
            stats,
          });
          return;
        }

        if (rightClick) {
          e.preventDefault();
          rightClick?.handler();
        }
      }}
      className={`${width} transparent flex !p-0`}
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
