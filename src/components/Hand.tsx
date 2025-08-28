import { Dispatch, SetStateAction } from 'react';

import { Card } from './Card';

type CardWithIndex = SimpleCard & { index: number };

export function Hand({
  hand,
  setHand,
  recentCards,
}: {
  hand: SimpleCard[];
  setHand: Dispatch<SetStateAction<SimpleCard[]>>;
  recentCards: Record<string, number>;
}) {
  const cardsWithIndexes: CardWithIndex[] = hand.map((c, i) => ({ ...c, index: i }));
  const cardsInHand: CardWithIndex[] = cardsWithIndexes.filter((c) => c.location === 'hand');
  const cardsInField: CardWithIndex[] = cardsWithIndexes.filter((c) => c.location === 'field');

  return (
    <>
      {hand.length === 0 && (
        <>
          <p className="text-center text-gray-400">Your hand is empty. Add some cards to see their fusions.</p>
          <button
            onClick={() => setHand(Object.keys(recentCards).map((id) => ({ id: parseInt(id), location: 'hand' })))}
          >
            Best combinations
          </button>
        </>
      )}

      {hand.length > 0 && (
        <>
          <button
            className="self-center danger"
            onClick={() => {
              if (confirm('Are you sure you want to clear your cards?')) setHand([]);
            }}
          >
            Clear Cards
          </button>

          <CardSet
            cards={cardsInField}
            onRemove={(card) => setHand([...cardsInField.filter((c) => c.index !== card.index), ...cardsInHand])}
          />

          <CardSet
            cards={cardsInHand}
            onRemove={(card) => setHand([...cardsInHand.filter((c) => c.index !== card.index), ...cardsInField])}
          />
        </>
      )}
    </>
  );
}

function CardSet({ cards, onRemove }: { cards: CardWithIndex[]; onRemove: (card: CardWithIndex) => void }) {
  return (
    <ul className="flex gap-2 flex-wrap max-w-screen justify-center">
      {cards.map((card, index) => (
        <li key={index}>
          <div className="grid gap-2 h-full content-between justify-items-center">
            <Card id={card.id} size="2x-small" />
            <button className="danger !py-0 w-1/2" onClick={() => onRemove(card)}>
              X
            </button>
          </div>
        </li>
      ))}
    </ul>
  );
}
