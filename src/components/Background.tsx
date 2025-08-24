export function Background({ type }: { type: 'fixed' | 'absolute' }) {
  return (
    <>
      <svg width="0" height="0">
        <filter id="noiseFilter">
          <feTurbulence type="fractalNoise" baseFrequency="0.3" numOctaves="3" stitchTiles="stitch" />
        </filter>
      </svg>
      <div className={`${type} inset-0 -z-1`} style={{ filter: 'url(#noiseFilter)' }}></div>
      <div
        className={`${type} inset-0 -z-1 mix-blend-hard-light`}
        style={{ backgroundImage: 'radial-gradient(circle, #161625, #0b0d15)', filter: 'brightness(1.5)' }}
      ></div>
      <div
        className={`${type} inset-0 -z-1`}
        style={{
          backgroundImage: 'linear-gradient(to bottom, transparent 50%, rgba(0, 0, 0, 0.3) 51%)',
          backgroundSize: '4px 4px',
        }}
      ></div>
    </>
  );
}
