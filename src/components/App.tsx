import { useEffect } from 'react';
import { Tooltip } from 'react-tooltip';

import { useIsMobile } from '../hooks/useIsMobile';
import { usePantry } from '../hooks/usePantry';
import { useHand, useRecentCards } from '../utils/state';
import { Background } from './Background';
import { ContextMenu } from './ContextMenu';
import { Fusions } from './Fusions';
import { Hand } from './Hand';
import { Loader } from './Loader';
import { RecentCards, RecentCardsMobile } from './RecentCards';
import { Search } from './Search';

export function App() {
  const mobile = useIsMobile();
  const { loading } = usePantry();
  // const { loading } = useLocalStorage();

  const [hand] = useHand();
  const [recentCards] = useRecentCards();

  useEffect(() => {
    const onBeforeUnload = (e: BeforeUnloadEvent) => {
      if (hand.length > 0) e.preventDefault();
    };

    window.addEventListener('beforeunload', onBeforeUnload);
    return () => window.removeEventListener('beforeunload', onBeforeUnload);
  }, [hand]);

  return (
    <>
      {/* scan lines on top of entire application */}
      <div
        className={`pointer-events-none fixed inset-0 z-20`}
        style={{
          backgroundImage: 'linear-gradient(to bottom, transparent 50%, rgba(0, 0, 0, 0.15) 51%)',
          backgroundSize: '4px 4px',
        }}
      ></div>

      <Background type="fixed" />
      <Loader loading={loading} />

      <div
        className={`flex w-full justify-center gap-12 transition-opacity delay-700 duration-1000 ${loading ? 'opacity-0' : 'opacity-100'}`}
      >
        <ContextMenu />

        <div className="grid content-start gap-8 sm:max-w-md sm:min-w-md">
          {hand.length === 0 && <h1 className="text-center">Forbidden Memories Fusions</h1>}
          <Search />

          {mobile && <RecentCardsMobile />}

          <Hand />
          <Fusions />
        </div>

        {!mobile && (
          <>
            <div className={hand.length > 0 || Object.keys(recentCards).length > 0 ? 'border-l border-sky-800' : ''} />
            <RecentCards />
            <Tooltip id="stats-tooltip" border="1px solid var(--color-gray-500)" opacity={0.93} />
          </>
        )}
      </div>
    </>
  );
}
