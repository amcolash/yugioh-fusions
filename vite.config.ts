import tailwindcss from '@tailwindcss/vite';
import { defineConfig } from 'vite';
import { ViteImageOptimizer } from 'vite-plugin-image-optimizer';
import { VitePWA } from 'vite-plugin-pwa';
import tsconfigPaths from 'vite-tsconfig-paths';

export default defineConfig({
  base: '/yugioh-fusions/',
  build: {
    sourcemap: true,
  },
  server: {
    host: '0.0.0.0',
  },

  plugins: [
    tsconfigPaths(),
    tailwindcss(),
    ViteImageOptimizer({ png: { quality: 50 } }),
    VitePWA({
      // devOptions: {
      //   enabled: true,
      // },

      registerType: 'autoUpdate',

      workbox: {
        globPatterns: ['!screenshots/**', '!icons/**', '**/*.{js,css,html,ico,png,svg,map,ttf}'],
        maximumFileSizeToCacheInBytes: 5 * 1024 * 1024,
      },

      manifest: {
        name: 'Yugi-Oh! Fusions',
        short_name: 'Fusions',
        description: 'Yugi-Oh! Forbidden Memories fusions reference and deck builder',
        start_url: '/yugioh-fusions/',
        theme_color: '#0284c7',
        background_color: '#161625',
        icons: [
          {
            purpose: 'any',
            sizes: '256x256',
            src: 'icons/icon.png',
            type: 'image/png',
          },
          {
            purpose: 'maskable',
            sizes: '192x192',
            src: 'icons/icon-maskable.png',
            type: 'image/png',
          },
        ],
        screenshots: [
          {
            src: 'screenshots/desktop-1.jpg',
            form_factor: 'wide',
            sizes: '3240x1880',
            type: 'image/jpeg',
            label: 'Fusion List',
          },
          {
            src: 'screenshots/desktop-2.jpg',
            form_factor: 'wide',
            sizes: '3240x1880',
            type: 'image/jpeg',
            label: 'Card Stats',
          },
          {
            src: 'screenshots/phone-1.jpg',
            form_factor: 'narrow',
            sizes: '1082x2402',
            type: 'image/jpeg',
            label: 'Card List',
          },
          {
            src: 'screenshots/phone-2.jpg',
            form_factor: 'narrow',
            sizes: '1082x2402',
            type: 'image/jpeg',
            label: 'Fusion List',
          },
        ],
        orientation: 'portrait',
        display: 'standalone',
        lang: 'en-US',
      },
    }),
  ],
});
