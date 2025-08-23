import { Dispatch, SetStateAction } from 'react';

import { Card } from './Card';

export function Hand({ hand, setHand }: { hand: number[]; setHand: Dispatch<SetStateAction<number[]>> }) {
  return (
    <>
      {hand.length === 0 && <p>Your hand is empty. Use the search box to add cards to your hand.</p>}

      {hand.length > 0 && (
        <>
          <h2>Your Hand</h2>
          <ul className="flex gap-4 flex-wrap">
            {hand.map((id, index) => (
              <li key={index}>
                <div className="grid gap-2">
                  <Card id={id} />
                  <button className="danger" onClick={() => setHand((prev) => prev.filter((_, i) => i !== index))}>
                    X
                  </button>
                </div>
              </li>
            ))}

            <div className="flex-1"></div>
            <button className="self-center danger p-4" onClick={() => setHand([])}>
              Clear Hand
            </button>
          </ul>
        </>
      )}
    </>
  );
}
