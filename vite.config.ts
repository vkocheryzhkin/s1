import { copyFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

import react from '@vitejs/plugin-react';
import { checker } from 'vite-plugin-checker';
import readableClassnames from 'vite-plugin-readable-classnames';
import sassDts from 'vite-plugin-sass-dts';
import tsconfigPaths from 'vite-tsconfig-paths';
import { defineConfig } from 'vitest/config';

const __dirname = dirname(fileURLToPath(import.meta.url));

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    checker({
      typescript: true,
    }),
    react(),
    readableClassnames(),
    sassDts({
      enabledMode: ['development'],
      esmExport: true,
    }),
    tsconfigPaths(),
    {
      name: 'gh-pages-spa-fallback',
      closeBundle() {
        const outDir = resolve(__dirname, 'dist');
        copyFileSync(resolve(outDir, 'index.html'), resolve(outDir, '404.html'));
      },
    },
  ],
  base: '/s1/',
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: ['./src/setupTests.ts'],
    exclude: ['e2e/**', 'tests/**', 'node_modules/**', 'dist/**'],
    passWithNoTests: true,
  },
  server: {
    open: true,
  },
});
