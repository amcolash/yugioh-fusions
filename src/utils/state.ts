import { atom, useAtom, useAtomValue, useSetAtom } from 'jotai';

import { Field, filterRecentCards, generateSecondaryFusions } from './util';

const defaultHand: SimpleCard[] = [];
// const defaultHand: SimpleCard[] = [9, 399, 44, 461, 97].map((id) => ({ id, location: 'hand' }));
// const defaultHand: (SimpleCard | CardWithIndex)[] = [
//   { id: 4, location: 'hand', index: 0 },
//   { id: 421, location: 'hand', index: 1 },
//   { id: 461, location: 'hand', index: 2 },
//   { id: 97, location: 'hand', index: 4 },
// ];

const hand = atom<SimpleCard[]>(defaultHand);
const dialogOpen = atom<boolean>(false);
const showStats = atom<boolean>(false);
const selectedCard = atom<number | undefined>();
const excludedCards = atom<number[]>([]);
const field = atom<Field>('normal');

const fusions = atom<FusionRecord[]>((get) => {
  const fusions = generateSecondaryFusions(get(hand), get(field));
  const excluded = get(excludedCards);

  return fusions.filter(({ cards, secondary }) => {
    return !cards.some((c) => excluded.includes(c)) && !secondary?.cards.some((c) => excluded.includes(c));
  });
});

const recentCards = atom<Record<string, number>>({});
const recentCardsFiltered = atom(
  (get) => filterRecentCards(get(recentCards)),
  (_get, set, cards: Record<string, number>) => set(recentCards, cards)
);

const addToHandAtom = atom(null, (_get, set, card: SimpleCard) => {
  set(hand, (prev) => [...prev, card]);
  set(recentCards, (prev) => ({ ...prev, [card.id]: (prev[card.id] || 0) + 1 }));
});

export const useHand = () => useAtom(hand);
export const useDialogOpen = () => useAtom(dialogOpen);
export const useShowStats = () => useAtom(showStats);
export const useSelectedCard = () => useAtom(selectedCard);
export const useExcludedCards = () => useAtom(excludedCards);
export const useField = () => useAtom(field);

export const useFusions = () => useAtomValue(fusions);

export const useRecentCardsRaw = () => useAtom(recentCards);
export const useRecentCards = () => useAtom(recentCardsFiltered);
export const useAddToHand = () => useSetAtom(addToHandAtom);
