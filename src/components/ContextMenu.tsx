import { useContextMenuData } from 'utils/state';

import { Modal } from './Modal';
import { StatsOverlay } from './StatsOverlay';

export function ContextMenu() {
  const [contextMenuData, setContextMenuData] = useContextMenuData();

  const actions = (contextMenuData?.actions || []).filter((a) => !!a);

  return (
    <Modal open={!!contextMenuData} close={() => setContextMenuData(undefined)}>
      <div className="max-h-full overflow-y-auto">
        <StatsOverlay card={contextMenuData?.card} stats={contextMenuData?.stats} />

        {actions.length > 0 && (
          <>
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
          </>
        )}
      </div>
    </Modal>
  );
}
