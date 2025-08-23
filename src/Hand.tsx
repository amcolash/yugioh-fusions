import { statsById } from "./util";

export function Hand({ hand, setHand }: { hand: number[]; setHand: React.Dispatch<React.SetStateAction<number[]>> }) {
  return (
    <>
      {hand.length === 0 && <p>Your hand is empty. Use the search box to add cards to your hand.</p>}
      {hand.length > 0 && (
        <>
          <h2>Your Hand</h2>
          <ul>
            {hand.map((id) => (
              <li key={id}>
                #{id}: <span>{statsById(id)?.name}</span>
                <button className="cursor-pointer danger" onClick={() => setHand((prev) => prev.filter((cardId) => cardId !== id))}>
                  X
                </button>
              </li>
            ))}
          </ul>
        </>
      )}
    </>
  );
}
