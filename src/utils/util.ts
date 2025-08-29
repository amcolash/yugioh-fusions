import data from './data.json';

export const stats: Record<string, Stats> = data.stats as unknown as Record<string, Stats>;
export const fusions: Record<string, number[][]> = data.fusions as Record<string, number[][]>;

export function generateSecondaryFusions(baseHand: SimpleCard[]) {
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

    const secondaryFusions = getFusions(newHand);
    // console.log(hand, newHand, secondaryFusions);

    const uniqueFromBase = secondaryFusions.filter((fusion) => baseFusions.every((base) => base.id !== fusion.id));

    for (const fusion of uniqueFromBase) {
      // console.log(`Found secondary fusion: ${stats[option.id]?.name} -> ${stats[fusion.id]?.name}`);
      newFusions.push({ ...option, secondary: fusion });
    }
  }

  const filtered1 = filterDuplicateFusions(newFusions);
  const filtered2 = filterSecondaryImpossibilities(filtered1, baseHand);
  const combined = [...baseFusions, ...filtered2];

  combined.sort((a, b) => {
    const statsA = stats[a.secondary?.id || a.id];
    const statsB = stats[b.secondary?.id || b.id];

    const attackDiff = statsB?.attack - statsA?.attack;

    if (attackDiff !== 0) return attackDiff;
    return statsB?.defense - statsA?.defense;
  });

  // console.log('All fusions:', combined);

  return combined;
}

export function getFusions(hand: number[]): FusionRecord[] {
  const results: FusionRecord[] = [];

  const f = Object.entries(fusions);
  for (let i = 0; i < f.length; i++) {
    const [id, combinations] = f[i];
    for (let j = 0; j < combinations.length; j++) {
      const [card1, card2] = combinations[j];

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
    const sortedCards = [...record.cards].sort((a, b) => a - b);
    const key = sortedCards.join(',');

    if (!seenFusions.has(key)) {
      seenFusions.add(key);
      uniqueFusions.push(record);
    }
  }

  return uniqueFusions;
}

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

export function getStats(fusions: FusionRecord[]): Record<string, FusionStats> {
  const fusionStats: Record<string, FusionStats> = {};

  for (const fusion of fusions) {
    const result = fusion.secondary?.id || fusion.id;
    const cardStats = stats[result];

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
