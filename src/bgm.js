// Background music: "Rhythmania 2" by August Wilhelmsson (Epidemic Sound), played from 0:14 and looped from there.
// Browsers block sound until the visitor interacts, so it starts on the first click/tap/key,
// and the header button turns it on and off (remembered per visitor).
import { lang, onLang } from './i18n.js';

const START = 14;

export function initBgm() {
  const btn = document.getElementById('bgm'); if (!btn) return;
  const audio = new Audio('audio/bgm.mp3');
  audio.preload = 'none'; audio.volume = 0.35;
  let off = false; try { off = localStorage.getItem('cys-bgm') === 'off'; } catch (e) { /* storage blocked */ }
  let playing = false;
  const label = () => {
    btn.setAttribute('aria-pressed', playing);
    btn.classList.toggle('on', playing);
    btn.title = lang === 'ko' ? (playing ? '배경음악 끄기' : '배경음악 켜기') : (playing ? 'Music off' : 'Music on');
    btn.setAttribute('aria-label', btn.title);
  };
  const play = () => {
    if (audio.currentTime < START) audio.currentTime = START;
    audio.play().then(() => { playing = true; label(); }).catch(() => { playing = false; label(); });
  };
  const stop = () => { audio.pause(); playing = false; label(); };
  // loop from 0:14, not from the start of the file
  audio.addEventListener('ended', () => { audio.currentTime = START; audio.play(); });
  audio.addEventListener('loadedmetadata', () => { if (audio.currentTime < START) audio.currentTime = START; });

  btn.addEventListener('click', (e) => {
    e.stopPropagation();
    off = playing; try { localStorage.setItem('cys-bgm', off ? 'off' : 'on'); } catch (err) { /* ignore */ }
    if (playing) stop(); else play();
  });
  const first = () => { removeEventListener('pointerdown', first, true); removeEventListener('keydown', first, true); if (!off && !playing) play(); };
  addEventListener('pointerdown', first, true); addEventListener('keydown', first, true);
  onLang(label); label();
}
