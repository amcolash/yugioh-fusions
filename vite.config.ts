import tailwindcss from '@tailwindcss/vite';
import { defineConfig } from 'vite';
import tsconfigPaths from 'vite-tsconfig-paths';

export default defineConfig({
  base: '/yugioh-fusions/',
  plugins: [tsconfigPaths(), tailwindcss()],
  server: {
    host: '0.0.0.0',
  },
});
