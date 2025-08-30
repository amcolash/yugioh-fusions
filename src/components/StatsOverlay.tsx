import { useField } from 'utils/state';
import { getStats } from 'utils/util';

function StatLabel({ name, value }: { name: string; value: string | number | (string | number)[] }) {
  return (
    <div>
      <strong className="capitalize text-sky-500">{name}</strong>: {Array.isArray(value) ? value.join(', ') : value}
    </div>
  );
}

export function StatsOverlay({ card }: { card: number }) {
  const [field] = useField();
  const cardStats = getStats(card, field);

  return (
    <>
      <StatLabel name="Name" value={cardStats.name} />
      <StatLabel name="ID" value={'#' + cardStats.id} />

      {Object.entries(cardStats)
        .sort((a, b) => a[0].localeCompare(b[0]))
        .filter((s) => s[0] === 'subtype' || s[0] === 'type' || s[0] === 'attack' || s[0] === 'defense')
        .map(([key, value]) => (
          <StatLabel key={key} name={key} value={value} />
        ))}
    </>
  );
}
