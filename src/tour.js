import { lang, onLang } from './i18n.js';

// 60-second guided tour: the page scrolls itself through six stops with one caption each.
// Any wheel, touch or key press from the visitor hands control back.
const STOPS = [
  { id: 'summary', dwell: 7000,
    c: ['Three US battery projects, all finished ahead of plan. Two came in 10 to 15% under budget.', '미국 배터리 프로젝트 3건 모두 계획보다 일찍 준공했고, 2건은 예산 대비 10~15% 절감했습니다.'] },
  { id: 's1', center: true, dwell: 7000,
    c: ['I modeled this CESS supply system in Revit: 3,850 m of pipe, 441 valves.', '제가 Revit으로 모델링한 CESS 공급 시스템입니다. 배관 3,850 m, 밸브 441개.'] },
  { id: 's4', center: true, dwell: 7000,
    c: ['Clashes are settled in the model first. On site I chair the three-contractor clash meetings.', '간섭은 모델에서 먼저 정리하고, 현장에서는 시공 3사 간섭 미팅을 직접 주관합니다.'] },
  { id: 'lab-stage', center: true, dwell: 14000, lab: true,
    c: ['Model and schedule in one head: the plant goes up in installation order, ahead of plan.', '모델과 공정을 함께 봅니다. 설치 순서대로 올라가고, 계획보다 일찍 끝납니다.'] },
  { id: 'skills', dwell: 7000,
    c: ['13 years, 8 countries, 13 projects.', '13년, 8개국, 프로젝트 13건.'] },
  { id: 'contact', dwell: 0, end: true,
    c: ['Open to EPC PM, CM and project engineer roles. US employment requires visa sponsorship.', 'EPC PM, CM, 프로젝트 엔지니어 포지션 제안을 기다립니다. 미국 취업은 VISA 스폰서가 필요합니다.'] },
];

export function initTour(lab) {
  const bar = document.getElementById('tour');
  if (!bar) return;
  const cap = document.getElementById('tour-cap'), dots = document.getElementById('tour-dots'), exit = document.getElementById('tour-exit'), endBox = document.getElementById('tour-end');
  const root = document.documentElement;
  const mail = document.getElementById('mail'), tourMail = document.getElementById('tour-mail');
  if (mail && tourMail) tourMail.href = mail.href; // initUI has already built the mailto link
  let run = null; // { i, raf, timer }
  dots.innerHTML = STOPS.map(() => '<i></i>').join('');
  const text = () => { if (run) cap.textContent = STOPS[run.i].c[lang === 'ko' ? 1 : 0]; };
  onLang(text);

  const yOf = (s) => {
    const el = document.getElementById(s.id); if (!el) return window.scrollY;
    const r = el.getBoundingClientRect(), vh = window.innerHeight;
    const y = s.center && r.height < vh - 90 ? r.top + window.scrollY + (r.height - vh) / 2 + 30 : r.top + window.scrollY - 76; // +30 keeps a centred block clear of the caption bar
    return Math.max(0, Math.min(root.scrollHeight - vh, y));
  };
  const stop = (keepEnd) => {
    if (!run) return;
    cancelAnimationFrame(run.raf); clearTimeout(run.timer); run = null;
    root.style.scrollBehavior = '';
    root.classList.remove('touring');
    if (!keepEnd) { bar.hidden = true; }
    ['wheel', 'touchstart', 'keydown'].forEach((ev) => window.removeEventListener(ev, userTook, true));
  };
  const userTook = (e) => { if (e.type === 'keydown' && !['Escape', 'ArrowDown', 'ArrowUp', 'PageDown', 'PageUp', ' ', 'Home', 'End'].includes(e.key)) return; stop(false); };
  const go = (i) => {
    const s = STOPS[i]; run.i = i;
    dots.querySelectorAll('i').forEach((d, k) => { d.className = k < i ? 'done' : k === i ? 'on' : ''; d.style.setProperty('--t', (s.dwell + 2400) + 'ms'); });
    text(); endBox.hidden = !s.end;
    const y0 = window.scrollY, t0 = performance.now(), dur = 2400;
    const step = (t) => {
      if (!run) return;
      const u = Math.min(1, (t - t0) / dur), e = u * u * (3 - 2 * u);
      window.scrollTo(0, y0 + (yOf(s) - y0) * e); // the target is re-read each frame: lazy content above it can still change the layout
      if (u < 1) { run.raf = requestAnimationFrame(step); return; }
      if (s.lab && lab) lab.play();
      if (s.end) { stop(true); return; }
      run.timer = setTimeout(() => { if (run) go(i + 1); }, s.dwell);
    };
    run.raf = requestAnimationFrame(step);
  };
  const start = () => {
    stop(false);
    run = { i: 0, raf: 0, timer: 0 };
    root.style.scrollBehavior = 'auto';
    root.classList.add('touring');
    bar.hidden = false;
    ['wheel', 'touchstart', 'keydown'].forEach((ev) => window.addEventListener(ev, userTook, { capture: true, passive: true }));
    go(0);
  };
  document.addEventListener('click', (e) => { if (e.target.closest('[data-tour]')) { e.preventDefault(); start(); } });
  exit.addEventListener('click', () => { stop(false); bar.hidden = true; });
  window.__tour = { start, stop: () => stop(false), state: () => (run ? run.i : -1) };
}
