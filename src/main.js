import { initLang } from './i18n.js';
import { initUI } from './ui.js';
import { initStory } from './story.js';
import { initDashboard } from './dashboard.js';
import { initGlobe } from './globe.js';
import { initCarousel } from './carousel.js';
import { initMotion } from './motion.js';
import { initFx } from './fx.js';
import './fx.css';

// The 3D FX layer (hero, bloom stage, glass cards, tilt, cursor) is on by default; ?fx=0 shows the plain site.
const fx = new URLSearchParams(location.search).get('fx') !== '0';
if (fx) document.documentElement.classList.add('fx');

initLang();
initUI();
initMotion();
const A = initStory();     // loads the Project A model once; the dashboard turntable and the FX hero reuse it
initDashboard(A);
initGlobe();
initCarousel();
if (fx) initFx(A);
