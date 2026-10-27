import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
import { cloudflare } from '@cloudflare/vite-plugin';

export default defineConfig({
  plugins: [react(), tailwindcss(), cloudflare()],
  server: { allowedHosts: ['terminal.local'] },
  build: {
    sourcemap: true,
    assetsInlineLimit: 2048,
  },
});
