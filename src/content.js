// Career content from resume R0 (2026). Rendered into index.html at build time by the vite plugin in vite.config.js,
// so the page reads without JavaScript. Every text node carries data-en / data-ko for the language toggle.
// Not published on purpose: phone, home address, salary, birth year, dropped-out school, ID documents.

const esc = (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
export const t = (en, ko, tag = 'span', cls = '') =>
  `<${tag}${cls ? ` class="${cls}"` : ''} data-en="${esc(en)}" data-ko="${esc(ko ?? en)}">${esc(en)}</${tag}>`;

export const EXPERIENCE = [
  {
    co: ['AIKOREA', '에이아이코리아'], period: '2021.09 – Present',
    role: ['Project Leader, Infrastructure Division / Team Lead', 'PL(프로젝트리더) · 인프라사업부 / 팀장'],
    where: ['United States', '미국'],
    projects: [
      {
        name: ['Arizona LGAZ CESS', 'Arizona LGAZ CESS'], period: '2025.02 – Present', size: ['KRW 22 bn', '220억 원'],
        role: ['Site PL', '현장 PL'],
        points: [
          ['Coordinated the master schedule and led 3D piping clash review on site.', '마스터 스케줄 조율 및 3D 배관 간섭 검토 주도'],
          ['Chairs the hook-up clash meetings between three contractors. Phase 2 under construction.', 'Hook-up 3사 간섭 미팅 주관. 2기 공사 진행 중'],
        ],
      },
      {
        name: ['Indiana Kokomo SDI (SPEPP) utility hook-up', 'Indiana Kokomo SDI(SPEPP) 유틸리티 Hook-up'], period: '2024.02 – 2025.02', size: ['KRW 130 bn', '1,300억 원'],
        role: ['Site PL', '현장 PL'],
        points: [
          ['Drove completion of the electrode, formation and environmental-system lines 1 to 4.', '전극동, 화성동, 환경설비 1~4라인 완공 주도'],
          ['Coordinated piping clashes between three contractors and chaired the clash meetings.', '3사 간 배관 간섭 조율 및 간섭 미팅 주관'],
        ],
        result: ['2 months ahead of schedule, 10% under budget', '공기 2개월 단축, 예산 대비 10% 절감'],
      },
      {
        name: ['Michigan LGESMI2 CESS', 'Michigan LGESMI2 CESS'], period: '2022.10 – 2024.03', size: ['KRW 24 bn', '240억 원'],
        role: ['Design Team Lead', '설계팀장'],
        points: [
          ['Designed the central electrolyte supply system (PFD, P&ID, BIM) and ran site clash review.', 'CESS 시스템 설계(PFD, P&ID, BIM) 및 현장 간섭 검토'],
          ['Single point of contact for the client and the GC, including interpretation.', '고객사 및 GC 대응 전담, 통역 수행'],
        ],
        result: ['1 month ahead of schedule, 15% under budget', '공기 1개월 단축, 예산 대비 15% 절감'],
      },
      {
        name: ['Ohio Ultium Cells CESS', 'Ohio Ultium Cells CESS'], period: '2021.09 – 2022.09', size: ['KRW 18 bn', '180억 원'],
        role: ['Acting Site Manager', '현장소장 대행'],
        points: [
          ['CESS design (PFD, P&ID, BIM), site clash review, client and GC interface.', 'CESS 시스템 설계(PFD, P&ID, BIM), 현장 간섭 검토, 고객사 및 GC 대응'],
          ['Designed in 5 months, built in 5.5 months, and submitted the completion report.', '설계 5개월, 시공 5.5개월 만에 준공 및 공사완료 보고서 제출'],
        ],
        result: ['1 month ahead of schedule', '공기 1개월 단축'],
      },
    ],
  },
  {
    co: ['EKG', 'EKG'], period: '2020.09 – 2021.08',
    role: ['Piping Design, Expatriate in Hungary and Poland / Deputy General Manager, Team Lead', '배관설계 · 주재원(헝가리, 폴란드) / 차장, 팀장'],
    where: ['Hungary, Poland', '헝가리, 폴란드'],
    projects: [
      {
        name: ['Göd, Hungary: SDIHU #6 BCU line', '헝가리 괴드(Göd) SDIHU #6 BCU 라인'], period: '2020.09 – 2020.12', size: ['KRW 11 bn', '110억 원'],
        role: ['Design and construction management', '설계 및 시공 관리'],
        points: [
          ['Managed the multi-electrode piping line expansion and the approval drawings.', '멀티 극판 배관라인 증설공사 관리 및 승인도면 설계'],
          ['Designed the entire 1F BCU line and managed equipment support installation.', '1층 BCU 라인 전량 설계 및 설비 서포트 시공 관리'],
        ],
        result: ['Design and construction completed within the planned period', '계획 기간 내 설계 및 시공 완료'],
      },
      {
        name: ['Wrocław, Poland: LGESWA P3 CESS', '폴란드 브로츠와프 LGESWA P3 CESS'], period: '2020.12 – 2021.08', size: ['Bid KRW 18.9 bn', '입찰 규모 189억 원'],
        role: ['Process design', '공정설계'],
        points: [
          ['Electrolyte piping process design (P&ID, PFD, PMS) and proposal support.', '전해액 배관라인 공정설계(P&ID, PFD, PMS) 및 제안서 작성 지원'],
          ['Technical concept rated on par with competitors; not awarded on price.', '기술 컨셉은 경쟁사와 동등 평가, 가격 경쟁력 사유로 미수주'],
        ],
      },
      {
        name: ['Dąbrowa Górnicza, Poland: SK Innovation battery separator plant', '폴란드 돔브로바 SK이노베이션 배터리 분리막'], period: '2021.03 – 2021.08', size: ['KRW 17 bn', '170억 원'],
        role: ['Process design PL', '분리막 공정설계 PL'],
        points: [],
      },
    ],
  },
  {
    co: ['IAAN', 'IAAN'], period: '2019.03 – 2020.09',
    role: ['Piping Design, Expatriate in China / Manager', '배관설계 · 주재원(중국) / 과장'],
    where: ['China, Korea', '중국, 한국'],
    projects: [
      {
        name: ["Xi'an, China: Samsung Semiconductor operations", '중국 시안 삼성반도체 운영'], period: '2019.03 – 2019.12', size: null,
        role: ['Operations team, Samsung SDS', '운영팀 과장, Samsung SDS'],
        points: [
          ['Reviewed S5D hook-up drawings and checked site layout against the model data.', 'S5D Hook-up 도면 검수, 현장 레이아웃 및 데이터 정합성 검수'],
          ['Found numerous layout errors in S5D and Revit; English interpretation between site and office.', 'S5D, Revit 기반 레이아웃 배치 오류 다수 검출, 현장과 사무실 간 영어 통역'],
        ],
      },
      {
        name: ['Pyeongtaek P3, Korea: Samsung reverse engineering', '평택 P3 삼성 역설계'], period: '2019.12 – 2020.09', size: null,
        role: ['Reverse engineering team, Samsung SDS', '역설계팀 과장, Samsung SDS'],
        points: [
          ['Imported site scan data into Revit and remodeled the hook-up lines missing from S5D.', '현장 스캔 원본 데이터를 Revit에 Import하여 S5D 미반영 Hook-up 구간 역모델링'],
          ['Updated attribute data in Revit and Navisworks; delivered on time.', 'Revit, Navisworks 속성 정보 수정 및 반영, 납기 내 납품'],
        ],
      },
    ],
  },
  {
    co: ['EBA, a Tetra Tech company', 'EBA Tetra Tech (캐나다)'], period: '2018.02 – 2019.01',
    role: ['Transportation / Intern', 'Transportation / 인턴'],
    where: ['Vancouver, Canada', '캐나다 밴쿠버'],
    projects: [
      {
        name: ['Vancouver airport reconstruction', '밴쿠버 공항 재건축'], period: '2018 – 2019', size: null, role: null,
        points: [['Buried piping drawings and revisions, BOM, liaison with Korean partners, invoicing.', '매설 배관 도면 출도 및 수정, BOM 관리, 한국 협력사 대응, 인보이스 발행']],
      },
      {
        name: ['Alaska Route 93 highway', '알래스카 93번 국도'], period: '2018 – 2019', size: null, role: null,
        points: [['Buried piping drawings, as-built revisions, BOM and invoicing.', '매설 배관 도면 출도, As-built 수정, BOM 관리, 인보이스 발행']],
      },
    ],
  },
  {
    co: ['S&W IND. CO., LTD.', 'S&W IND. CO., LTD.'], period: '2013.03 – 2017.05',
    role: ['Mechanical Design, Engineering Dept. / Assistant Manager', '기계설계 · 기술부 / 대리'],
    where: ['Korea, Saudi Arabia, Chile', '한국, 사우디아라비아, 칠레'],
    projects: [
      {
        name: ['Seoul Metro Line 2 rolling stock (with Hyundai Rotem)', '서울메트로 2호선 전동차 (현대로템)'], period: '2015.12 – 2017.05', size: null,
        role: ['Bogie design TFT', '대차설계 TFT'],
        points: [['Designed bogie parts (center pivot, axle, hub) through casting and machining; 200 cars delivered.', 'Center Pivot, Axle, Hub 등 대차 부품 설계부터 주조, 가공까지 수행, 200량 납품 완료']],
      },
      {
        name: ['Fast Pack, Chile', '칠레 FAST PACK'], period: '2015.02 – 2015.07', size: null,
        role: ['Tier-1 vendor to POSCO E&C', '포스코건설 1차 벤더'],
        points: [['Five months on site: valve installation, field fit-up and as-built drawings.', '5개월 현장 상주, 자사 밸브 설치, 현장 맞춤 시공, As-built 도면 수정']],
      },
      {
        name: ['Yanbu 3, Saudi Arabia (Hanwha E&C)', '사우디아라비아 YANBU 3 (한화E&C)'], period: '2014.08 – 2014.09', size: null,
        role: ['Valve supply and site meetings', '밸브 공급 및 고객사 미팅'],
        points: [['Supplied and installed additional 12" trunnion butterfly valves within 4 weeks, leading to a follow-on contract.', '12인치 Trunnion 버터플라이 밸브 추가 공급 및 설치를 4주 내 완료, 추가 계약 체결']],
      },
      {
        name: ['Valve development', '밸브 개발'], period: '2013 – 2017', size: null, role: null,
        points: [
          ['Pressure-reducing and 5/2-way valves for Hyundai Heavy Industries marine engines; casting suppliers and production jigs.', '현대중공업 선박엔진용 감압밸브 및 5/2-way 밸브 개발, 주조 협력사 및 생산 지그 관리'],
          ['3/2-way valve under the 2017 SME growth program, with an industry-academia agreement with Kumoh National Institute of Technology.', '2017 중소기업 신성장동력 사업 3/2-way 밸브 개발, 금오공대 산학협력 체결'],
        ],
      },
    ],
  },
];

export const DATACENTER = {
  period: '2026.02 – Present',
  points: [
    ['Leads technical sales and proposals for data center cooling: CRAH, in-row, CDU, manifold, QD.', '데이터센터 냉각 솔루션(CRAH, In-row, CDU, Manifold, QD) 기술영업 및 제안 총괄'],
    ['50 MW-class data center tender in the Seoul area: RFP analysis, technical and price proposal, tender queries, technical presentation.', '수도권 50MW급 데이터센터 입찰 대응: RFP 분석, 기술 및 가격 제안, Tender Query, 기술 PT'],
    ['On-site audits of cooling and ESS vendors in Shenzhen; moved sourcing from a single vendor to a multi-vendor model.', '중국 심천 냉각 및 ESS 벤더 현지 실사, 단일 벤더에서 멀티벤더 소싱 체계로 전환 주도'],
    ['Localizing cold-plate DLC: built a domestic partner network for CDU, QD, manifold and server racks.', 'Cold Plate 기반 DLC 국산화: 국내 CDU, QD, Manifold, 서버랙 협력사 발굴'],
    ['Specified a DLC demo kit (100 kW-class CDU, chiller) with a Korean server maker and ran overseas vendor RFQs.', '국산 서버사와 DLC Demo Kit(100kW급 CDU, 칠러) 사양 수립 및 해외 벤더 RFQ'],
    ['Proposed a hybrid free-cooling PoC for AI data centers to major EPCs.', '대기업 EPC 대상 AI 데이터센터 하이브리드 프리쿨링 PoC 협력 제안'],
  ],
};

export const COUNTRIES = [
  { c: ['United States', '미국'], s: ['Ohio, Michigan, Indiana, Arizona', '오하이오, 미시간, 인디애나, 애리조나'], y: '2021 – ' },
  { c: ['Hungary', '헝가리'], s: ['Göd', '괴드'], y: '2020' },
  { c: ['Poland', '폴란드'], s: ['Wrocław, Dąbrowa Górnicza', '브로츠와프, 돔브로바'], y: '2020 – 21' },
  { c: ['China', '중국'], s: ["Xi'an", '시안'], y: '2019' },
  { c: ['Korea', '한국'], s: ['Pyeongtaek, Seoul, Gyeongbuk', '평택, 서울, 경북'], y: '2013 – 20' },
  { c: ['Canada', '캐나다'], s: ['Vancouver', '밴쿠버'], y: '2017 – 19' },
  { c: ['Chile', '칠레'], s: ['Antofagasta', '안토파가스타'], y: '2015' },
  { c: ['Saudi Arabia', '사우디아라비아'], s: ['Yanbu', '얀부'], y: '2014' },
];

export const SKILLS = [
  { g: ['Plant and piping design', '플랜트, 배관 설계'], items: [
    ['Autodesk Plant 3D', 'Shop and ISO drawings, BOM', 'Shop Drawing, ISO 도면, BOM 출도'],
    ['P&ID / PFD / PMS', 'CESS and separator process design', 'CESS, 분리막 공정설계'],
    ['AutoCAD', 'Certified Level 1; mechanical and piping drawings', 'AutoCAD 1급, 기계 및 배관 도면'],
    ['SolidWorks Flow Simulation', 'Pressure, temperature and flow in piping', '배관 내 압력, 온도, 유량 해석'],
  ] },
  { g: ['BIM and coordination', 'BIM, 간섭 조율'], items: [
    ['Revit', 'Advanced: MEP piping and duct design, take-off, ISO output', '고급: 기계설비 배관 및 덕트 설계, 물량 산출, ISO 도면'],
    ['Navisworks', 'Clash meetings, site reverse engineering', '간섭 미팅 조율, 현장 역설계'],
    ['S5D', 'Hook-up, attribute and clash checks', 'Hook-up, 속성 검사, 간섭 검사'],
    ['BIM 360', 'Shared model and drawing control', '모델, 도면 협업 관리'],
  ] },
  { g: ['Mechanical design', '기계 설계'], items: [
    ['CATIA V5', 'Advanced: rolling-stock bogie, industrial valves', '고급: 전동차 대차, 산업용 밸브 설계'],
    ['SolidWorks', 'Industrial valves and piping for overseas plants', '해외 플랜트용 산업용 밸브 및 배관'],
    ['Mastercam', 'CNC and MCT NC code, prototypes', 'CNC, MCT NC Code, 시제품 제작'],
    ['KeyShot, V-Ray, 3ds Max', 'Product rendering, trade-fair catalogs', '제품 렌더링, 전시회 카탈로그'],
  ] },
  { g: ['Project and business', '프로젝트, 비즈니스'], items: [
    ['Business English', 'Daily meetings, TBM, clash meetings, contractor training', 'Daily 미팅, TBM, 간섭미팅, 협력사 교육'],
    ['MS Project, Office 365', 'Schedules, reports, proposals', '공정표, 보고서, 제안서'],
    ['Photoshop, Premiere Pro', 'Brochures, websites, promotional video', '브로셔, 홈페이지, 홍보 영상'],
    ['Forklift, 5-ton truck', 'Hands-on site logistics', '현장 자재 운반 실무'],
  ] },
];

export const EDUCATION = [
  ['Gastown Business College, Vancouver', 'Gastown Business College (캐나다 밴쿠버)', 'International Marketing', 'International Marketing 전공', '2017 – 2018'],
  ['Yeungjin College', '영진전문대학', 'Mechanical Design (GPA 4.1 / 4.5)', '기계설계 (학점 4.1 / 4.5)', '2012 – 2014'],
  ['Kyushu University, Japan', '일본 규슈대학', 'Exchange program, 3 months', '교환학생 3개월 과정 수료', '2014'],
];

export const CERTS = [
  ['Industrial Engineer, Mechanical Design', '기계설계산업기사', 'HRD Korea', '한국산업인력공단', '2016'],
  ['AutoCAD Level 1', 'AutoCAD 1급', 'Korea ATC Association', '한국ATC협회', '2012'],
  ['TOEIC 810', 'TOEIC 810', 'ETS', 'ETS', '2018'],
  ['IELTS 6.0', 'IELTS 6.0', 'British Council / IDP', 'British Council / IDP', '2017'],
  ['Excellence Award', '우수상', 'Korea Machine Tool Manufacturers’ Association', '한국공작기계산업협회', '2014'],
  ['GTQ Photoshop Level 1', 'GTQ 포토샵 1급', 'KPC', '한국생산성본부', '2013'],
  ['Word Processor Level 1, Computer Literacy Level 2', '워드프로세서 1급, 컴퓨터활용능력 2급', 'KCCI', '대한상공회의소', '2013'],
  ['MOS Master', 'MOS Master', 'Microsoft', 'Microsoft', '2009'],
];

export const GALLERY = [
  ['CESS tank farm model, Revit', 'CESS 탱크 팜 모델 (Revit)', 'design'],
  ['Electrolyte supply piping, 3D model', '전해액 공급 배관 3D 모델', 'design'],
  ['Tank-top hook-up piping', '탱크 상부 Hook-up 배관', 'design'],
  ['Utility hook-up at the process tools', '설비측 유틸리티 Hook-up', 'design'],
  ['Supply cabinets and drops', '공급 캐비닛과 드롭 배관', 'design'],
  ['Valve manifold rack', '밸브 매니폴드 랙', 'design'],
  ['P&ID', 'P&ID', 'design'],
  ['Isometric drawings', 'ISO 도면', 'design'],
  ['Bogie for Seoul Metro Line 2, CATIA V5', '서울메트로 2호선 대차 설계 (CATIA V5)', 'design'],
  ['Valve cross-section, CATIA V5', '밸브 단면 (CATIA V5)', 'design'],
  ['Battery plant tank farm under construction, USA', '미국 배터리 공장 탱크 팜 시공', 'site'],
  ['Tank farm nearing completion, USA', '미국 탱크 팜 준공 단계', 'site'],
  ['Electrolyte supply cabinet', '전해액 공급 캐비닛', 'site'],
  ['Plant site, Yanbu, Saudi Arabia', '사우디아라비아 얀부 플랜트 현장', 'site'],
  ['Desalination plant piping, Antofagasta, Chile', '칠레 안토파가스타 담수화 플랜트 배관', 'site'],
  ['Line 2 bogie, as built', '2호선 대차 실물', 'site'],
  ['Wrocław, Poland', '폴란드 브로츠와프', 'travel'],
  ['Budapest, Hungary', '헝가리 부다페스트', 'travel'],
];

/* ---------- dashboard / redesign data ---------- */
// Project sites for the globe. Coordinates are city-level (public locations), not facility surveys.
export const SITES = [
  { n: ['Arizona LGAZ CESS', 'Arizona LGAZ CESS'], p: ['Arizona, USA', '미국 애리조나'], y: '2025 – ', lat: 33.25, lon: -111.63, now: true },
  { n: ['Kokomo SDI utility hook-up', 'Kokomo SDI 유틸리티 Hook-up'], p: ['Kokomo, Indiana', '미국 인디애나 코코모'], y: '2024 – 25', lat: 40.49, lon: -86.13 },
  { n: ['Michigan LGESMI2 CESS', 'Michigan LGESMI2 CESS'], p: ['Holland, Michigan', '미국 미시간 홀랜드'], y: '2022 – 24', lat: 42.76, lon: -86.07 },
  { n: ['Ohio Ultium Cells CESS', 'Ohio Ultium Cells CESS'], p: ['Lordstown, Ohio', '미국 오하이오 로즈타운'], y: '2021 – 22', lat: 41.24, lon: -81.06 },
  { n: ['Vancouver airport, Alaska highway', '밴쿠버 공항, 알래스카 국도'], p: ['Vancouver, Canada', '캐나다 밴쿠버'], y: '2018 – 19', lat: 49.28, lon: -123.12 },
  { n: ['LGESWA P3 CESS', 'LGESWA P3 CESS'], p: ['Wrocław, Poland', '폴란드 브로츠와프'], y: '2020 – 21', lat: 51.07, lon: 17.02 },
  { n: ['SK Innovation separator plant', 'SK이노베이션 분리막'], p: ['Dąbrowa Górnicza, Poland', '폴란드 돔브로바'], y: '2021', lat: 50.33, lon: 19.19 },
  { n: ['SDIHU #6 BCU line', 'SDIHU #6 BCU 라인'], p: ['Göd, Hungary', '헝가리 괴드'], y: '2020', lat: 47.68, lon: 19.13 },
  { n: ['Samsung Semiconductor operations', '삼성반도체 운영'], p: ["Xi'an, China", '중국 시안'], y: '2019', lat: 34.2, lon: 108.85 },
  { n: ['Samsung P3 reverse engineering', '삼성 P3 역설계'], p: ['Pyeongtaek, Korea', '평택'], y: '2019 – 20', lat: 37.02, lon: 127.05 },
  { n: ['Seoul Metro Line 2 bogie', '서울메트로 2호선 대차'], p: ['Seoul, Korea', '서울'], y: '2015 – 17', lat: 37.55, lon: 126.99 },
  { n: ['Valve design and production', '밸브 설계 및 생산'], p: ['Gyeongbuk, Korea', '경북'], y: '2013 – 17', lat: 36.14, lon: 128.11 },
  { n: ['Fast Pack desalination plant', 'Fast Pack 담수화 플랜트'], p: ['Antofagasta, Chile', '칠레 안토파가스타'], y: '2015', lat: -23.65, lon: -70.4 },
  { n: ['Yanbu 3 (Hanwha E&C)', 'Yanbu 3 (한화E&C)'], p: ['Yanbu, Saudi Arabia', '사우디 얀부'], y: '2014', lat: 24.09, lon: 38.06 },
];

// Dashboard career gauge: one segment per employer, 2013.03 to today
export const ERAS = [
  { co: 'S&W IND.', from: 2013.17, to: 2017.38 },
  { co: 'EBA Tetra Tech', from: 2018.08, to: 2019.0 },
  { co: 'IAAN', from: 2019.17, to: 2020.7 },
  { co: 'EKG', from: 2020.7, to: 2021.6 },
  { co: 'AIKOREA', from: 2021.67, to: 2026.8 },
];

export const MATRIX = [
  ['Revit', 'Advanced', '고급'], ['CATIA V5', 'Advanced', '고급'], ['AutoCAD', 'Advanced', '고급'],
  ['Plant 3D', 'Intermediate', '중급'], ['Navisworks', 'Intermediate', '중급'], ['S5D', 'Intermediate', '중급'],
  ['SolidWorks', 'Intermediate', '중급'], ['Business English', 'Intermediate', '중급'],
];
export const DOMAINS = [
  ['CESS electrolyte supply', 'CESS 전해액 공급'], ['Utility hook-up', '유틸리티 Hook-up'], ['P&ID / PFD / PMS', 'P&ID / PFD / PMS'],
  ['3-party clash coordination', '3사 간섭 조율'], ['Site PL, schedule, QA/QC', '현장 PL, 공정, QA/QC'], ['Data center liquid cooling', '데이터센터 액체 냉각'],
];
export const SERVICES = [
  ['Hook-up design', 'Hook-up 설계'], ['CESS systems', 'CESS 시스템'], ['P&ID · PFD · PMS', 'P&ID · PFD · PMS'], ['Clash coordination', '간섭 조율'],
  ['Site PL', '현장 PL'], ['Reverse engineering', '역설계'], ['Valve design', '밸브 설계'], ['Liquid cooling', '액체 냉각'],
];
// companies named in resume R0 as clients or partners of the projects
export const CLIENTS = 'LG Energy Solution · Samsung SDI · Ultium Cells · Samsung Semiconductor · Samsung SDS · SK Innovation · Hanwha E&C · POSCO E&C · Hyundai Rotem · Hyundai Heavy Industries · Tetra Tech';

/* ---------- HTML renderers (used by the vite plugin) ---------- */
const now = (p) => t(p.replace('Present', 'Now'), p.replace('Present', '현재'));
const startYear = (p) => p.slice(0, 4);
const endYear = (p) => (/Present/.test(p) ? null : p.slice(-7, -3));

export const renderMatrix = () => MATRIX.map((m) => `<li><span>${m[0]}</span>${t(m[1], m[2], 'em')}</li>`).join('');
export const renderDomains = () => DOMAINS.map((d) => t(d[0], d[1], 'li')).join('');
export const renderServices = () => SERVICES.map((s, i) => `<li style="--i:${i}">${t(s[0], s[1], 'span')}</li>`).join('');

// skill rows: one huge line per group, tools underneath
export const renderSkillRows = () => SKILLS.map((g, i) => `
      <li class="srow" data-reveal>
        <span class="srow-n">${String(i + 1).padStart(2, '0')}</span>
        ${t(g.g[0], g.g[1], 'h3', 'srow-h')}
        <ul class="srow-tools">${g.items.map((s) => `<li><b>${s[0]}</b>${t(s[1], s[2], 'span')}</li>`).join('')}</ul>
      </li>`).join('');

// timeline: year to year, company, role; projects inside a disclosure
export function renderTimeline() {
  const rows = [];
  EXPERIENCE.forEach((e, ei) => {
    rows.push({ period: e.period, title: e.co, role: e.role, where: e.where, projects: e.projects, open: ei === 0 });
    if (ei === 0) rows.push({ dc: true, period: DATACENTER.period });
  });
  return rows.map((r) => {
    const y0 = startYear(r.period), y1 = endYear(r.period);
    const years = `<span class="tl-y">${y0}<i>→</i>${y1 ? y1 : t('Now', '현재')}</span>`;
    if (r.dc) {
      return `
      <li class="tl tl-dc" data-reveal>
        ${years}
        <details>
          <summary>${t('Data center cooling', '데이터센터 냉각', 'h3')}${t('AIKOREA, New Business Div. / Technical Sales Team Lead', '에이아이코리아 신사업본부 / 기술영업 팀장', 'p')}</summary>
          <ul class="tl-pts">${DATACENTER.points.map((x) => t(x[0], x[1], 'li')).join('')}</ul>
        </details>
      </li>`;
    }
    return `
      <li class="tl" data-reveal>
        ${years}
        <details${r.open ? ' open' : ''}>
          <summary>${t(r.title[0], r.title[1], 'h3')}${t(r.role[0], r.role[1], 'p')}${t(r.where[0], r.where[1], 'p', 'tl-where')}</summary>
          <ul class="tl-pj">${r.projects.map((p) => `
            <li>
              <div class="tl-pj-h">${t(p.name[0], p.name[1], 'h4')}<span class="tl-when">${now(p.period)}</span></div>
              ${p.role || p.size ? `<p class="tl-meta">${[p.role, p.size].filter(Boolean).map((x) => t(x[0], x[1])).join('<span aria-hidden="true"> · </span>')}</p>` : ''}
              ${p.points.length ? `<ul class="tl-pts">${p.points.map((x) => t(x[0], x[1], 'li')).join('')}</ul>` : ''}
              ${p.result ? t(p.result[0], p.result[1], 'p', 'tl-result') : ''}
            </li>`).join('')}
          </ul>
        </details>
      </li>`;
  }).join('');
}

export const renderCarousel = () => GALLERY.map((g, i) => {
  const n = String(i + 1).padStart(2, '0');
  return `
        <li class="cr-item" style="--i:${i}"><figure><button type="button" class="ph-btn" data-full="gallery/g${n}.jpg" aria-label="${g[0]}"><img src="gallery/g${n}_s.jpg" alt="${g[0]}" loading="lazy" decoding="async" draggable="false"></button>${t(g[0], g[1], 'figcaption')}</figure></li>`;
}).join('');

export const renderEducation = () => EDUCATION.map((e) => `<li>${t(e[0], e[1], 'b')}${t(e[2], e[3], 'span')}<span class="yr">${e[4]}</span></li>`).join('');
export const renderCerts = () => CERTS.map((c) => `<li>${t(c[0], c[1], 'b')}${t(c[2], c[3], 'span')}<span class="yr">${c[4]}</span></li>`).join('');
export const renderSites = () => SITES.map((s, i) => `<li data-i="${i}">${t(s.p[0], s.p[1], 'b')}${t(s.n[0], s.n[1], 'span')}<span class="yr">${s.y}</span></li>`).join('');
