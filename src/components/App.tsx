import { Tooltip } from 'react-tooltip';
import { useHand, useRecentCards } from 'utils/state';
import { useIsMobile } from 'utils/useIsMobile';

import { usePantry } from '../utils/pantry';
import { Background } from './Background';
import { Fusions } from './Fusions';
import { Hand } from './Hand';
import { Loader } from './Loader';
import { RecentCards, RecentModal } from './RecentCards';
import { Search } from './Search';

export function App() {
  const mobile = useIsMobile();
  const { loading } = usePantry();

  const [hand] = useHand();
  const [recentCards] = useRecentCards();

  return (
    <>
      <Background type="fixed" />
      <Loader loading={loading} />

      <div
        className={`flex gap-12 w-full justify-center transition-opacity duration-1000 delay-700 ${loading ? 'opacity-0' : 'opacity-100'}`}
      >
        <div className="grid gap-8 content-start w-screen sm:min-w-md">
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
            <Tooltip id="stats-tooltip" border="1px solid var(--color-gray-500)" opacity={0.95} />
          </>
        )}
      </div>
    </>
  );
}
