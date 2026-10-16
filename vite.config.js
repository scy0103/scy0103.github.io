import { defineConfig } from 'vite';
import * as C from './src/content.js';

// Fills <!--@experience--> style markers in index.html with the career content, so it ships as static HTML.
const BLOCKS = {
  experience: C.renderExperience, datacenter: C.renderDatacenter, countries: C.renderCountries,
  skills: C.renderSkills, education: C.renderEducation, certs: C.renderCerts, gallery: C.renderGallery,
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
