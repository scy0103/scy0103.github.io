// Dashboard card: projects by industry as a donut; pointing at a slice or legend row lists its projects.
import { t } from './content.js';

export const INDUSTRY = [
  { k: ['Battery', '이차전지'], c: '#FF7A1A', p: [
    ['Arizona LGAZ CESS', 'Arizona LGAZ CESS'], ['Kokomo SDI hook-up', 'Kokomo SDI Hook-up'], ['Michigan LGESMI2 CESS', 'Michigan LGESMI2 CESS'],
    ['Ohio Ultium Cells CESS', 'Ohio Ultium Cells CESS'], ['Göd SDIHU #6', '괴드 SDIHU #6'], ['Wrocław P3 CESS', '브로츠와프 P3 CESS'], ['SK On separator', 'SK온 분리막']] },
  { k: ['Semiconductor', '반도체'], c: '#7FA6D6', p: [['Samsung Xi’an operations', '삼성 시안 운영'], ['Samsung Pyeongtaek P3', '삼성 평택 P3 역설계']] },
  { k: ['Plant and infrastructure', '플랜트·인프라'], c: '#C9D6E6', p: [
    ['Yanbu 3, Saudi Arabia', '사우디 얀부 3'], ['Fast Pack, Chile', '칠레 Fast Pack'], ['Seoul Metro Line 2', '서울메트로 2호선'],
    ['Vancouver airport', '밴쿠버 공항'], ['Alaska Route 93', '알래스카 93번 국도'], ['Valve development', '밸브 개발']] },
];

export function renderIndustry() {
  const total = INDUSTRY.reduce((a, d) => a + d.p.length, 0);
  const R = 70, C = 2 * Math.PI * R, gap = 3;
  let off = 0;
  const arcs = INDUSTRY.map((d, i) => {
    const len = C * d.p.length / total;
    const a = `<circle class="in-arc" data-i="${i}" tabindex="0" r="${R}" cx="90" cy="90" stroke="${d.c}" stroke-dasharray="${(len - gap).toFixed(1)} ${(C - len + gap).toFixed(1)}" stroke-dashoffset="${(-off).toFixed(1)}"><title>${d.k[0]} ${d.p.length}</title></circle>`;
    off += len; return a;
  }).join('');
  const top = INDUSTRY[0], pct = Math.round(top.p.length / total * 100);
  const legend = INDUSTRY.map((d, i) => `<li data-i="${i}" tabindex="0"><i style="background:${d.c}"></i>${t(d.k[0], d.k[1], 'span', 'in-k')}<span class="in-n"><b>${d.p.length}</b><em>${Math.round(d.p.length / total * 100)}%</em></span></li>`).join('');
  const lists = INDUSTRY.map((d, i) => `<p class="in-list" data-i="${i}"${i ? ' hidden' : ''}>${d.p.map((x) => t(x[0], x[1])).join('<i aria-hidden="true"> · </i>')}</p>`).join('');
  return `
      <div class="in-wrap">
        <svg class="in-donut" viewBox="0 0 180 180" role="img" aria-label="${INDUSTRY.map((d) => `${d.k[0]} ${d.p.length}`).join(', ')} of ${total} projects">
          <g transform="rotate(-90 90 90)">${arcs}</g>
          <text x="90" y="86" class="in-big">${pct}%</text>
          <text x="90" y="108" class="in-small">${t('battery', '이차전지', 'tspan')}</text>
        </svg>
        <ol class="in-legend">${legend}</ol>
      </div>
      <div class="in-detail">${lists}</div>`;
}

export function initIndustry() {
  const card = document.querySelector('.c-ind'); if (!card) return;
  const arcs = [...card.querySelectorAll('.in-arc')], rows = [...card.querySelectorAll('.in-legend li')], lists = [...card.querySelectorAll('.in-list')];
  const show = (i) => {
    arcs.forEach((a, j) => a.classList.toggle('on', j === i));
    rows.forEach((r, j) => r.classList.toggle('on', j === i));
    lists.forEach((l, j) => { l.hidden = j !== i; });
  };
  [...arcs, ...rows].forEach((el) => {
    const i = +el.dataset.i;
    el.addEventListener('pointerenter', () => show(i));
    el.addEventListener('focus', () => show(i));
    el.addEventListener('click', () => show(i));
  });
  show(0);
}
