import { Dispatch, SetStateAction } from 'react';

import { Card } from './Card';

export function Hand({ hand, setHand }: { hand: number[]; setHand: Dispatch<SetStateAction<number[]>> }) {
  return (
    <>
      {hand.length === 0 && (
        <p className="text-center text-gray-400">Your hand is empty. Add some cards to see their fusions.</p>
      )}

      {hand.length > 0 && (
        <>
          <button
            className="self-center danger"
            onClick={() => {
              if (confirm('Are you sure you want to clear your hand?')) setHand([]);
            }}
          >
            Clear Hand
          </button>
          <ul className="flex gap-4 flex-wrap max-w-screen justify-center">
            {hand.map((id, index) => (
              <li key={index}>
                <div className="grid gap-2 h-full content-between justify-items-center">
                  <Card id={id} size="2x-small" />
                  <button
                    className="danger !py-0 w-1/2"
                    onClick={() => setHand((prev) => prev.filter((_, i) => i !== index))}
                  >
                    X
                  </button>
                </div>
              </li>
            ))}
          </ul>
        </>
      )}
    </>
  );
}
