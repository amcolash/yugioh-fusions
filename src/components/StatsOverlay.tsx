import { ComponentProps, ReactNode } from 'react';
import { twMerge } from 'tailwind-merge';

import { useField } from '../utils/state';
import {
  getFieldBonus,
  getGuardianStarBonus,
  getGuardianStarSymbol,
  getGuardianStarWeakness,
  getStats,
} from '../utils/util';
import { Background } from './Background';

function StatLabel({
  name,
  value,
  className,
}: {
  name: string;
  value: string | number | (string | number)[] | ReactNode;
  className?: ComponentProps<'div'>['className'];
}) {
  return (
    <div>
      <strong className="text-sky-500 capitalize">{name}</strong>:{' '}
      <span className={className}>{Array.isArray(value) ? value.join(', ') : value}</span>
    </div>
  );
}

function StarLabel({ star }: { star: GuardianStar }) {
  return (
    <>
      {getGuardianStarSymbol(star)}
      <span className="mx-2">|</span>
      {getGuardianStarSymbol(getGuardianStarBonus(star), 'positive')}
      <span className="mx-2">|</span>
      {getGuardianStarSymbol(getGuardianStarWeakness(star), 'negative')}
    </>
  );
}

export function StatsOverlay({ card, stats, background }: { card: number; stats?: string[]; background?: boolean }) {
  const [field] = useField();
  const cardStats = getStats(card, field);
  const bonus = getFieldBonus(card, field);
  const bonusClass = bonus > 0 ? 'text-green-400' : bonus < 0 ? 'text-red-400' : 'text-white';

  return (
    <div
      className={twMerge(
        'relative grid max-w-md gap-1 justify-self-center overflow-hidden rounded-md',
        background ? 'p-4' : 'py-2'
      )}
    >
      {background && <Background type="absolute" brightness={2.5} />}

      <img
        className={`mb-4 w-48 justify-self-center rounded border-2 border-amber-950`}
        src={`${import.meta.env.BASE_URL}cropped/${card}.png`}
        alt=""
      />

      <StatLabel name="Name" value={cardStats.name} />
      <StatLabel name="ID" value={'#' + cardStats.id} />

      {cardStats.cardType === 'Monster' && (
        <>
          <StatLabel name="Star 1" value={<StarLabel star={cardStats.guardianStars[0]} />} />
          <StatLabel name="Star 2" value={<StarLabel star={cardStats.guardianStars[1]} />} />

          {Object.entries(cardStats)
            .sort((a, b) => a[0].localeCompare(b[0]))
            .filter((s) => s[0] === 'subtype' || s[0] === 'type' || s[0] === 'attack' || s[0] === 'defense')
            .map(([key, value]) => (
              <StatLabel
                key={key}
                name={key}
                value={value}
                className={key === 'attack' || key === 'defense' ? bonusClass : undefined}
              />
            ))}
        </>
      )}

      <hr className="my-4" />
      <StatLabel name="Description" value={cardStats.description} />

      {stats?.length > 0 && (
        <>
          <hr className="my-4" />
          {stats.map((s) => {
            const [name, value] = s.split(': ');
            return <StatLabel key={name} name={name} value={value} />;
          })}
        </>
      )}
    </div>
  );
}
