import { useContextMenuData, useStarOverlay } from 'utils/state';

import { Modal } from './Modal';
import { StatsOverlay } from './StatsOverlay';

export function ContextMenu() {
  const [contextMenuData, setContextMenuData] = useContextMenuData();
  const [starOverlay, setStarOverlay] = useStarOverlay();

  const actions = (contextMenuData?.actions || []).filter((a) => !!a);
  actions.push({
    name: `Star Overlay: ${starOverlay ? 'Enabled' : 'Disabled'}`,
    handler: () => {
      setStarOverlay(!starOverlay);
      localStorage.setItem('starOverlay', !starOverlay ? 'true' : 'false');
    },
  });

  if (!contextMenuData) return null;

  return (
    <Modal open={!!contextMenuData} close={() => setContextMenuData(undefined)} zIndex={2}>
      <div className="max-h-full overflow-y-auto">
        <StatsOverlay card={contextMenuData?.card} stats={contextMenuData?.stats} width="lg" />

        {actions.length > 0 && (
          <div className="w-full max-w-lg justify-self-center">
            <hr className="my-8" />
            <div className="grid gap-2">
              {actions.map(({ name, handler }) => (
                <button
                  key={name}
                  className="primary w-full max-w-2xl justify-self-center"
                  onClick={() => {
                    handler();
                    setContextMenuData(undefined);
                  }}
                >
                  {name}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </Modal>
  );
}
