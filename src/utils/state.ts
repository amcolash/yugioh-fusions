import { atom, useAtom, useAtomValue, useSetAtom } from 'jotai';

import { Field, filterRecentCards, generateSecondaryFusions } from './util';

const defaultHand: SimpleCard[] = [];
// const defaultHand: SimpleCard[] = [9, 399, 44, 461, 97].map((id) => ({ id, location: 'hand' }));
// const defaultHand: (SimpleCard | CardWithIndex)[] = [
//   { id: 190, location: 'hand' },
//   { id: 4, location: 'hand' },
//   { id: 461, location: 'hand' },
//   { id: 10, location: 'hand' },
// ];

const search = atom<string>('');
const hand = atom<SimpleCard[]>(defaultHand);
const showStats = atom<boolean>(false);
const selectedCard = atom<number | undefined>();
const excludedCards = atom<number[]>([]);
const field = atom<Field>('normal');
const fusionFilter = atom<FusionFilter>('all');
const contextMenuData = atom<ContextMenuData | undefined>();
const recentCardsOpen = atom<boolean>(false);
const starOverlay = atom<boolean>(localStorage.getItem('starOverlay') === 'true');

const fusions = atom<FusionRecord[]>((get) => {
  const fusions = generateSecondaryFusions(get(hand), get(field));
  const excluded = get(excludedCards);
  const fusionType = get(fusionFilter);

  return fusions.filter(({ cards, secondary }) => {
    if (fusionType === 'all' || (fusionType === 'primary' && !secondary) || (fusionType === 'secondary' && secondary)) {
      return !cards.some((c) => excluded.includes(c)) && !secondary?.cards.some((c) => excluded.includes(c));
    }

    return false;
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

export const useSearch = () => useAtom(search);
export const useHand = () => useAtom(hand);
export const useShowStats = () => useAtom(showStats);
export const useSelectedCard = () => useAtom(selectedCard);
export const useExcludedCards = () => useAtom(excludedCards);
export const useField = () => useAtom(field);
export const useFusionFilter = () => useAtom(fusionFilter);
export const useContextMenuData = () => useAtom(contextMenuData);
export const useRecentCardsOpen = () => useAtom(recentCardsOpen);
export const useStarOverlay = () => useAtom(starOverlay);

export const useFusions = () => useAtomValue(fusions);

export const useRecentCardsRaw = () => useAtom(recentCards);
export const useRecentCards = () => useAtom(recentCardsFiltered);
export const useAddToHand = () => useSetAtom(addToHandAtom);
