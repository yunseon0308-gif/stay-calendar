import { Event } from '@/types/event';

// 실제 확인된 2026년 행사 데이터 (2026년 5월 11일 기준)
// expected_visitors = 일 최대 동시관람객 수 기준
// ※ (미확정) 표기 항목은 역대 개최 패턴 기반 예상 일정
export const SAMPLE_EVENTS: Event[] = [

  // ── 콘서트 (확정) ─────────────────────────
  {
    id: '1',
    title: 'BTS 월드투어 ARIRANG - 부산',
    category: 'concert',
    date_start: '2026-06-12',
    date_end: '2026-06-13',
    venue: '부산 아시아드 주경기장',
    location: '부산',
    district: '아시아드',
    expected_visitors: 50000,
    description: '방탄소년단 월드투어 부산 공연 (6/13 데뷔기념일)',
    source_url: 'https://tickets.interpark.com/contents/notice/detail/12426',
  },

  // ── 페스티벌 (확정) ───────────────────────
  {
    id: '8',
    title: '서울재즈페스티벌 2026',
    category: 'festival',
    date_start: '2026-05-22',
    date_end: '2026-05-24',
    venue: '올림픽공원 88잔디마당 · KSPO DOME',
    location: '서울',
    district: '잠실',
    expected_visitors: 30000,
    description: '자넬 모네, 에즈라 콜렉티브, 도겸·승관(세븐틴), 에픽하이 등',
    source_url: 'https://www.seouljazz.co.kr',
  },
  {
    id: '19',
    title: '워터밤 서울 2026',
    category: 'festival',
    date_start: '2026-07-24',
    date_end: '2026-07-26',
    venue: 'KINTEX 아웃도어 글로벌 스테이지',
    location: '경기',
    district: '고양',
    expected_visitors: 35000,
    description: '국내 최대 물 축제',
    source_url: 'https://waterbomb.kr',
  },
  {
    id: '9',
    title: '인천 펜타포트 락 페스티벌 2026',
    category: 'festival',
    date_start: '2026-07-31',
    date_end: '2026-08-02',
    venue: '송도달빛축제공원',
    location: '인천',
    district: '송도',
    expected_visitors: 40000,
    source_url: 'https://pentaport.co.kr',
  },
  {
    id: '11',
    title: '부산 국제영화제 (BIFF)',
    category: 'festival',
    date_start: '2026-10-01',
    date_end: '2026-10-10',
    venue: '영화의전당',
    location: '부산',
    district: '해운대',
    expected_visitors: 30000,
    description: '※ 공식 일정 미확정 (역대 패턴 기준)',
    source_url: 'https://www.biff.kr',
  },

  // ── 불꽃놀이 ─────────────────────────────
  {
    id: '5',
    title: '한화 서울세계불꽃축제 (※ 미확정)',
    category: 'fireworks',
    date_start: '2026-10-03',
    date_end: '2026-10-03',
    venue: '여의도한강공원',
    location: '서울',
    district: '여의도',
    expected_visitors: 1000000,
    description: '※ 공식 발표 전 — 역대 패턴(10월 첫째 주 토요일) 기반 예상일. 매년 100만명+ 방문',
  },
  {
    id: '6',
    title: '부산 광안리 불꽃축제 (※ 미확정)',
    category: 'fireworks',
    date_start: '2026-11-07',
    date_end: '2026-11-07',
    venue: '광안리해수욕장',
    location: '부산',
    district: '수영구',
    expected_visitors: 500000,
    description: '※ 공식 발표 전 — 역대 패턴(11월 첫째 주 토요일) 기반 예상일',
  },

  // ── 스포츠 ───────────────────────────────
  {
    id: '13',
    title: 'KBO 한국시리즈 (※ 미확정)',
    category: 'sports',
    date_start: '2026-10-21',
    date_end: '2026-10-31',
    venue: '개최구장 미정',
    location: '서울',
    district: '잠실',
    expected_visitors: 25000,
    description: '※ 정규시즌 종료 후 확정. 예상 개최지: 잠실야구장',
    source_url: 'https://www.koreabaseball.com',
  },
];
