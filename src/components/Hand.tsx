import { Dispatch, SetStateAction } from 'react';
import { useField, useHand, useRecentCards, useShowStats } from 'utils/state';

import { Card } from './Card';

export function Hand() {
  const [hand, setHand] = useHand();
  const [recentCards] = useRecentCards();
  const [showStats, setShowStats] = useShowStats();
  const [, setField] = useField();

  const cardsWithIndexes: CardWithIndex[] = hand.map((c, i) => ({ ...c, index: i }));
  const cardsInHand: CardWithIndex[] = cardsWithIndexes.filter((c) => c.location === 'hand');
  const cardsInField: CardWithIndex[] = cardsWithIndexes.filter((c) => c.location === 'field');

  return (
    <>
      {hand.length === 0 && (
        <>
          <p className="text-center text-gray-400">Your hand is empty. Add some cards to see their fusions.</p>
          <button
            onClick={() => {
              setHand(Object.keys(recentCards).map((id) => ({ id: parseInt(id), location: 'hand' })));
              setShowStats(true);
              setField('normal');
            }}
          >
            Best Combinations
          </button>
        </>
      )}

      {hand.length > 0 && (
        <>
          {cardsInHand.length > 5 && (
            <button className="success" onClick={() => setShowStats((prev) => !prev)}>
              Stats: {showStats ? 'On' : 'Off'}
            </button>
          )}

          <div className="flex gap-2">
            <button
              className="danger w-full"
              onClick={() => {
                if (confirm('Are you sure you want to clear your cards?')) {
                  setHand([]);
                  setShowStats(false);
                  setField('normal');
                }
              }}
            >
              Clear Cards
            </button>
            {!import.meta.env.PROD && (
              <button
                className="transparent border border-gray-500"
                onClick={() => navigator.clipboard.writeText(JSON.stringify(hand))}
              >
                📋
              </button>
            )}
          </div>

          {!showStats && (
            <>
              <CardSet
                cards={cardsInField}
                onRemove={(card) => setHand([...cardsInField.filter((c) => c.index !== card.index), ...cardsInHand])}
                setHand={setHand}
              />

              <CardSet
                cards={cardsInHand}
                onRemove={(card) => setHand([...cardsInHand.filter((c) => c.index !== card.index), ...cardsInField])}
                setHand={setHand}
              />
            </>
          )}
        </>
      )}
    </>
  );
}

function CardSet({
  cards,
  onRemove,
  setHand,
}: {
  cards: CardWithIndex[];
  onRemove: (card: CardWithIndex) => void;
  setHand: Dispatch<SetStateAction<SimpleCard[]>>;
}) {
  return (
    <ul className="flex gap-2 flex-wrap max-w-screen justify-center">
      {cards.map((card, index) => (
        <li key={index}>
          <div className="grid gap-2 h-full content-between justify-items-center">
            <Card
              id={card.id}
              size="2x-small"
              onClick={() => {
                setHand((prev) => {
                  const newCards = [...prev];
                  const found = newCards.find((c) => c.id == card.id);
                  found.location = found.location === 'field' ? 'hand' : 'field';

                  return newCards;
                });
              }}
            />
            <button className="danger !py-0 w-1/2" onClick={() => onRemove(card)}>
              X
            </button>
          </div>
        </li>
      ))}
    </ul>
  );
}
