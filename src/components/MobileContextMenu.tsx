import { useIsMobile } from 'hooks/useIsMobile';
import { useModalData } from 'utils/state';

import { Modal } from './Modal';
import { StatsOverlay } from './StatsOverlay';

export function MobileContextMenu() {
  const mobile = useIsMobile();
  const [modalData, setModalData] = useModalData();

  const actions = (modalData?.actions || []).filter((a) => !!a);

  return (
    mobile && (
      <Modal open={!!modalData} close={() => setModalData(undefined)}>
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
                    setModalData(undefined);
                  }}
                >
                  {name}
                </button>
              ))}
            </div>
          </>
        )}
      </Modal>
    )
  );
}
