// Career as a timeline: overview bar on top, vertical rail of companies, one card per project.
import { EXPERIENCE, DATACENTER, GALLERY, t } from './content.js';

const Y0 = 2013, Y1 = 2027;
const ym = (s) => { const m = s.match(/(\d{4})(?:\.(\d{2}))?/); return +m[1] + ((+m[2] || 1) - 1) / 12; };
const span = (p) => {
  const [a, b] = p.split('–').map((x) => x.trim());
  return [ym(a), /Present/.test(b) ? 2026.8 : ym(b) + 1 / 12];
};
const pct = (y) => ((y - Y0) / (Y1 - Y0)) * 100;
const nowLabel = (p) => t(p.replace('Present', 'Now'), p.replace('Present', '현재'));
const COUNTRY = { us: ['United States', '미국'], kr: ['Korea', '한국'], pl: ['Poland', '폴란드'], hu: ['Hungary', '헝가리'],
  cn: ['China', '중국'], ca: ['Canada', '캐나다'], cl: ['Chile', '칠레'], sa: ['Saudi Arabia', '사우디아라비아'] };
const STATE = { az: ['Arizona', '애리조나'], in: ['Indiana', '인디애나'], mi: ['Michigan', '미시간'], oh: ['Ohio', '오하이오'] };
// country flag, plus the state flag for US projects (state flags: Wikimedia Commons, public domain)
const flag = (cc, st) => {
  if (!cc) return '';
  const imgs = `<img src="flags/${cc}.svg" alt="" width="48" height="36">${st ? `<img class="t2-state" src="flags/${cc}-${st}.svg" alt="" width="48" height="36" loading="lazy">` : ''}`;
  const label = st ? t(`${STATE[st][0]}, ${COUNTRY[cc][0]}`, `${COUNTRY[cc][1]} · ${STATE[st][1]}`) : t(COUNTRY[cc][0], COUNTRY[cc][1]);
  return `<span class="t2-flag"><span class="t2-flags">${imgs}</span>${label}</span>`;
};
const thumb = (n) => {
  const g = GALLERY[n - 1], id = String(n).padStart(2, '0');
  return `<button type="button" class="ph-btn t2-ph" data-full="gallery/g${id}.jpg" aria-label="${g[0]}"><img src="gallery/g${id}_s.jpg" alt="${g[0]}" loading="lazy"></button>`;
};

export function renderTimeline2() {
  // overview bar
  const ticks = [];
  for (let y = Y0; y <= 2026; y++) ticks.push(`<span style="left:${pct(y)}%">${y % 2 ? '' : y}</span>`);
  const segs = EXPERIENCE.map((e, i) => {
    const [a, b] = span(e.period);
    return `<a class="t2-seg${i === 0 ? ' t2-cur' : ''}" href="#t2-${i}" style="left:${pct(a)}%;width:${pct(b) - pct(a)}%">${t(e.co[0], e.co[1])}</a>`;
  }).join('');
  const [da, db] = span(DATACENTER.period);
  const dc = `<span class="t2-seg dc" style="left:${pct(da)}%;width:${pct(db) - pct(da)}%" title="Data center">${t('DC', 'DC')}</span>`;

  // vertical rail
  const nodes = EXPERIENCE.map((e, i) => {
    const [a, b] = span(e.period);
    const yrs = Math.round((b - a) * 10) / 10;
    const projects = e.projects.map((p) => `
        <li class="t2-pj">
          <div class="t2-when">${nowLabel(p.period)}${flag(p.cc, p.st)}</div>
          <div class="t2-body">
            <h4>${t(p.name[0], p.name[1])}</h4>
            ${p.role || p.size ? `<p class="t2-meta">${[p.role, p.size].filter(Boolean).map((x) => `<span class="t2-tag">${t(x[0], x[1])}</span>`).join('')}</p>` : ''}
            ${p.points.length ? `<ul class="t2-pts">${p.points.map((x) => t(x[0], x[1], 'li')).join('')}</ul>` : ''}
            ${p.result ? `<p class="t2-result">${t(p.result[0], p.result[1])}</p>` : ''}
          </div>
          ${p.photos ? `<div class="t2-photos">${p.photos.slice(0, 2).map(thumb).join('')}</div>` : '<div></div>'}
        </li>`).join('');
    const side = i === 0 ? `
        <li class="t2-pj t2-side">
          <div class="t2-when">${nowLabel(DATACENTER.period)}${flag(DATACENTER.cc)}</div>
          <div class="t2-body">
            <h4>${t('Data center cooling, technical sales lead (in parallel)', '데이터센터 냉각 기술영업 팀장 (병행)')}</h4>
            <ul class="t2-pts">${DATACENTER.points.slice(0, 3).map((x) => t(x[0], x[1], 'li')).join('')}</ul>
          </div><div></div>
        </li>` : '';
    return `
    <li class="t2-node${i === 0 ? ' t2-cur' : ''}" id="t2-${i}">
      <div class="t2-years"><b>${e.period.slice(0, 4)}</b><span>${/Present/.test(e.period) ? t('Now', '현재') : e.period.slice(-7, -3)}</span><em>${t(`${yrs} yrs`, `${yrs}년`)}</em></div>
      <div class="t2-dot" aria-hidden="true"></div>
      <div class="t2-co">
        <header>
          <h3>${t(e.co[0], e.co[1])}</h3>
          <p>${t(e.role[0], e.role[1])}</p>
          <span class="t2-loc">${t(e.where[0], e.where[1])}</span>
        </header>
        <ol class="t2-pjs">${side}${projects}</ol>
      </div>
    </li>`;
  }).join('');

  return `
  <div class="t2-over" aria-label="Career overview">
    <div class="t2-track">${segs}${dc}</div>
    <div class="t2-ticks">${ticks.join('')}</div>
  </div>
  <ol class="t2-rail">${nodes}</ol>`;
}
