import { defineConfig } from 'vite';
import { existsSync, readdirSync } from 'node:fs';
import * as C from './src/content.js';
import { renderTimeline2 } from './src/timeline2.js';

// Fills <!--@experience--> style markers in index.html with the career content, so it ships as static HTML.
const BLOCKS = {
  matrix: C.renderMatrix, domains: C.renderDomains, services: C.renderServices, skillrows: C.renderSkillRows,
  timeline: renderTimeline2, carousel: C.renderCarousel, education: C.renderEducation, certs: C.renderCerts,
  sites: C.renderSites, radar: C.renderRadar, metrics: C.renderMetrics,
  clients: () => C.renderClients(new Set(existsSync('public/logos') ? readdirSync('public/logos') : [])),
};
const careerContent = () => ({
  name: 'career-content',
  transformIndexHtml: (html) => html
    .replace(/<!--@(\w+)-->/g, (m, k) => (BLOCKS[k] ? BLOCKS[k]() : m))
    // Korean is the default language: text-only elements carrying data-ko ship with the Korean text
    .replace(/(<(\w+)\b[^>]*\sdata-ko="([^"]*)"[^>]*>)([^<]*)(<\/\2>)/g, (m, open, tag, ko, inner, close) => open + ko + close),
});

// base './' keeps the build portable to GitHub Pages project paths or Vercel
export default defineConfig({
  base: './',
  plugins: [careerContent()],
  server: { port: 5173, strictPort: true, watch: { ignored: ['**/data/**', '**/shots/**'] } },
  build: { target: 'es2020', chunkSizeWarningLimit: 900 },
});
