import { ComponentProps, ReactNode } from 'react';
import { useField } from 'utils/state';
import {
  getFieldBonus,
  getGuardianStarBonus,
  getGuardianStarSymbol,
  getGuardianStarWeakness,
  getStats,
} from 'utils/util';

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
      <strong className="capitalize text-sky-500">{name}</strong>:{' '}
      <span className={className}>{Array.isArray(value) ? value.join(', ') : value}</span>
    </div>
  );
}

export function StatsOverlay({ card }: { card: number }) {
  const [field] = useField();
  const cardStats = getStats(card, field);
  const bonus = getFieldBonus(card, field);
  const bonusClass = bonus > 0 ? 'text-green-400' : bonus < 0 ? 'text-red-400' : 'text-white';

  return (
    <>
      <StatLabel name="Name" value={cardStats.name} />
      <StatLabel name="ID" value={'#' + cardStats.id} />
      <StatLabel
        name="Guardian Stars"
        value={cardStats.guardianStars.map(getGuardianStarSymbol).join(' ')}
        className="text-xl font-bold leading-none"
      />
      <StatLabel
        name="Star Bonus"
        value={
          getGuardianStarSymbol(getGuardianStarBonus(cardStats.guardianStars[0])) +
          ' ' +
          getGuardianStarSymbol(getGuardianStarBonus(cardStats.guardianStars[1]))
        }
        className="text-xl font-bold text-green-400 leading-none"
      />
      <StatLabel
        name="Star Weakness"
        value={
          getGuardianStarSymbol(getGuardianStarWeakness(cardStats.guardianStars[0])) +
          ' ' +
          getGuardianStarSymbol(getGuardianStarWeakness(cardStats.guardianStars[1]))
        }
        className="text-xl font-bold text-red-400 leading-none"
      />

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
  );
}
