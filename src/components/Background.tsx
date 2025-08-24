export function Background() {
  return (
    <>
      <svg width="0" height="0">
        <filter id="noiseFilter">
          <feTurbulence type="fractalNoise" baseFrequency="0.5" numOctaves="3" stitchTiles="stitch" />
        </filter>
      </svg>
      <div className="absolute inset-0 -z-1" style={{ filter: 'url(#noiseFilter)' }}></div>
      <div
        className="absolute inset-0 -z-1 mix-blend-multiply"
        style={{ backgroundImage: 'radial-gradient(circle, #1a213e, #121936)', filter: 'brightness(1.5)' }}
      ></div>
    </>
  );
}
