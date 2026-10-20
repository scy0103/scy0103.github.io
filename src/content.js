// Career content from resume R0 (2026). Rendered into index.html at build time by the vite plugin in vite.config.js,
// so the page reads without JavaScript. Every text node carries data-en / data-ko for the language toggle.
// Not published on purpose: phone, home address, salary, birth year, dropped-out school, ID documents.

const esc = (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
export const t = (en, ko, tag = 'span', cls = '') =>
  `<${tag}${cls ? ` class="${cls}"` : ''} data-en="${esc(en)}" data-ko="${esc(ko ?? en)}">${esc(ko ?? en)}</${tag}>`; // Korean is the default

export const EXPERIENCE = [
  {
    co: ['AIKOREA', '에이아이코리아'], period: '2021.09 – Present',
    role: ['Project Leader, Infrastructure Division / Team Lead', 'PL(프로젝트리더) · 인프라사업부 / 팀장'],
    where: ['United States', '미국'],
    projects: [
      {
        cc: 'us', st: 'az', name: ['Arizona LGAZ CESS', 'Arizona LGAZ CESS'], photos: [37], period: '2025.02 – Present', size: ['KRW 22 bn', '220억 원'],
        role: ['Site PL', '현장 PL'],
        points: [
          ['Coordinated the master schedule and led 3D piping clash review on site.', '마스터 스케줄 조율 및 3D 배관 간섭 검토 주도'],
          ['Chairs the hook-up clash meetings between three contractors. Phase 2 under construction.', 'Hook-up 3사 간섭 미팅 주관. 2기 공사 진행 중'],
        ],
      },
      {
        cc: 'us', st: 'in', name: ['Indiana Kokomo SDI (SPEPP) utility hook-up', 'Indiana Kokomo SDI(SPEPP) 유틸리티 Hook-up'], photos: [38], period: '2024.02 – 2025.02', size: ['KRW 130 bn', '1,300억 원'],
        role: ['Site PL', '현장 PL'],
        points: [
          ['Drove completion of the electrode, formation and environmental-system lines 1 to 4.', '전극동, 화성동, 환경설비 1~4라인 완공 주도'],
          ['Coordinated piping clashes between three contractors and chaired the clash meetings.', '3사 간 배관 간섭 조율 및 간섭 미팅 주관'],
        ],
        result: ['2 months ahead of schedule, 10% under budget', '공기 2개월 단축, 예산 대비 10% 절감'],
      },
      {
        cc: 'us', st: 'mi', name: ['Michigan LGESMI2 CESS', 'Michigan LGESMI2 CESS'], photos: [39], period: '2022.10 – 2024.03', size: ['KRW 24 bn', '240억 원'],
        role: ['Design Team Lead', '설계팀장'],
        points: [
          ['Designed the central electrolyte supply system (PFD, P&ID, BIM) and ran site clash review.', 'CESS 시스템 설계(PFD, P&ID, BIM) 및 현장 간섭 검토'],
          ['Single point of contact for the client and the GC, including interpretation.', '고객사 및 GC 대응 전담, 통역 수행'],
        ],
        result: ['1 month ahead of schedule, 15% under budget', '공기 1개월 단축, 예산 대비 15% 절감'],
      },
      {
        cc: 'us', st: 'oh', name: ['Ohio Ultium Cells CESS', 'Ohio Ultium Cells CESS'], photos: [40], period: '2021.09 – 2022.09', size: ['KRW 18 bn', '180억 원'],
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
        cc: 'hu', name: ['Göd, Hungary: SDIHU #6 BCU line', '헝가리 괴드(Göd) SDIHU #6 BCU 라인'], photos: [23, 22, 18], period: '2020.09 – 2020.12', size: ['KRW 11 bn', '110억 원'],
        role: ['Design and construction management', '설계 및 시공 관리'],
        points: [
          ['Managed the multi-electrode piping line expansion and the approval drawings.', '멀티 극판 배관라인 증설공사 관리 및 승인도면 설계'],
          ['Designed the entire 1F BCU line and managed equipment support installation.', '1층 BCU 라인 전량 설계 및 설비 서포트 시공 관리'],
        ],
        result: ['Design and construction completed within the planned period', '계획 기간 내 설계 및 시공 완료'],
      },
      {
        cc: 'pl', name: ['Wrocław, Poland: LGESWA P3 CESS', '폴란드 브로츠와프 LGESWA P3 CESS'], photos: [19, 20, 21, 17], period: '2020.12 – 2021.08', size: ['Bid KRW 18.9 bn', '입찰 규모 189억 원'],
        role: ['Process design', '공정설계'],
        points: [
          ['Electrolyte piping process design (P&ID, PFD, PMS) and proposal support.', '전해액 배관라인 공정설계(P&ID, PFD, PMS) 및 제안서 작성 지원'],
          ['Technical concept rated on par with competitors; not awarded on price.', '기술 컨셉은 경쟁사와 동등 평가, 가격 경쟁력 사유로 미수주'],
        ],
      },
      {
        cc: 'pl', name: ['Dąbrowa Górnicza, Poland: SK Innovation battery separator plant', '폴란드 돔브로바 SK이노베이션 배터리 분리막'], period: '2021.03 – 2021.08', size: ['KRW 17 bn', '170억 원'],
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
        cc: 'cn', name: ["Xi'an, China: Samsung Semiconductor operations", '중국 시안 삼성반도체 운영'], photos: [27], period: '2019.03 – 2019.12', size: null,
        role: ['Operations team, Samsung SDS', '운영팀 과장, Samsung SDS'],
        points: [
          ['Reviewed S5D hook-up drawings and checked site layout against the model data.', 'S5D Hook-up 도면 검수, 현장 레이아웃 및 데이터 정합성 검수'],
          ['Found numerous layout errors in S5D and Revit; English interpretation between site and office.', 'S5D, Revit 기반 레이아웃 배치 오류 다수 검출, 현장과 사무실 간 영어 통역'],
        ],
      },
      {
        cc: 'kr', name: ['Pyeongtaek P3, Korea: Samsung reverse engineering', '평택 P3 삼성 역설계'], period: '2019.12 – 2020.09', size: null,
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
        cc: 'ca', name: ['Vancouver airport reconstruction', '밴쿠버 공항 재건축'], photos: [24, 25, 26], period: '2018 – 2019', size: null, role: null,
        points: [['Buried piping drawings and revisions, BOM, liaison with Korean partners, invoicing.', '매설 배관 도면 출도 및 수정, BOM 관리, 한국 협력사 대응, 인보이스 발행']],
      },
      {
        cc: 'ca', name: ['Alaska Route 93 highway', '알래스카 93번 국도'], period: '2018 – 2019', size: null, role: null,
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
        cc: 'kr', name: ['Seoul Metro Line 2 rolling stock (with Hyundai Rotem)', '서울메트로 2호선 전동차 (현대로템)'], photos: [9, 16, 28, 29], period: '2015.12 – 2017.05', size: null,
        role: ['Bogie design TFT', '대차설계 TFT'],
        points: [['Designed bogie parts (center pivot, axle, hub) through casting and machining; 200 cars delivered.', 'Center Pivot, Axle, Hub 등 대차 부품 설계부터 주조, 가공까지 수행, 200량 납품 완료']],
      },
      {
        cc: 'cl', name: ['Fast Pack, Chile', '칠레 FAST PACK'], photos: [15, 30, 31], period: '2015.02 – 2015.07', size: null,
        role: ['Tier-1 vendor to POSCO E&C', '포스코건설 1차 벤더'],
        points: [['Five months on site: valve installation, field fit-up and as-built drawings.', '5개월 현장 상주, 자사 밸브 설치, 현장 맞춤 시공, As-built 도면 수정']],
      },
      {
        cc: 'sa', name: ['Yanbu 3, Saudi Arabia (Hanwha E&C)', '사우디아라비아 YANBU 3 (한화E&C)'], photos: [14, 32, 33, 34], period: '2014.08 – 2014.09', size: null,
        role: ['Valve supply and site meetings', '밸브 공급 및 고객사 미팅'],
        points: [['Supplied and installed additional 12" trunnion butterfly valves within 4 weeks, leading to a follow-on contract.', '12인치 Trunnion 버터플라이 밸브 추가 공급 및 설치를 4주 내 완료, 추가 계약 체결']],
      },
      {
        cc: 'kr', name: ['Valve development', '밸브 개발'], photos: [10, 35, 36], period: '2013 – 2017', size: null, role: null,
        points: [
          ['Pressure-reducing and 5/2-way valves for Hyundai Heavy Industries marine engines; casting suppliers and production jigs.', '현대중공업 선박엔진용 감압밸브 및 5/2-way 밸브 개발, 주조 협력사 및 생산 지그 관리'],
          ['3/2-way valve under the 2017 SME growth program, with an industry-academia agreement with Kumoh National Institute of Technology.', '2017 중소기업 신성장동력 사업 3/2-way 밸브 개발, 금오공대 산학협력 체결'],
        ],
      },
    ],
  },
];

export const DATACENTER = {
  cc: 'kr',
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
  // project photos (shown on the project cards and globe tooltips, not in the carousel)
  ['Construction site, Wrocław', '브로츠와프 공사 현장', 'site', false],
  ['Late-night CAD on the Wrocław CESS design', '브로츠와프 CESS 야간 설계 작업', 'design', false],
  ['Wrocław old town in winter', '겨울 브로츠와프 구시가지', 'travel', false],
  ['Site office, Göd', '괴드 현장 사무실', 'site', false],
  ['Walk-down in the new fab, Göd', '괴드 신규 팹 현장 점검', 'site', false],
  ['Workstation at EBA Tetra Tech, Vancouver', 'EBA Tetra Tech 밴쿠버 사무실 워크스테이션', 'design', false],
  ['At my desk in Vancouver', '밴쿠버 사무실에서', 'design', false],
  ['Vancouver harbour', '밴쿠버 항구', 'travel', false],
  ["Bell Tower, Xi'an", '시안 종루', 'travel', false],
  ['Bogie fit-up on a Line 2 car', '2호선 전동차 대차 조립', 'site', false],
  ['Bogie frame in the shop', '공장 내 대차 프레임', 'site', false],
  ['Desalination plant intake, Antofagasta', '안토파가스타 담수화 플랜트 취수부', 'site', false],
  ['Antofagasta waterfront', '안토파가스타 해안', 'travel', false],
  ['Plant structure, Yanbu', '얀부 플랜트 구조물', 'site', false],
  ['Yanbu piping model', '얀부 배관 3D 모델', 'design', false],
  ['On site in Yanbu', '얀부 현장에서', 'site', false],
  ['Ball valve, CATIA V5', '볼 밸브 (CATIA V5)', 'design', false],
  ['Globe valve cutaway, CATIA V5', '글로브 밸브 단면 (CATIA V5)', 'design', false],
  ['Arizona LGAZ CESS tank farm from the air', '애리조나 LGAZ CESS 탱크 팜 항공 사진', 'site', false],
  ['Kokomo utility hook-up, Navisworks coordination model', '코코모 유틸리티 Hook-up, Navisworks 간섭 조율 모델', 'design', false],
  ['Michigan LGESMI2 CESS tank farm under construction', '미시간 LGESMI2 CESS 탱크 팜 시공 중', 'site', false],
  ['Ohio Ultium Cells CESS, 3D walking view', '오하이오 Ultium Cells CESS 3D 워킹 뷰', 'design', false],
  // g41-g51: work photos added for the gallery
  ['Plant model in AVEVA E3D', 'AVEVA E3D 플랜트 모델', 'design', false],
  ['Vessels and piping in AVEVA E3D', 'AVEVA E3D 용기·배관 모델', 'design', false],
  ['Briefing the crew in the site office, Ohio Ultium Cells U1', '오하이오 Ultium Cells U1, 현장 사무실 작업자 브리핑', 'site', false],
  ['Coordination meeting with contractors, Michigan LGESMI2', '미시간 LGESMI2, 협력사 조율 미팅', 'site', false],
  ['Walking the line with the piping crew, Ohio Ultium Cells U1', '오하이오 Ultium Cells U1, 배관 작업자와 현장 점검', 'site', false],
  ['Getting around the site, Michigan LGESMI2', '미시간 LGESMI2, 현장 이동', 'site', false],
  ['CESS tank farm, Revit model', 'CESS 탱크 팜 Revit 모델', 'design', false],
  ['Ohio Ultium Cells CESS, tank-top walking view', '오하이오 Ultium Cells CESS 탱크 상부 워킹 뷰', 'design', false],
  ['Ohio Ultium Cells CESS, unloading area walking view', '오하이오 Ultium Cells CESS 언로딩 구역 워킹 뷰', 'design', false],
  ['CESS piping over the tank farm, wireframe view', 'CESS 배관 와이어프레임 뷰', 'design', false],
  ['Driving to site, USA', '미국 현장 출근길', 'site', false],
];

/* ---------- dashboard / redesign data ---------- */
// Project sites for the globe. Coordinates are city-level (public locations), not facility surveys.
export const SITES = [
  { n: ['Arizona LGAZ CESS', 'Arizona LGAZ CESS'], p: ['Arizona, USA', '미국 애리조나'], y: '2025 – ', lat: 33.25, lon: -111.63, now: true, img: 37 },
  { n: ['Kokomo SDI utility hook-up', 'Kokomo SDI 유틸리티 Hook-up'], p: ['Kokomo, Indiana', '미국 인디애나 코코모'], y: '2024 – 25', lat: 40.49, lon: -86.13, img: 38 },
  { n: ['Michigan LGESMI2 CESS', 'Michigan LGESMI2 CESS'], p: ['Holland, Michigan', '미국 미시간 홀랜드'], y: '2022 – 24', lat: 42.76, lon: -86.07, img: 39 },
  { n: ['Ohio Ultium Cells CESS', 'Ohio Ultium Cells CESS'], p: ['Lordstown, Ohio', '미국 오하이오 로즈타운'], y: '2021 – 22', lat: 41.24, lon: -81.06, img: 40 },
  { n: ['Vancouver airport, Alaska highway', '밴쿠버 공항, 알래스카 국도'], p: ['Vancouver, Canada', '캐나다 밴쿠버'], y: '2018 – 19', lat: 49.28, lon: -123.12, img: 26 },
  { n: ['LGESWA P3 CESS', 'LGESWA P3 CESS'], p: ['Wrocław, Poland', '폴란드 브로츠와프'], y: '2020 – 21', lat: 51.07, lon: 17.02, img: 19 },
  { n: ['SK Innovation separator plant', 'SK이노베이션 분리막'], p: ['Dąbrowa Górnicza, Poland', '폴란드 돔브로바'], y: '2021', lat: 50.33, lon: 19.19 },
  { n: ['SDIHU #6 BCU line', 'SDIHU #6 BCU 라인'], p: ['Göd, Hungary', '헝가리 괴드'], y: '2020', lat: 47.68, lon: 19.13, img: 23 },
  { n: ['Samsung Semiconductor operations', '삼성반도체 운영'], p: ["Xi'an, China", '중국 시안'], y: '2019', lat: 34.2, lon: 108.85, img: 27 },
  { n: ['Samsung P3 reverse engineering', '삼성 P3 역설계'], p: ['Pyeongtaek, Korea', '평택'], y: '2019 – 20', lat: 37.02, lon: 127.05 },
  { n: ['Seoul Metro Line 2 bogie', '서울메트로 2호선 대차'], p: ['Seoul, Korea', '서울'], y: '2015 – 17', lat: 37.55, lon: 126.99, img: 28 },
  { n: ['Valve design and production', '밸브 설계 및 생산'], p: ['Gyeongbuk, Korea', '경북'], y: '2013 – 17', lat: 36.14, lon: 128.11, img: 35 },
  { n: ['Fast Pack desalination plant', 'Fast Pack 담수화 플랜트'], p: ['Antofagasta, Chile', '칠레 안토파가스타'], y: '2015', lat: -23.65, lon: -70.4, img: 30 },
  { n: ['Yanbu 3 (Hanwha E&C)', 'Yanbu 3 (한화E&C)'], p: ['Yanbu, Saudi Arabia', '사우디 얀부'], y: '2014', lat: 24.09, lon: 38.06, img: 32 },
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
    rows.push({ period: e.period, title: e.co, role: e.role, where: e.where, projects: e.projects, photos: e.photos || e.projects.flatMap((p) => p.photos || []).slice(0, 4), preview: !e.photos, open: ei === 0 });
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
              ${p.photos ? `<ul class="tl-ph tl-ph-pj">${p.photos.map(photo).join('')}</ul>` : ''}
            </li>`).join('')}
          </ul>
        </details>
        ${r.photos.length ? `<ul class="tl-ph${r.preview ? " tl-ph-sum" : ""}">${r.photos.map(photo).join('')}</ul>` : ''}
      </li>`;
  }).join('');
}
// one gallery picture as a lightbox thumbnail
function photo(n) {
  const g = GALLERY[n - 1], id = String(n).padStart(2, '0');
  return `<li><figure><button type="button" class="ph-btn" data-full="gallery/g${id}.jpg" aria-label="${g[0]}"><img src="gallery/g${id}_s.jpg" alt="${g[0]}" loading="lazy" decoding="async"></button>${t(g[0], g[1], 'figcaption')}</figure></li>`;
}

export const CAROUSEL = [43, 45, 44, 46, 51, 1, 47, 48, 49, 50, 2, 3, 41, 42, 4, 5, 6, 7, 8, 11, 12, 13, 14, 15, 9, 16, 10];
export const renderCarousel = () => CAROUSEL.map((k, i) => {
  const g = GALLERY[k - 1], n = String(k).padStart(2, '0');
  return `
        <li class="cr-item" style="--i:${i}"><figure><button type="button" class="ph-btn" data-full="gallery/g${n}.jpg" aria-label="${g[0]}"><img src="gallery/g${n}_s.jpg" alt="${g[0]}" loading="lazy" decoding="async" draggable="false"></button>${t(g[0], g[1], 'figcaption')}</figure></li>`;
}).join('');

export const renderEducation = () => EDUCATION.map((e) => `<li>${t(e[0], e[1], 'b')}${t(e[2], e[3], 'span')}<span class="yr">${e[4]}</span></li>`).join('');
export const renderCerts = () => CERTS.map((c) => `<li>${t(c[0], c[1], 'b')}${t(c[2], c[3], 'span')}<span class="yr">${c[4]}</span></li>`).join('');
export const renderSites = () => SITES.map((s, i) => `<li data-i="${i}">${t(s.p[0], s.p[1], 'b')}${t(s.n[0], s.n[1], 'span')}<span class="yr">${s.y}</span></li>`).join('');

/* ---------- capability hexagon (dashboard) ---------- */
// Self-assessed scores (0-100): engineering is the anchor at 92, the other axes were scaled by 0.9. Edit here.
export const RADAR = [
  { k: ['Project management', '프로젝트 관리'], v: 88, ev: ['Site PL on four US projects up to KRW 130 bn; owns the master schedule and the three-contractor interface.', '최대 1,300억 원 규모 미국 프로젝트 4건 현장 PL, 마스터 스케줄과 3사 인터페이스 총괄'] },
  { k: ['Engineering', '엔지니어링'], v: 92, ev: ['CESS process design (PFD, P&ID, PMS), 3D piping in Revit and Plant 3D, valve and bogie design in CATIA.', 'CESS 공정설계(PFD·P&ID·PMS), Revit·Plant 3D 배관 설계, CATIA 밸브·대차 설계'] },
  { k: ['Cost control', '손익 관리'], v: 79, ev: ['10% under budget at Kokomo and 15% under at Michigan; earlier, product weight and cost estimates for valves.', '코코모 예산 대비 10%, 미시간 15% 절감, 밸브 제품 중량·원가 산출'] },
  { k: ['Global communication', '글로벌 커뮤니케이션'], v: 77, ev: ['Daily meetings, TBM and GC interpretation on US sites; work in Canada, Poland, Hungary, China, Chile and Saudi Arabia.', '미국 현장 Daily 미팅·TBM·GC 통역, 캐나다·폴란드·헝가리·중국·칠레·사우디 근무'] },
  { k: ['Problem solving', '문제 해결'], v: 84, ev: ['Clashes settled in the model before spools are cut; Ohio designed in 5 months and built in 5.5 as acting site manager.', '스풀 제작 전 모델에서 간섭 해결, 오하이오 현장소장 대행으로 설계 5개월·시공 5.5개월 준공'] },
  { k: ['Construction management', '시공 관리'], v: 82, ev: ['Kokomo electrode, formation and environmental lines 1–4 completed; supports, insulation, QA/QC and pressure tests.', '코코모 전극·화성·환경설비 1~4라인 완공, 서포트·보온·QA/QC·압력 테스트 관리'] },
];

export function renderRadar() {
  const cx = 180, cy = 150, R = 100, n = RADAR.length;
  const pt = (i, r) => { const a = -Math.PI / 2 + (i / n) * Math.PI * 2; return [cx + Math.cos(a) * r, cy + Math.sin(a) * r]; };
  const ring = (f) => RADAR.map((_, i) => pt(i, R * f).map((v) => v.toFixed(1)).join(',')).join(' ');
  const rings = [0.25, 0.5, 0.75, 1].map((f) => `<polygon class="rd-ring" points="${ring(f)}"/>`).join('');
  const spokes = RADAR.map((_, i) => { const [x, y] = pt(i, R); return `<line class="rd-spoke" x1="${cx}" y1="${cy}" x2="${x.toFixed(1)}" y2="${y.toFixed(1)}"/>`; }).join('');
  const poly = RADAR.map((d, i) => pt(i, R * d.v / 100).map((v) => v.toFixed(1)).join(',')).join(' ');
  const dots = RADAR.map((d, i) => { const [x, y] = pt(i, R * d.v / 100); return `<circle class="rd-dot" cx="${x.toFixed(1)}" cy="${y.toFixed(1)}" r="4"/>`; }).join('');
  const axes = RADAR.map((d, i) => {
    const [x, y] = pt(i, R + 18), anchor = x > cx + 5 ? 'start' : x < cx - 5 ? 'end' : 'middle';
    const dy = y < cy - R ? -4 : y > cy + R ? 14 : 4;
    return `<g class="rd-ax" tabindex="0" data-i="${i}" data-ev-en="${d.ev[0].replace(/"/g, '&quot;')}" data-ev-ko="${d.ev[1].replace(/"/g, '&quot;')}">`
      + `<text x="${x.toFixed(1)}" y="${(y + dy).toFixed(1)}" text-anchor="${anchor}">${t(d.k[0], d.k[1], 'tspan', 'rd-k')}<tspan class="rd-v" dx="6">${d.v}</tspan></text></g>`;
  }).join('');
  return `<svg class="radar" viewBox="-50 -4 460 308" role="img" aria-labelledby="rd-title rd-desc">
          <title id="rd-title">Capability hexagon</title>
          <desc id="rd-desc">${RADAR.map((d) => `${d.k[0]} ${d.v}`).join(', ')}</desc>
          ${rings}${spokes}<polygon class="rd-poly" points="${poly}"/>${dots}${axes}
        </svg>`;
}

/* ---------- career metrics (skills section dashboard) ---------- */
// All figures from resume R0. Values in KRW 100 million (억 원).
export const KPIS = [
  { v: '13', u: ['yrs 3 mo', '년 3개월'], k: ['Plant career', '플랜트 경력'] },
  { v: '8', u: ['countries', '개국'], k: ['Countries worked in', '수행 국가'] },
  { v: '13', u: ['projects', '건'], k: ['Projects delivered', '수행 프로젝트'] },
  { v: '2,220', u: ['억 KRW', '억 원'], k: ['Contract value of my projects', '참여 프로젝트 규모 합계'] },
];
export const SCALE = [
  { n: ['Kokomo SDI hook-up', 'Kokomo SDI Hook-up'], v: 1300, r: ['Site PL', '현장 PL'] },
  { n: ['Michigan LGESMI2 CESS', 'Michigan LGESMI2 CESS'], v: 240, r: ['Design lead', '설계팀장'] },
  { n: ['Arizona LGAZ CESS', 'Arizona LGAZ CESS'], v: 220, r: ['Site PL', '현장 PL'] },
  { n: ['Wrocław P3 CESS (bid)', '브로츠와프 P3 CESS (입찰)'], v: 189, r: ['Process design', '공정설계'], bid: true },
  { n: ['Ohio Ultium Cells CESS', 'Ohio Ultium Cells CESS'], v: 180, r: ['Acting site manager', '현장소장 대행'] },
  { n: ['SK Innovation separator', 'SK이노베이션 분리막'], v: 170, r: ['Process design PL', '공정설계 PL'] },
  { n: ['Göd SDIHU #6', '괴드 SDIHU #6'], v: 110, r: ['Design and build', '설계·시공'] },
];
export const RESULTS = [
  { n: ['Kokomo SDI', 'Kokomo SDI'], m: 2, b: 10 },
  { n: ['Michigan LGESMI2', 'Michigan LGESMI2'], m: 1, b: 15 },
  { n: ['Ohio Ultium Cells', 'Ohio Ultium Cells'], m: 1, b: null },
];
export const ABROAD = [
  { n: ['United States', '미국'], v: 48, l: ['4 yrs', '4년'] },
  { n: ['Canada', '캐나다'], v: 12, l: ['1 yr', '1년'] },
  { n: ['Hungary, Poland', '헝가리·폴란드'], v: 12, l: ['1 yr', '1년'] },
  { n: ['China', '중국'], v: 9, l: ['9 mo', '9개월'] },
  { n: ['Chile', '칠레'], v: 5, l: ['5 mo', '5개월'] },
  { n: ['Saudi Arabia', '사우디'], v: 1, l: ['1 mo', '1개월'] },
];

const bar = (pct, cls = '') => `<span class="mt-bar${cls}"><i style="--w:${pct.toFixed(1)}%"></i></span>`;
export function renderMetrics() {
  const kpis = KPIS.map((k) => `<div class="mt-kpi" data-reveal><b>${k.v}<small>${t(k.u[0], k.u[1])}</small></b>${t(k.k[0], k.k[1], 'span')}</div>`).join('');
  const maxS = Math.max(...SCALE.map((s) => s.v));
  const scale = SCALE.map((s) => `<li${s.bid ? ' class="bid"' : ''}><span class="mt-n">${t(s.n[0], s.n[1])}<em>${t(s.r[0], s.r[1])}</em></span>${bar(s.v / maxS * 100)}<span class="mt-v">${s.v.toLocaleString('en-US')}</span></li>`).join('');
  const res = RESULTS.map((r) => `<li><span class="mt-n">${t(r.n[0], r.n[1])}</span>
      <span class="mt-pair"><span class="mt-chip"><b>-${r.m}</b>${t('mo schedule', '개월 공기')}</span>${r.b ? `<span class="mt-chip alt"><b>-${r.b}%</b>${t('budget', '예산')}</span>` : ''}</span></li>`).join('');
  const maxA = Math.max(...ABROAD.map((a) => a.v));
  const abroad = ABROAD.map((a) => `<li><span class="mt-n">${t(a.n[0], a.n[1])}</span>${bar(a.v / maxA * 100, ' alt')}<span class="mt-v">${t(a.l[0], a.l[1])}</span></li>`).join('');
  return `
    <div class="mt-kpis">${kpis}</div>
    <div class="mt-grid">
      <article class="mt-card mt-wide" data-reveal>
        <h3>${t('Project scale I worked on', '참여 프로젝트 규모')}</h3>
        <p class="mt-sub">${t('Contract value, KRW 100 million', '계약 규모, 단위 억 원')}</p>
        <ul class="mt-bars">${scale}</ul>
        <p class="mt-foot">${t('The Wrocław bid was not awarded and is left out of the total above.', '브로츠와프는 미수주 입찰로, 위 합계에서 제외했습니다.')}</p>
      </article>
      <article class="mt-card" data-reveal>
        <h3>${t('Delivered ahead and under budget', '공기 단축과 원가 절감')}</h3>
        <p class="mt-sub">${t('Against plan, US CESS and hook-up projects', '계획 대비, 미국 CESS·Hook-up 프로젝트')}</p>
        <ul class="mt-res">${res}</ul>
      </article>
      <article class="mt-card" data-reveal>
        <h3>${t('Time on overseas sites', '해외 현장 근무 기간')}</h3>
        <p class="mt-sub">${t('About 7 years 3 months in total', '합계 약 7년 3개월')}</p>
        <ul class="mt-bars">${abroad}</ul>
      </article>
    </div>`;
}

/* ---------- clients (logo wall) ---------- */
export const CLIENT_LIST = [
  ['lg-energy-solution', 'LG Energy Solution'], ['samsung-sdi', 'Samsung SDI'], ['ultium-cells', 'Ultium Cells'],
  ['samsung-semiconductor', 'Samsung Semiconductor'], ['samsung-sds', 'Samsung SDS'], ['sk-innovation', 'SK Innovation'],
  ['hanwha-ec', 'Hanwha E&C'], ['posco-ec', 'POSCO E&C'], ['hyundai-rotem', 'Hyundai Rotem'],
  ['hyundai-heavy-industries', 'Hyundai Heavy Industries'], ['tetra-tech', 'Tetra Tech'],
];
// logos: set of slugs that have a file in public/logos (passed in at build time)
export const renderClients = (logos = new Set()) => CLIENT_LIST.map(([slug, name]) => {
  const ext = logos.has(slug + '.svg') ? 'svg' : logos.has(slug + '.png') ? 'png' : null;
  return `<li class="lg${ext ? '' : ' txt'}">${ext ? `<img src="logos/${slug}.${ext}" alt="${name}" loading="lazy">` : `<span>${name}</span>`}</li>`;
}).join('');

/* ---------- About me ---------- */
// p02-p07 in public/about, oldest first: the film strip (about3d.js) runs left to right in this order.
// Captions: place, country, and what I was there for.
export const ABOUT_PHOTOS = [
  { f: 'p05', c: ['Horseshoe Bay, Vancouver', '캐나다 밴쿠버, 호스슈 베이'], s: ['Studying and working in Vancouver', '밴쿠버 유학·근무 시절'], y: '2017 – 18', cc: 'ca' },
  { f: 'p04', c: ['Joffre Lakes, British Columbia', '캐나다 BC주, 조프리 레이크'], s: ['Weekend hike during my year at EBA Tetra Tech, Vancouver', 'EBA Tetra Tech 밴쿠버 근무 시절 주말 산행'], y: '2018', cc: 'ca' },
  { f: 'p03', c: ['Zakopane, Poland', '폴란드 자코파네'], s: ['Winter in the Tatras while working in Poland', '폴란드 근무 시절, 겨울 타트라산맥'], y: '2020 – 21', cc: 'pl' },
  { f: 'p02', c: ['Dąbrowa Górnicza, Poland', '폴란드 돔브로바'], s: ['SK IE battery separator plant site, during COVID-19', 'SKIE 배터리 분리막 공장 공사 현장, 코로나 시기'], y: '2021', cc: 'pl' },
  { f: 'p07', c: ['Grand Canyon West, USA', '미국 그랜드캐니언 웨스트'], s: ['Weekend trip during the Arizona LGAZ CESS project', 'Arizona LGAZ CESS 프로젝트 기간 중 주말 여행'], y: '2025 –', cc: 'us' },
  { f: 'p06', c: ['Hungary', '헝가리'], s: ['Business trip for the CATL Debrecen project meetings', 'CATL 데브레첸 프로젝트 업무 미팅 출장'], y: '2026', cc: 'hu' },
];
export const ABOUT_TAGS = [
  ['Studied in Vancouver, Canada', '캐나다 밴쿠버 유학'], ['8 countries worked in', '8개국 근무'],
  ['Photo and video editing', '사진·영상 편집'], ['Hiking', '등산'], ['Fishing', '낚시'],
];
export function renderAbout() {
  const tags = ABOUT_TAGS.map((x) => t(x[0], x[1], 'li')).join('');
  const photos = ABOUT_PHOTOS.map((p, i) => `
        <figure class="ab-ph" style="--i:${i}" data-cc="${p.cc}" data-y="${p.y}">
          <button type="button" class="ph-btn" data-full="about/${p.f}.jpg" aria-label="${p.c[0]}"><img src="about/${p.f}_s.jpg" alt="${p.c[0]}" loading="lazy" decoding="async"></button>
          <figcaption><b>${t(p.c[0], p.c[1])}</b>${t(p.s[0], p.s[1], 'span')}<em>${p.y}</em></figcaption>
        </figure>`).join('');
  return `
      <div class="ab-head">
        <h2 id="ab-h" class="mega"><span data-en="About" data-ko="About">About</span> <span class="hl" data-en="me" data-ko="me">me</span></h2>
        <div class="ab-txt">
          ${t('I started out drawing valves and rolling-stock bogies, then followed piping to eight countries. What I like most about site work is standing at the same drawing with a local crew until it makes sense to everyone.', '밸브와 전동차 대차를 그리던 기계설계에서 시작해 배관을 따라 8개국 현장을 다녔습니다. 낯선 현장에서 현지 작업자와 같은 도면을 펼쳐 놓고, 모두가 이해할 때까지 맞춰 가는 일을 좋아합니다.', 'p')}
          ${t('Between projects I hike, go fishing, take photos and edit video, a habit from making company catalogues and promo films early in my career.', '프로젝트 사이에는 산에 오르고, 낚시를 하고, 사진을 찍고, 영상을 편집합니다. 첫 직장에서 카탈로그와 홍보 영상을 만들던 습관이 남았습니다.', 'p')}
          <ul class="ab-tags">${tags}</ul>
        </div>
      </div>
      <div class="ab-stage" id="ab-stage" hidden>
        <div class="ab-sticky">
          <canvas id="ab-gl" aria-hidden="true"></canvas>
          <div class="ab-labels" id="ab-labels" aria-hidden="true"></div>
          <div class="ab-bar"><i id="ab-bar"></i></div>
          <div class="ab-hud" aria-live="polite">
            <div class="ab-count"><b id="ab-n">01</b> / ${String(ABOUT_PHOTOS.length).padStart(2, '0')}</div>
            <div class="ab-cap" id="ab-cap"></div>
          </div>
          <p class="ab-hint">${t('Scroll or drag · click a photo to open', '스크롤하거나 끌어서 넘겨 보세요 · 사진을 누르면 크게 봅니다', 'span')}</p>
        </div>
      </div>
      <div class="ab-grid" id="ab-grid">${photos}
      </div>`;
}
