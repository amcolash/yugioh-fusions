import { ReactNode } from 'react';

import data from './data.json';

const stats: Record<string, Stats> = data.stats as unknown as Record<string, Stats>;
const fusions: Record<string, number[][]> = data.fusions as Record<string, number[][]>;

export const monsterList = Object.values(stats)
  .filter((s) => s.cardType === 'Monster')
  .map((s) => s.name);

export const fieldTypes = ['normal', 'yami', 'mountain', 'sogen', 'forest', 'wasteland', 'umi'] as const;
export type Field = (typeof fieldTypes)[number];

export const starGroup1: GuardianStar[] = ['Sun', 'Moon', 'Venus', 'Mercury'];
export const starGroup2: GuardianStar[] = ['Mars', 'Jupiter', 'Saturn', 'Uranus', 'Pluto', 'Neptune'];

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
  const filtered2 = filterSecondaryExtras(filtered1, baseFusions);
  const combined = [...baseFusions, ...filtered2];

  combined.sort((a, b) => {
    const statsA = getStats(a.secondary?.id || a.id, field);
    const statsB = getStats(b.secondary?.id || b.id, field);

    const attackDiff = statsB?.attack - statsA?.attack;
    const defenseDiff = statsB?.defense - statsA?.defense;

    // First, sort by final fused card attack/defense
    if (attackDiff !== 0) return attackDiff;
    if (defenseDiff !== 0) return defenseDiff;

    const aInHand =
      hand.includes(a.cards[0]) &&
      hand.includes(a.cards[1]) &&
      (a.secondary ? hand.includes(a.secondary.cards[0]) : true);
    const bInHand =
      hand.includes(b.cards[0]) &&
      hand.includes(b.cards[1]) &&
      (b.secondary ? hand.includes(b.secondary.cards[0]) : true);

    // Then, sort by how many cards are in hand (more is better)
    if (aInHand && !bInHand) return 1;
    if (!aInHand && bInHand) return -1;

    const aAttack =
      stats[a.cards[0]].attack + stats[a.cards[1]].attack + (a.secondary ? stats[a.secondary.cards[0]].attack : 0);
    const bAttack =
      stats[b.cards[0]].attack + stats[b.cards[1]].attack + (b.secondary ? stats[b.secondary.cards[0]].attack : 0);

    const aDefense =
      stats[a.cards[0]].defense + stats[a.cards[1]].defense + (a.secondary ? stats[a.secondary.cards[0]].defense : 0);
    const bDefense =
      stats[b.cards[0]].defense + stats[b.cards[1]].defense + (b.secondary ? stats[b.secondary.cards[0]].defense : 0);

    // Finally, sort by total combined attack/defense of all cards used (less is better)
    if (aAttack !== bAttack) return aAttack - bAttack;
    if (aDefense !== bDefense) return aDefense - bDefense;

    return 0;
  });

  const finalFusions = filterImpossibilities(combined, baseHand);

  // console.log('All fusions:', combined);

  return finalFusions;
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

export function filterImpossibilities(fusions: FusionRecord[], cards: SimpleCard[]): FusionRecord[] {
  return fusions.filter((fusion) => {
    const card1 = fusion.cards[0];
    const card2 = fusion.cards[1];
    const card3 = fusion.secondary?.cards.find((c) => c !== fusion.id);

    const hand = cards.filter((c) => c.location === 'hand').map((c) => c.id);
    const field = cards.filter((c) => c.location === 'field').map((c) => c.id);

    const card1InHand = hand.includes(card1);
    const card2InHand = hand.includes(card2);
    const card3InHand = hand.includes(card3);

    // primary fusions
    if (!card3) {
      // at least one card must be in hand (cannot fuse field cards)
      if (!card1InHand && !card2InHand) return false;
    }

    // secondary fusions
    if (card3) {
      // Secondary fusion need to have one card in hand, one card on field, third in hand
      if (card1InHand && card2InHand && !card3InHand) return false;
    }

    if (card1InHand && card2InHand && field.length >= 5) return false; // cannot fuse if field is full and both cards are in hand

    return true;
  });
}

export function filterRecentCards(data: Record<string, number>): Record<string, number> {
  const filtered: Record<string, number> = {};
  for (const [key, value] of Object.entries(data)) {
    if (value !== -1) filtered[key] = value;
  }
  return filtered;
}

export function getDeckStats(fusions: FusionRecord[], field: Field): { attack: number; defense: number } {
  let deckAttack = 0;
  let deckDefense = 0;

  for (const fusion of fusions) {
    const result = fusion.secondary?.id || fusion.id;
    const cardStats = getStats(result, field);

    deckAttack += cardStats.attack;
    deckDefense += cardStats.defense;
  }

  return {
    attack: parseInt((deckAttack / fusions.length).toFixed(0)),
    defense: parseInt((deckDefense / fusions.length).toFixed(0)),
  };
}

export function getFusionStats(fusions: FusionRecord[], field: Field): Record<string, FusionStats> {
  const fusionStats: Record<string, FusionStats> = {};

  for (const fusion of fusions) {
    const result = fusion.secondary?.id || fusion.id;
    const cardStats = getStats(result, field);

    for (const card of fusion.cards) {
      fusionStats[card] = fusionStats[card] || { primary: 0, secondary: 0, totalAttack: 0, totalDefense: 0 };

      if (fusion.secondary) fusionStats[card].secondary += 1;
      else fusionStats[card].primary += 1;

      fusionStats[card].totalAttack += cardStats.attack;
      fusionStats[card].totalDefense += cardStats.defense;
    }

    if (fusion.secondary) {
      for (const card of fusion.secondary.cards) {
        if (card !== fusion.id) {
          fusionStats[card] = fusionStats[card] || { primary: 0, secondary: 0, totalAttack: 0, totalDefense: 0 };

          if (fusion.secondary) fusionStats[card].secondary += 1;
          else fusionStats[card].primary += 1;

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

export function getGuardianStarSymbol(star: GuardianStar, bonus?: 'positive' | 'negative'): ReactNode {
  return (
    <img
      src={`${import.meta.env.BASE_URL}/stars/${star.toLowerCase()}.png`}
      className={`star inline-block size-6 ${bonus === 'positive' ? 'star-green' : bonus === 'negative' ? 'star-red' : ''}`}
    />
  );
}

export function getGuardianStarBonus(star: GuardianStar): GuardianStar {
  if (starGroup1.includes(star)) return starGroup1[(starGroup1.indexOf(star) + 1) % starGroup1.length];
  if (starGroup2.includes(star)) return starGroup2[(starGroup2.indexOf(star) + 1) % starGroup2.length];
}

export function getGuardianStarWeakness(star: GuardianStar): GuardianStar {
  if (starGroup1.includes(star))
    return starGroup1[(starGroup1.indexOf(star) - 1 + starGroup1.length) % starGroup1.length];
  if (starGroup2.includes(star))
    return starGroup2[(starGroup2.indexOf(star) - 1 + starGroup2.length) % starGroup2.length];
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

// Calculate approximate ratio using continued fractions, generated w/ gemini
export function approximateRatio(primary: number, secondary: number, maxDenominator: number = 10) {
  // Handle edge cases
  if (typeof primary !== 'number' || typeof secondary !== 'number') {
    return 'Invalid input';
  }

  if (primary === 0) return '0:' + secondary;
  if (secondary === 0) return primary + ':0';

  const value = primary / secondary;

  // Seed the sequence with the representations of 0/1 and 1/0
  let last_num = 0,
    last_den = 1;
  let curr_num = 1,
    curr_den = 0;

  let b = value;

  while (true) {
    const a = Math.floor(b);
    const next_num = a * curr_num + last_num;
    const next_den = a * curr_den + last_den;

    // If the next denominator exceeds our limit, the current one is the best we can do.
    if (next_den > maxDenominator) {
      break;
    }

    // Update for the next iteration
    [last_num, curr_num] = [curr_num, next_num];
    [last_den, curr_den] = [curr_den, next_den];

    // If the value is a whole number (or we've reached the limit of precision), we are done.
    const remainder = b - a;
    if (remainder < Number.EPSILON) {
      break;
    }

    b = 1 / remainder;
  }

  // The last calculated ratio (curr_num:curr_den) is the best one within the limit.
  return `${curr_num}:${curr_den}`;
}
