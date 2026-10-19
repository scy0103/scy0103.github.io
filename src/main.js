import { initLang } from './i18n.js';
import { initUI } from './ui.js';
import { initStory } from './story.js';
import { initDashboard } from './dashboard.js';
import { initGlobe } from './globe.js';
import { initCarousel } from './carousel.js';
import { initMotion } from './motion.js';

initLang();
initUI();
initMotion();
const A = initStory();     // loads the Project A model once; the dashboard turntable reuses it
initDashboard(A);
initGlobe();
initCarousel();
