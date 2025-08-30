import { useField } from 'utils/state';
import { getFieldBonus, getStats } from 'utils/util';

function StatLabel({
  name,
  value,
  bonusClass,
}: {
  name: string;
  value: string | number | (string | number)[];
  bonusClass?: string;
}) {
  return (
    <div>
      <strong className="capitalize text-sky-500">{name}</strong>:{' '}
      <span className={bonusClass}>{Array.isArray(value) ? value.join(', ') : value}</span>
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

      {Object.entries(cardStats)
        .sort((a, b) => a[0].localeCompare(b[0]))
        .filter((s) => s[0] === 'subtype' || s[0] === 'type' || s[0] === 'attack' || s[0] === 'defense')
        .map(([key, value]) => (
          <StatLabel
            key={key}
            name={key}
            value={value}
            bonusClass={key === 'attack' || key === 'defense' ? bonusClass : undefined}
          />
        ))}
    </>
  );
}
