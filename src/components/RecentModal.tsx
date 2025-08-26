import { Background } from './Background';
import { Card } from './Card';

export function RecentModal({
  open,
  setOpen,
  addToHand,
  recentCards,
}: {
  open: boolean;
  setOpen: (open: boolean) => void;
  addToHand: (id: number) => void;
  recentCards: Record<string, number>;
}) {
  return (
    <dialog
      open={open}
      onKeyDown={(e) => {
        if (e.key === 'Escape') setOpen(false);
      }}
      className="text-white z-1 p-4 inset-0 m-auto fixed w-full h-full overflow-hidden"
    >
      <Background type="fixed" />

      <div className="grid gap-6 content-start h-full">
        <h2 className="text-center">Recent Cards</h2>
        <button className="danger absolute right-4 top-4 !py-0" onClick={() => setOpen(false)}>
          X
        </button>

        <div className="flex flex-wrap justify-center gap-3 overflow-auto h-full">
          {Object.entries(recentCards)
            .sort((a, b) => b[1] - a[1])
            .map(([id, _]) => (
              <Card
                key={id}
                id={parseInt(id)}
                size="x-small"
                onClick={() => {
                  addToHand(parseInt(id));
                  setOpen(false);
                }}
              />
            ))}
        </div>
      </div>
    </dialog>
  );
}
