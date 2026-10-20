// Page widgets that do not depend on WebGL: e-mail link and copy button, and the photo lightbox.
import { lang } from './i18n.js';

export function initUI() {
  // address is split in the markup to keep it out of simple scrapers
  const mail = document.getElementById('mail');
  const addr = mail ? `${mail.dataset.u}@${mail.dataset.d}` : '';
  if (mail) {
    // the subject line tells the inbox this is a recruiting message
    mail.href = `mailto:${addr}?subject=${encodeURIComponent('[포지션 제안] 송찬영님께 / Role for Jacob Song')}`;
    mail.textContent = addr;
  }
  // resume request: opens a mail with subject and a short body
  const cv = document.getElementById('cv');
  if (cv) cv.href = `mailto:${cv.dataset.u}@${cv.dataset.d}?subject=${encodeURIComponent('[이력서 요청] 송찬영님 / Resume request for Jacob Song')}&body=${encodeURIComponent('안녕하세요,\n\n상세 이력서를 받아볼 수 있을까요?\n회사 / 포지션:\n\nHello Jacob,\nCould you send me your full resume?\nCompany / role:\n')}`;

  // mobile menu
  const bar = document.getElementById('bar'), menu = document.getElementById('menu-btn');
  if (bar && menu) {
    const set = (open) => { bar.classList.toggle('open', open); menu.setAttribute('aria-expanded', open); };
    menu.addEventListener('click', () => set(!bar.classList.contains('open')));
    bar.querySelectorAll('.nav a').forEach((a) => a.addEventListener('click', () => set(false)));
    addEventListener('keydown', (e) => { if (e.key === 'Escape') set(false); });
  }

  const copy = document.getElementById('copy'), copied = document.getElementById('copied');
  if (copy) copy.addEventListener('click', async () => {
    try { await navigator.clipboard.writeText(addr); copied.textContent = lang === 'ko' ? '복사했습니다' : 'Copied'; }
    catch (e) { copied.textContent = addr; }
    setTimeout(() => { copied.textContent = ''; }, 2400);
  });

  const lb = document.getElementById('lb'), img = document.getElementById('lb-img'), cap = document.getElementById('lb-cap');
  document.querySelectorAll('.ph-btn').forEach((b) => b.addEventListener('click', () => {
    const fc = b.closest('figure').querySelector('figcaption');
    img.src = b.dataset.full; img.alt = fc.textContent; cap.textContent = fc.textContent;
    if (lb.showModal) lb.showModal(); else window.open(b.dataset.full, '_blank');
  }));
  lb.addEventListener('click', (e) => { if (e.target === lb) lb.close(); });
  lb.addEventListener('close', () => { img.removeAttribute('src'); });
}
