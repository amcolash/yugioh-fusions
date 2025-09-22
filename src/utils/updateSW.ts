import { registerSW } from 'virtual:pwa-register';

const intervalMS = 5 * 60 * 1000;

// Attempt to check for updates every 5 minutes
export const updateSW = registerSW({
  onRegisteredSW(swUrl, registration) {
    if (registration) {
      const update = async () => {
        if (registration.installing || !navigator) return;

        if ('connection' in navigator && !navigator.onLine) return;

        const resp = await fetch(swUrl, {
          cache: 'no-store',
          headers: {
            cache: 'no-store',
            'cache-control': 'no-cache',
          },
        });

        if (resp?.status === 200) await registration.update();
      };

      update();
      setInterval(async () => update(), intervalMS);
    }
  },
});
