// Background music: "Rhythmania 2" by August Wilhelmsson (Epidemic Sound), played from 0:17 and looped from there.
// Off by default: it plays only when the visitor presses the header button and never starts on its own.
import { lang, onLang } from './i18n.js';

const START = 17;

export function initBgm() {
  const btn = document.getElementById('bgm'); if (!btn) return;
  const audio = new Audio('audio/bgm.mp3');
  audio.preload = 'none'; audio.volume = 0.35;
  let playing = false;
  // the accessible name stays fixed and aria-pressed carries the state; the tooltip names the next action
  const label = () => {
    const ko = lang === 'ko';
    btn.setAttribute('aria-pressed', playing);
    btn.classList.toggle('on', playing);
    btn.setAttribute('aria-label', ko ? '배경음악' : 'Background music');
    btn.title = ko ? (playing ? '배경음악 끄기' : '배경음악 켜기') : (playing ? 'Music off' : 'Music on');
  };
  const play = () => {
    if (audio.currentTime < START) audio.currentTime = START;
    audio.play().then(() => { playing = true; label(); }).catch(() => { playing = false; label(); });
  };
  const stop = () => { audio.pause(); playing = false; label(); };
  // loop from 0:17, not from the start of the file
  audio.addEventListener('ended', () => { audio.currentTime = START; audio.play(); });
  audio.addEventListener('loadedmetadata', () => { if (audio.currentTime < START) audio.currentTime = START; });

  btn.addEventListener('click', (e) => { e.stopPropagation(); if (playing) stop(); else play(); });
  onLang(label); label();
}
