// Scene constants carried over from the v4 prototype (CLAUDE.md 4, 5).
export const OZ = -170; // Project B world offset along z

export const COLORS = {
  bgA: 0x1f2631, bgB: 0xe7eaee,
  lines: ['#4ADE80', '#E879F9', '#22D3EE', '#3B82F6', '#FACC15', '#F97316'],
  otherLine: '#C9CFD6', valve: '#8B95A3', support: '#DC2626', equip: '#DADFE5', struct: '#E5E7EB', insul: '#F1F5F9',
  b: { red: '#E11D2E', blue: '#1D4ED8', mag: '#D946EF', yel: '#F59E0B', grey: '#B9BEC4', steel: '#59616C' },
};

// Chapter camera keyframes, position -> target (three.js metres).
// mo: mobile-only shift applied to both position and target (keeps the model clear of the sheet panel)
export const KEYS = [
  { p: [-38, 26, 50], t: [-70, 3, 17], mo: [-5, 21, 3] }, // 0 Hero (closer than v4, model right of the title)
  { p: [-44, 15, 38], t: [-67, 5, 12] },          // 1 A / Supply
  { p: [-52, 10.5, 27], t: [-20, 5, 7] },         // 2 A / Header
  { p: [-8, 9.5, 5], t: [32, 2.5, -13] },         // 3 A / POU
  { p: [38, 8, -1], t: [56, 3, -13] },            // 4 A / Clash
  { p: [-44, 15, -16], t: [-66, 4, 12] },         // 5 A / Build
  { p: [-62, 40, OZ + 52], t: [-6, 4, OZ] },      // 6 B / Fab hook-up
  { p: [-50, 5.2, OZ - 4.5], t: [10, 6.5, OZ - 3] }, // 7 B / Under the rack
  { p: [72, 92, -66], t: [0, 0, 0] },             // 8 A in numbers
];
export const MOBILE_DIST = 1.3;

// Pipe reveal: scroll stage -> fraction of the x-ordered model shown
export const REVEAL_S = [0, 1, 2, 3, 4, 10];
export const REVEAL_V = [0.06, 0.2, 0.4, 0.74, 1, 1];

// 3D call-out tags; win = scroll window in which the tag fades in and out
export const TAGS = [
  { p: [-66, 12.5, 12], en: 'Supply / Tank farm', ko: '공급 / 탱크 팜', c: '#4ADE80', win: [0.6, 2.6] },
  { p: [-36, 8.2, 10.5], en: 'Header / approx. 150 m', ko: '헤더 / 약 150 m', c: '#FACC15', win: [1.5, 3.4] },
  { p: [-0.6, 6.2, -13], en: 'POU 01', ko: '말단 01', c: '#22D3EE', win: [2.5, 4.6] },
  { p: [17.3, 6.2, -13], en: 'POU 02', ko: '말단 02', c: '#22D3EE', win: [2.6, 4.6] },
  { p: [41.4, 6.2, -13], en: 'POU 03', ko: '말단 03', c: '#22D3EE', win: [2.8, 4.6] },
  { p: [65.3, 6.2, -13], en: 'POU 04', ko: '말단 04', c: '#22D3EE', win: [3.0, 4.6] },
  { p: [-30, 10.5, OZ - 9], en: 'Main rack', ko: '메인 랙', c: '#7FB2FF', win: [5.8, 7.0], b: true },
  { p: [-25, 4.4, OZ - 8], en: 'Tool row / platforms', ko: '설비 열 / 플랫폼', c: '#7FB2FF', win: [6.0, 7.4], b: true },
];
