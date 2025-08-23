import { Card } from "./Card";

export function Hand({ hand, setHand }: { hand: number[]; setHand: React.Dispatch<React.SetStateAction<number[]>> }) {
  console.log(hand);

  return (
    <>
      {hand.length === 0 && <p>Your hand is empty. Use the search box to add cards to your hand.</p>}
      {hand.length > 0 && (
        <>
          <h2>Your Hand</h2>
          <ul>
            {hand.map((id, index) => (
              <li key={index}>
                <div className="flex items-start">
                  <Card id={id} />
                  <button className="danger" onClick={() => setHand((prev) => prev.filter((_, i) => i !== index))}>
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
