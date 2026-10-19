import { defineConfig } from 'vite';
import * as C from './src/content.js';

// Fills <!--@experience--> style markers in index.html with the career content, so it ships as static HTML.
const BLOCKS = {
  matrix: C.renderMatrix, domains: C.renderDomains, services: C.renderServices, skillrows: C.renderSkillRows,
  timeline: C.renderTimeline, carousel: C.renderCarousel, education: C.renderEducation, certs: C.renderCerts,
  sites: C.renderSites, clients: () => C.CLIENTS,
};
const careerContent = () => ({
  name: 'career-content',
  transformIndexHtml: (html) => html.replace(/<!--@(\w+)-->/g, (m, k) => (BLOCKS[k] ? BLOCKS[k]() : m)),
});

// base './' keeps the build portable to GitHub Pages project paths or Vercel
export default defineConfig({
  base: './',
  plugins: [careerContent()],
  server: { port: 5173, strictPort: true, watch: { ignored: ['**/data/**', '**/shots/**'] } },
  build: { target: 'es2020', chunkSizeWarningLimit: 900 },
});
