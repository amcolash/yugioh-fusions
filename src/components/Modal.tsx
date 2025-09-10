import { useIsMobile } from 'hooks/useIsMobile';
import { useEffect } from 'react';

import { Background } from './Background';

export function Modal({ children, open, close }: { children: React.ReactNode; open: boolean; close: () => void }) {
  const mobile = useIsMobile();

  useEffect(() => {
    close();
  }, [mobile]);

  return (
    <>
      <dialog
        open={open}
        onKeyDown={(e) => {
          if (e.key === 'Escape') close();
        }}
        className="text-white z-1 p-4 inset-0 m-auto fixed w-full h-full overflow-hidden"
      >
        {open && (
          <div className="grid gap-8">
            <Background type="fixed" />

            <button className="danger absolute right-4 top-4 !py-0" onClick={() => close()}>
              X
            </button>

            {children}
          </div>
        )}
      </dialog>
    </>
  );
}
