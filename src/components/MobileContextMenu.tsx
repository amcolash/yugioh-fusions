import { useIsMobile } from 'hooks/useIsMobile';
import { useStackedModalHistory } from 'hooks/useStackedModalHistory';
import { useModalData } from 'utils/state';

import { Modal } from './Modal';
import { StatsOverlay } from './StatsOverlay';

export function MobileContextMenu() {
  const mobile = useIsMobile();
  const [modalData, setModalData] = useModalData();

  // Special close function that syncs with browser history (for back button)
  const close = useStackedModalHistory();

  const actions = (modalData?.actions || []).filter((a) => !!a);

  return (
    mobile && (
      <Modal
        open={!!modalData}
        close={() => {
          close();
          setModalData(undefined);
        }}
      >
        <div className="max-h-full overflow-y-auto">
          <StatsOverlay card={modalData?.card} stats={modalData?.stats} />

          {actions.length > 0 && (
            <>
              <hr className="my-8" />
              <div className="grid gap-2">
                {actions.map(({ name, handler }) => (
                  <button
                    key={name}
                    className="primary w-full"
                    onClick={() => {
                      handler();
                      close();
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
    )
  );
}
