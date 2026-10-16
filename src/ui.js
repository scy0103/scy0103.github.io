// Page widgets that do not depend on WebGL: e-mail link and the gallery lightbox.
export function initUI() {
  // address is split in the markup to keep it out of simple scrapers
  const mail = document.getElementById('mail');
  if (mail) {
    const addr = `${mail.dataset.u}@${mail.dataset.d}`;
    mail.href = `mailto:${addr}`;
    mail.textContent = addr;
  }

  const lb = document.getElementById('lb'), img = document.getElementById('lb-img'), cap = document.getElementById('lb-cap');
  document.querySelectorAll('.ph-btn').forEach((b) => b.addEventListener('click', () => {
    const fig = b.closest('figure'), fc = fig.querySelector('figcaption');
    img.src = b.dataset.full; img.alt = fc.textContent; cap.textContent = fc.textContent;
    if (lb.showModal) lb.showModal(); else window.open(b.dataset.full, '_blank');
  }));
  lb.addEventListener('click', (e) => { if (e.target === lb) lb.close(); });
  lb.addEventListener('close', () => { img.removeAttribute('src'); });
}
