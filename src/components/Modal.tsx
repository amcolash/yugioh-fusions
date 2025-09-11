import { useIsMobile } from 'hooks/useIsMobile';
import { useEffect } from 'react';

import { Background } from './Background';

export function Modal({ children, open, close }: { children: React.ReactNode; open: boolean; close: () => void }) {
  const mobile = useIsMobile();

  // useEffect(() => {
  //   document.body.style.overflow = open ? 'hidden' : 'auto';
  // }, [open]);

  // Handle back button and close the modal
  // useEffect(() => {
  //   if (!open) return;
  //   if (window.location.hash !== '#modal') window.location.hash = 'modal';

  //   const handleHashChange = () => {
  //     if (window.location.hash === '') close();
  //   };

  //   window.addEventListener('hashchange', handleHashChange);

  //   return () => {
  //     window.removeEventListener('hashchange', handleHashChange);
  //     if (window.location.hash === '#modal') history.back();
  //   };
  // }, [open, close]);

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
        className="text-white z-1 p-6 inset-0 m-auto fixed w-full h-full overflow-hidden"
      >
        {open && (
          <>
            <Background type="fixed" />

            <button className="danger absolute right-6 top-6 !py-0 z-1" onClick={() => close()}>
              X
            </button>

            {children}
          </>
        )}
      </dialog>
    </>
  );
}
