import { defineConfig } from 'vite';

// base './' keeps the build portable to GitHub Pages project paths or Vercel
export default defineConfig({
  base: './',
  server: { port: 5173, strictPort: true },
  build: { target: 'es2020', chunkSizeWarningLimit: 900 },
});
