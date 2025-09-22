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
      // Exclude manifest icons as they are already precached from precache glob pattern
      includeManifestIcons: false,

      workbox: {
        globPatterns: ['**/*.{js,css,html,ico,png,svg,map,ttf}'],
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
            src: 'icon.png',
            type: 'image/png',
          },
          {
            purpose: 'maskable',
            sizes: '192x192',
            src: 'icon-maskable.png',
            type: 'image/png',
          },
        ],
        orientation: 'portrait',
        display: 'standalone',
        lang: 'en-US',
      },
    }),
  ],
});
