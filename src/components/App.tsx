import { Tooltip } from 'react-tooltip';

import { useIsMobile } from '../hooks/useIsMobile';
import { usePantry } from '../hooks/usePantry';
import { useHand, useRecentCards } from '../utils/state';
import { Background } from './Background';
import { Fusions } from './Fusions';
import { Hand } from './Hand';
import { Loader } from './Loader';
import { RecentCards, RecentModal } from './RecentCards';
import { Search } from './Search';

export function App() {
  const mobile = useIsMobile();
  const { loading } = usePantry();
  // const { loading } = useLocalStorage();

  const [hand] = useHand();
  const [recentCards] = useRecentCards();

  return (
    <>
      <div
        className={`fixed inset-0 z-20 pointer-events-none`}
        style={{
          backgroundImage: 'linear-gradient(to bottom, transparent 50%, rgba(0, 0, 0, 0.15) 51%)',
          backgroundSize: '4px 4px',
        }}
      ></div>

      <Background type="fixed" />
      <Loader loading={loading} />

      <div
        className={`flex gap-12 w-full justify-center transition-opacity duration-1000 delay-700 ${loading ? 'opacity-0' : 'opacity-100'}`}
      >
        <div className="grid gap-8 content-start sm:min-w-md sm:max-w-md">
          {(hand.length === 0 || !mobile) && <h1 className="text-center">Yugi-Oh! Fusion Combinations</h1>}
          <Search />

          {mobile && <RecentModal />}

          <Hand />
          <Fusions />
        </div>

        {!mobile && (
          <>
            <div className={hand.length > 0 || Object.keys(recentCards).length > 0 ? 'border-l border-sky-800' : ''} />
            <RecentCards />
            <Tooltip id="stats-tooltip" border="1px solid var(--color-gray-500)" opacity={0.9} />
          </>
        )}
      </div>
    </>
  );
}
