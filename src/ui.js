// Page widgets that do not depend on WebGL: e-mail link and copy button, and the photo lightbox.
import { lang } from './i18n.js';

export function initUI() {
  // address is split in the markup to keep it out of simple scrapers
  const mail = document.getElementById('mail');
  const addr = mail ? `${mail.dataset.u}@${mail.dataset.d}` : '';
  if (mail) { mail.href = `mailto:${addr}`; mail.textContent = addr; }
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
