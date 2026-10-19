// Recruiter summary: schedule chart (plan vs actual), budget gauges and a fit checklist.
// Figures from resume R0. Planned duration = actual + the reduction stated on the resume.
import { t } from './content.js';

export const SCHEDULE = [
  { n: ['Kokomo SDI hook-up', 'Kokomo SDI Hook-up'], r: ['Site PL · KRW 130 bn', '현장 PL · 1,300억 원'], actual: 12, saved: 2 },
  { n: ['Michigan LGESMI2 CESS', 'Michigan LGESMI2 CESS'], r: ['Design lead · KRW 24 bn', '설계팀장 · 240억 원'], actual: 17, saved: 1 },
  { n: ['Ohio Ultium Cells CESS', 'Ohio Ultium Cells CESS'], r: ['Acting site manager · KRW 18 bn', '현장소장 대행 · 180억 원'], actual: 10.5, saved: 1, note: ['5 mo design + 5.5 mo build', '설계 5개월 + 시공 5.5개월'] },
];
export const BUDGET = [
  { n: ['Michigan LGESMI2', 'Michigan LGESMI2'], used: 85 },
  { n: ['Kokomo SDI', 'Kokomo SDI'], used: 90 },
];
export const FIT = [
  ['Four US battery plants delivered; site PL up to KRW 130 bn', '미국 배터리 공장 4곳 수행, 현장 PL 최대 1,300억 원'],
  ['Design and site in one person: P&ID, 3D BIM, construction', '설계와 시공을 모두: P&ID·3D BIM부터 현장 시공까지'],
  ['Chairs three-contractor clash meetings in English', '시공 3사 간섭 미팅을 영어로 직접 주관'],
  ['Eight countries, including expatriate postings in Hungary, Poland and China', '8개국 근무, 헝가리·폴란드·중국 주재원 경험'],
];

function gauge(b) {
  const R = 52, C = Math.PI * R; // half circle
  const used = C * b.used / 100;
  return `<figure class="sm-g">
      <svg viewBox="0 0 132 78" aria-hidden="true">
        <path d="M14 70 A52 52 0 0 1 118 70" class="sm-g-base"/>
        <path d="M14 70 A52 52 0 0 1 118 70" class="sm-g-val" style="stroke-dasharray:${used.toFixed(1)} ${C.toFixed(1)}"/>
      </svg>
      <b>-${100 - b.used}%</b>
      <figcaption>${t(b.n[0], b.n[1])}<span>${t(`${b.used}% of budget spent`, `예산의 ${b.used}% 집행`)}</span></figcaption>
    </figure>`;
}

export function renderSummary() {
  const max = Math.max(...SCHEDULE.map((s) => s.actual + s.saved));
  const rows = SCHEDULE.map((s) => {
    const plan = s.actual + s.saved;
    return `<li>
        <div class="sm-pj">${t(s.n[0], s.n[1], 'b')}${t(s.r[0], s.r[1], 'span')}${s.note ? t(s.note[0], s.note[1], 'span') : ''}</div>
        <div class="sm-bars">
          <span class="sm-plan" style="--w:${(plan / max * 100).toFixed(1)}%">${t(`Plan ${plan} mo`, `계획 ${plan}개월`)}</span>
          <span class="sm-act" style="--w:${(s.actual / max * 100).toFixed(1)}%">${t(`Actual ${s.actual} mo`, `실제 ${s.actual}개월`)}</span>
        </div>
        <div class="sm-save"><b>-${s.saved}</b>${t('mo', '개월')}</div>
      </li>`;
  }).join('');
  return `
    <div class="sm-head">
      <p class="sm-kicker" data-reveal>${t('For recruiters, in 30 seconds', '채용 담당자를 위한 30초 요약')}</p>
      <h2 id="sm-h" data-reveal>${t('A piping PL who brings overseas sites in early and under budget.', '해외 현장을 공기 안에, 예산 안에 끝내는 배관 PL.')}</h2>
      <p data-reveal>${t('Thirteen years across design and construction. My last three completed US battery projects all finished ahead of plan, and two came in 10–15% under budget.', '설계와 시공을 모두 해온 13년 차 엔지니어입니다. 최근 완료한 미국 배터리 공장 3건은 모두 계획보다 일찍 끝났고, 그중 2건은 예산을 10~15% 절감했습니다.')}</p>
      <ul class="sm-fit" data-reveal>${FIT.map((f) => t(f[0], f[1], 'li')).join('')}</ul>
    </div>
    <div class="sm-charts">
      <article class="sm-card" data-reveal>
        <h3>${t('Schedule: plan vs actual', '공기: 계획 대비 실제')}</h3>
        <ul class="sm-sched">${rows}</ul>
        <p class="sm-foot">${t('Plan = actual duration plus the reduction recorded at completion.', '계획 기간 = 실제 기간 + 준공 시 기록된 단축 기간')}</p>
      </article>
      <article class="sm-card sm-budget" data-reveal>
        <h3>${t('Budget: final cost vs budget', '예산: 최종 집행 대비 예산')}</h3>
        <div class="sm-gs">${BUDGET.map(gauge).join('')}</div>
      </article>
    </div>`;
}
