import { useEffect } from 'react';

import { Background } from './Background';

export function Modal({
  children,
  open,
  close,
  zIndex = 1,
}: {
  children: React.ReactNode;
  open: boolean;
  close: () => void;
  zIndex?: number;
}) {
  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : 'auto';
  }, [open]);

  return (
    <>
      <dialog
        open={open}
        onKeyDown={(e) => {
          if (e.key === 'Escape') close();
        }}
        className="fixed inset-0 m-auto h-full w-full overflow-hidden p-6 pt-7.5 text-white"
        style={{ zIndex }}
      >
        {open && (
          <>
            <Background type="fixed" />

            <button className="danger fixed top-6 right-6 z-1 !py-1" onClick={() => close()}>
              X
            </button>

            {children}
          </>
        )}
      </dialog>
    </>
  );
}
