import { useModalData } from 'utils/state';

import { Modal } from './Modal';
import { StatsOverlay } from './StatsOverlay';

export function MobileContextMenu() {
  const [modalData, setModalData] = useModalData();

  const actions = (modalData?.actions || []).filter((a) => !!a);

  return (
    <Modal open={!!modalData} close={() => setModalData(undefined)}>
      <div className="max-h-full overflow-y-auto">
        <StatsOverlay card={modalData?.card} stats={modalData?.stats} />

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
                    setModalData(undefined);
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
