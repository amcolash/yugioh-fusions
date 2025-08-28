import { atom, useAtom, useAtomValue, useSetAtom } from 'jotai';

import { filterRecentCards, generateSecondaryFusions } from './util';

const defaultHand: SimpleCard[] = [];
// const defaultHand: SimpleCard[] = [9, 399, 44, 461, 97].map((id) => ({ id, location: 'hand' }));

const hand = atom<SimpleCard[]>(defaultHand);
const dialogOpen = atom<boolean>(false);
const showStats = atom<boolean>(false);
const fusions = atom<FusionRecord[]>((get) => generateSecondaryFusions(get(hand)));

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
export const useFusions = () => useAtomValue(fusions);

export const useRecentCardsRaw = () => useAtom(recentCards);
export const useRecentCards = () => useAtom(recentCardsFiltered);
export const useAddToHand = () => useSetAtom(addToHandAtom);
