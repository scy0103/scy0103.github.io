// EN / KO toggle. Every translatable node carries data-en and data-ko.
const listeners = [];
export let lang = 'ko';

export function setLang(l) {
  lang = l;
  document.documentElement.lang = l;
  document.querySelectorAll('[data-en]').forEach((el) => { el.textContent = el.getAttribute('data-' + l); });
  document.getElementById('lang-en').setAttribute('aria-pressed', l === 'en');
  document.getElementById('lang-ko').setAttribute('aria-pressed', l === 'ko');
  listeners.forEach((fn) => fn(l));
  try { localStorage.setItem('cys-lang-v3', l); } catch (e) { /* storage blocked */ }
}

export function onLang(fn) { listeners.push(fn); fn(lang); }

export function initLang() {
  document.getElementById('lang-en').addEventListener('click', () => setLang('en'));
  document.getElementById('lang-ko').addEventListener('click', () => setLang('ko'));
  let saved = null;
  try { saved = localStorage.getItem('cys-lang-v3'); } catch (e) { /* storage blocked */ }
  const q = new URLSearchParams(location.search).get('lang');
  setLang((q || saved) === 'en' ? 'en' : 'ko'); // Korean by default, English on request
}
