// EN / KO toggle. Every translatable node carries data-en and data-ko.
const listeners = [];
export let lang = 'ko';

export function setLang(l) {
  lang = l;
  document.documentElement.lang = l;
  document.title = l === 'ko' ? '송찬영 Jacob Song | 플랜트 배관 설계, 해외 현장 PM' : 'Jacob Song | EPC Project Manager, Plant Piping Design & Hook-up';
  document.querySelectorAll('[data-en]').forEach((el) => { el.textContent = el.getAttribute('data-' + l); });
  // accessible names and image descriptions follow the language too
  document.querySelectorAll('[data-aria-en]').forEach((el) => { el.setAttribute(el.tagName === 'IMG' ? 'alt' : 'aria-label', el.getAttribute('data-aria-' + l)); });
  document.querySelectorAll('[data-title-en]').forEach((el) => { el.title = el.getAttribute('data-title-' + l); });
  // resume links: Korean resume for KO, English resume for EN
  document.querySelectorAll('[data-href-en]').forEach((el) => {
    el.setAttribute('href', el.getAttribute('data-href-' + l));
    el.setAttribute('download', el.getAttribute('data-dl-' + l));
  });
  document.getElementById('lang-en').setAttribute('aria-pressed', l === 'en');
  document.getElementById('lang-ko').setAttribute('aria-pressed', l === 'ko');
  listeners.forEach((fn) => fn(l));
  try { localStorage.setItem('cys-lang-v3', l); } catch (e) { /* storage blocked */ }
}

export function onLang(fn) { listeners.push(fn); fn(lang); }

export function initLang() {
  // a visitor's choice replaces a ?lang= in the address, so a reload or a shared link keeps the language they picked
  const choose = (l) => { setLang(l); try { const u = new URL(location.href); if (u.searchParams.has('lang')) { u.searchParams.set('lang', l); history.replaceState(null, '', u); } } catch (e) { /* address left as it was */ } };
  document.getElementById('lang-en').addEventListener('click', () => choose('en'));
  document.getElementById('lang-ko').addEventListener('click', () => choose('ko'));
  let saved = null;
  try { saved = localStorage.getItem('cys-lang-v3'); } catch (e) { /* storage blocked */ }
  const q = new URLSearchParams(location.search).get('lang');
  // ?lang= wins, then the visitor's last choice, then the browser: Korean browsers get Korean, everyone else English
  const browser = (navigator.languages && navigator.languages[0]) || navigator.language || 'ko';
  const pick = q || saved || (/^ko\b/i.test(browser) ? 'ko' : 'en');
  setLang(pick === 'en' ? 'en' : 'ko');
}
