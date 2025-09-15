import { useEffect } from 'react';
import { useModalData, useRecentModal } from 'utils/state';

export const useStackedModalHistory = () => {
  const [recentModal, setRecentModal] = useRecentModal();
  const [modalData, setModalData] = useModalData();

  useEffect(() => {
    const currentHash = window.location.hash;

    if (modalData) {
      if (currentHash !== '#modalData') window.location.hash = 'modalData';
    } else if (recentModal) {
      if (currentHash !== '#recentCards') window.location.hash = 'recentCards';
    } else {
      // If no modals are open but a modal hash is present, go back.
      if (currentHash === '#recentCards' || currentHash === '#modalData') {
        history.back();
      }
    }
  }, [modalData, recentModal]);

  useEffect(() => {
    const handleHashChange = () => {
      const currentHash = window.location.hash;
      if (modalData && (currentHash === '#recentCards' || currentHash === '')) {
        setModalData(undefined);
      } else if (recentModal && currentHash === '') {
        setRecentModal(false);
      }
    };

    window.addEventListener('hashchange', handleHashChange);
    return () => {
      window.removeEventListener('hashchange', handleHashChange);
    };
  }, [recentModal, setRecentModal, modalData, setModalData]);

  // The function to be used by the 'X' button in any modal.
  const closeCurrentModal = () => {
    if (window.location.hash !== '') {
      history.back();
    }
  };

  return closeCurrentModal;
};
