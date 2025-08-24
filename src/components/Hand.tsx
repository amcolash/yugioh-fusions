import { Dispatch, SetStateAction } from 'react';

import { Card } from './Card';

export function Hand({ hand, setHand }: { hand: number[]; setHand: Dispatch<SetStateAction<number[]>> }) {
  return (
    <>
      {hand.length === 0 && (
        <p className="text-center text-gray-400 pt-6">
          Your hand is empty. Use the search box to add cards to your hand.
        </p>
      )}

      {hand.length > 0 && (
        <>
          <h2>Your Hand</h2>
          <button className="self-center danger p-3" onClick={() => setHand([])}>
            Clear Hand
          </button>
          <ul className="flex gap-4 flex-wrap max-w-screen justify-center">
            {hand.map((id, index) => (
              <li key={index}>
                <div className="grid gap-2 h-full content-between">
                  <Card id={id} />
                  <button className="danger p-1" onClick={() => setHand((prev) => prev.filter((_, i) => i !== index))}>
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
