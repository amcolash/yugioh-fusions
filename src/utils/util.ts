import data from './data.json';

const stats: Record<string, Stats> = data.stats as unknown as Record<string, Stats>;
const fusions: Record<string, number[][]> = data.fusions as Record<string, number[][]>;

export const monsterList = Object.values(stats)
  .filter((s) => s.cardType === 'Monster')
  .map((s) => s.name);

export const fieldTypes = ['normal', 'yami', 'mountain', 'sogen', 'forest', 'wasteland', 'umi'] as const;
export type Field = (typeof fieldTypes)[number];

export function generateSecondaryFusions(baseHand: SimpleCard[], field: Field) {
  const hand = baseHand.map((c) => c.id);

  const baseFusions = getFusions(hand);
  const newFusions: FusionRecord[] = [];

  for (const option of baseFusions) {
    let newHand = [...hand];
    for (const card of option.cards) {
      const index = newHand.indexOf(card);
      if (index > -1) {
        newHand.splice(index, 1);
      }
    }

    newHand = [...newHand, option.id];

    const secondaryFusions = getFusions(newHand, option.id);
    // console.log(hand, newHand, secondaryFusions);

    for (const fusion of secondaryFusions) {
      newFusions.push({ ...option, secondary: fusion });
    }
  }

  const filtered1 = filterDuplicateFusions(newFusions);
  const filtered2 = filterSecondaryImpossibilities(filtered1, baseHand);
  const filtered3 = filterSecondaryExtras(filtered2, baseFusions);
  const combined = [...baseFusions, ...filtered3];

  combined.sort((a, b) => {
    const statsA = getStats(a.secondary?.id || a.id, field);
    const statsB = getStats(b.secondary?.id || b.id, field);

    const attackDiff = statsB?.attack - statsA?.attack;

    if (attackDiff !== 0) return attackDiff;
    return statsB?.defense - statsA?.defense;
  });

  // console.log('All fusions:', combined);

  console.log('Total fusions:', combined.length);

  return combined;
}

export function getFusions(hand: number[], requiredCard?: number): FusionRecord[] {
  const results: FusionRecord[] = [];

  const f = Object.entries(fusions);
  for (let i = 0; i < f.length; i++) {
    const [id, combinations] = f[i];
    for (let j = 0; j < combinations.length; j++) {
      const [card1, card2] = combinations[j];

      // Required card for secondary fusion must be used
      if (requiredCard && card1 !== requiredCard && card2 !== requiredCard) continue;

      // Can't fuse a card with itself if it's not in hand twice
      const duplicateCards = card1 === card2;
      const hasDuplicates = hand.filter((card) => card === card1).length > 1;

      const hasCard1 = hand.includes(card1);
      const hasCard2 = hand.includes(card2);

      const result = { id: parseInt(id), cards: [card1, card2] };

      if (duplicateCards && hasDuplicates) results.push(result);
      if (!duplicateCards && hasCard1 && hasCard2) results.push(result);
    }
  }

  return filterDuplicateFusions(results);
}

// function from gemini
export function filterDuplicateFusions(fusions: FusionRecord[]): FusionRecord[] {
  const seenFusions = new Set<string>();
  const uniqueFusions: FusionRecord[] = [];

  for (const record of fusions) {
    const sortedCards = [...record.cards, ...(record.secondary?.cards || [])].sort((a, b) => a - b);
    const key = sortedCards.join(',');

    if (!seenFusions.has(key)) {
      seenFusions.add(key);
      uniqueFusions.push(record);
    }
  }

  return uniqueFusions;
}

export function filterSecondaryExtras(fusions: FusionRecord[], baseFusions: FusionRecord[]): FusionRecord[] {
  return fusions.filter((fusion) => {
    const primaryCards = fusion.cards;
    const secondaryCards = fusion.secondary.cards.filter((c) => c !== fusion.id);
    const cards = [...primaryCards, ...secondaryCards];

    for (const f of baseFusions) {
      // Remove all fusions that have an extra card for the same outcome
      if (fusion.secondary.id === f.id && cards.includes(f.cards[0]) && cards.includes(f.cards[1])) {
        return false;
      }
    }

    return true; // No extra cards found
  });
}

// This logic is wrong. If one of the cards is on the field, it needs to be primary and additional (non-field) is secondary

// We can only fuse a secondary if both base cards are in hand. The third card can be either in hand or field
export function filterSecondaryImpossibilities(fusions: FusionRecord[], cards: SimpleCard[]): FusionRecord[] {
  return fusions.filter((fusion) => {
    if (!fusion.secondary) return true;

    const card1 = fusion.cards[0];
    const card2 = fusion.cards[1];

    const hand = cards.filter((c) => c.location === 'hand').map((c) => c.id);
    if (hand.includes(card1) && hand.includes(card2)) return true;

    return false;
  });
}

export function filterRecentCards(data: Record<string, number>): Record<string, number> {
  const filtered: Record<string, number> = {};
  for (const [key, value] of Object.entries(data)) {
    if (value !== -1) filtered[key] = value;
  }
  return filtered;
}

export function getFusionStats(fusions: FusionRecord[], field: Field): Record<string, FusionStats> {
  const fusionStats: Record<string, FusionStats> = {};

  for (const fusion of fusions) {
    const result = fusion.secondary?.id || fusion.id;
    const cardStats = getStats(result, field);

    for (const card of fusion.cards) {
      fusionStats[card] = fusionStats[card] || { count: 0, totalAttack: 0, totalDefense: 0 };

      fusionStats[card].count += 1;
      fusionStats[card].totalAttack += cardStats.attack;
      fusionStats[card].totalDefense += cardStats.defense;
    }

    if (fusion.secondary) {
      for (const card of fusion.secondary.cards) {
        if (card !== fusion.id) {
          fusionStats[card] = fusionStats[card] || { count: 0, totalAttack: 0, totalDefense: 0 };

          fusionStats[card].count += 1;
          fusionStats[card].totalAttack += cardStats.attack;
          fusionStats[card].totalDefense += cardStats.defense;
        }
      }
    }
  }

  return fusionStats;
}

export function statsByName(name: string): Stats | undefined {
  return Object.values(stats).find((stat) => stat.name.toLowerCase() === name.toLowerCase()) as Stats;
}

export function getFieldIcon(field: Field): string {
  switch (field) {
    case 'normal':
      return '🌞';
    case 'yami':
      return '🌑';
    case 'mountain':
      return '⛰️';
    case 'sogen':
      return '🏞️';
    case 'forest':
      return '🌲';
    case 'wasteland':
      return '🏜️';
    case 'umi':
      return '🌊';
    default:
      return '❓';
  }
}

export function getGuardianStarSymbol(star: GuardianStar): string {
  switch (star) {
    case 'Sun':
      return '☉';
    case 'Mercury':
      return '☿';
    case 'Venus':
      return '♀';
    case 'Moon':
      return '☾';
    case 'Mars':
      return '♂';
    case 'Jupiter':
      return '♃';
    case 'Saturn':
      return '♄';
    case 'Uranus':
      return '⛢';
    case 'Neptune':
      return '♆';
    case 'Pluto':
      return '♇';
    default:
      return '❓';
  }
}

export function getStats(id: number, field: Field): Stats {
  const bonus = getFieldBonus(id, field);
  return {
    ...stats[id],
    attack: Math.max(0, stats[id].attack + bonus),
    defense: Math.max(0, stats[id].defense + bonus),
  };
}

export function getFieldBonus(id: number, field: Field): number {
  const { type } = stats[id];

  switch (field) {
    case 'yami':
      if (type === 'Spellcaster' || type === 'Fiend') return 500;
      if (type === 'Fairy') return -500;
      break;
    case 'mountain':
      if (type === 'Dragon' || type === 'WingedBeast' || type === 'Thunder') return 500;
      break;
    case 'sogen':
      if (type === 'Warrior' || type === 'Beast-Warrior') return 500;
      break;
    case 'forest':
      if (type === 'Beast-Warrior' || type === 'Insect' || type === 'Plant' || type === 'Beast') return 500;
      break;
    case 'wasteland':
      if (type === 'Zombie' || type === 'Dinosaur' || type === 'Rock') return 500;
      break;
    case 'umi':
      if (type === 'Aqua' || type === 'Thunder') return 500;
      if (type === 'Machine' || type === 'Pyro') return -500;
      break;
    case 'normal':
      return 0;
  }

  return 0;
}
