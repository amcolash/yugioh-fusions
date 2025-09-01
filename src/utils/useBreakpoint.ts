import { useEffect, useState } from 'react';

// breakpoints should be const numbers, then I can do math comparison, like size > breakpoint.md
export const Breakpoint = {
  sm: 640,
  md: 768,
  lg: 1024,
  xl: 1280,
  '2xl': 1536,
};

export function useBreakpoint() {
  const [breakpoint, setBreakpoint] = useState(getBreakpoint());

  useEffect(() => {
    const handleResize = () => setBreakpoint(getBreakpoint());

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return breakpoint;
}

function getBreakpoint() {
  const width = window.innerWidth;
  if (width >= Breakpoint['2xl']) return Breakpoint['2xl'];
  if (width >= Breakpoint.xl) return Breakpoint.xl;
  if (width >= Breakpoint.lg) return Breakpoint.lg;
  if (width >= Breakpoint.md) return Breakpoint.md;
  return Breakpoint.sm;
}
