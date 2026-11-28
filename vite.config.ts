/// <reference types="vitest/config" />
import { fileURLToPath } from 'node:url';
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { avatarSource } from './vite/avatar-source';

export default defineConfig({
  plugins: [react(), avatarSource({ dir: fileURLToPath(new URL('./html', import.meta.url)) })],
  build: {
    target: 'es2022',
    // three is one 500 kB library every character needs; it is split out and cached, not worth warning about.
    chunkSizeWarningLimit: 600,
    rollupOptions: {
      // Three pages ship: the studio, the Get yours page, and /loader.html, an unlinked lab for testing the orbit
      // loader on its own in any browser.
      input: {
        main: fileURLToPath(new URL('./index.html', import.meta.url)),
        'get-yours': fileURLToPath(new URL('./get-yours.html', import.meta.url)),
        loader: fileURLToPath(new URL('./loader.html', import.meta.url)),
      },
      // three is shared by every character: one cached chunk instead of four copies.
      output: { manualChunks: { three: ['three'] } },
    },
  },
  test: { include: ['vite/__tests__/**/*.test.ts', 'src/**/*.test.ts'] },
});
