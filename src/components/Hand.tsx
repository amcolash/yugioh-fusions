import { Dispatch, SetStateAction } from 'react';

import clipboard from '../icons/clipboard.svg';
import copy from '../icons/copy.svg';
import { useExcludedCards, useField, useHand, useRecentCards, useShowStats } from '../utils/state';
import { Card } from './Card';

export function Hand() {
  const [hand, setHand] = useHand();
  const [recentCards] = useRecentCards();
  const [showStats, setShowStats] = useShowStats();
  const [, setExcluded] = useExcludedCards();
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

          <div className="flex gap-4">
            <button
              className="danger w-full"
              onClick={() => {
                if (confirm('Are you sure you want to clear your cards?')) {
                  setHand([]);
                  setExcluded([]);
                  setShowStats(false);
                  setField('normal');
                }
              }}
              onContextMenu={(e) => {
                e.preventDefault();
                setHand([]);
                setExcluded([]);
                setShowStats(false);
                setField('normal');
              }}
            >
              Clear Cards
            </button>

            {/* {!import.meta.env.PROD && ( */}
            {/* <> */}
            <button
              className="transparent border border-gray-500 duration-250"
              onClick={async (e) => {
                const target = e.target as HTMLButtonElement;
                try {
                  await navigator.clipboard.writeText(JSON.stringify(hand));
                  target.classList.add('success');
                  setTimeout(() => target.classList.remove('success'), 250);
                } catch (error) {
                  console.error('Failed to copy to clipboard:', error);
                  target.classList.add('danger');
                  setTimeout(() => target.classList.remove('danger'), 250);
                }
              }}
            >
              <img src={copy} className="pointer-events-none invert" />
            </button>
            <button
              className="transparent border border-gray-500 duration-250"
              onClick={async (e) => {
                const target = e.target as HTMLButtonElement;
                try {
                  setHand(JSON.parse(await navigator.clipboard.readText()));
                  target.classList.add('success');
                  setTimeout(() => target.classList.remove('success'), 250);
                } catch (error) {
                  console.error('Failed to read clipboard contents:', error);
                  target.classList.add('danger');
                  setTimeout(() => target.classList.remove('danger'), 250);
                }
              }}
            >
              <img src={clipboard} className="pointer-events-none invert" />
            </button>
            {/* </> */}
            {/* )} */}
          </div>

          {!showStats && (
            <>
              {cardsInField.length > 0 && (
                <CardSet
                  cards={cardsInField}
                  onRemove={(card) => setHand([...cardsInField.filter((c) => c.index !== card.index), ...cardsInHand])}
                  setHand={setHand}
                  canMove={cardsInHand.length < 5}
                />
              )}

              {cardsInHand.length > 0 && (
                <CardSet
                  cards={cardsInHand}
                  onRemove={(card) => setHand([...cardsInHand.filter((c) => c.index !== card.index), ...cardsInField])}
                  setHand={setHand}
                  canMove={cardsInField.length < 5}
                />
              )}
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
  canMove,
}: {
  cards: CardWithIndex[];
  onRemove: (card: CardWithIndex) => void;
  setHand: Dispatch<SetStateAction<SimpleCard[]>>;
  canMove: boolean;
}) {
  const [excluded, setExcluded] = useExcludedCards();

  return (
    <ul className="flex max-w-screen flex-wrap justify-center gap-2">
      {cards.map((card, index) => (
        <li key={index}>
          <div className="grid h-full content-between justify-items-center gap-2">
            <div className={excluded.includes(card.id) ? 'ring-4 ring-red-400' : ''}>
              <Card
                id={card.id}
                size="2x-small"
                onClick={
                  canMove
                    ? () => {
                        setHand((prev) => {
                          const newCards = [...prev];
                          const found = newCards.find((c) => c.id == card.id);
                          found.location = found.location === 'field' ? 'hand' : 'field';

                          return newCards;
                        });
                      }
                    : undefined
                }
                rightClick={{
                  name: excluded.includes(card.id) ? 'Include' : 'Exclude',
                  handler: () => {
                    setExcluded((prev) => {
                      if (prev.includes(card.id)) return prev.filter((id) => id !== card.id);
                      return [...prev, card.id];
                    });
                  },
                }}
              />
            </div>
            <button className="danger w-1/2 !py-0" onClick={() => onRemove(card)}>
              X
            </button>
          </div>
        </li>
      ))}
    </ul>
  );
}
