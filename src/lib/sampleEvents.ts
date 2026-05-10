import { Event } from '@/types/event';

// 샘플 이벤트 데이터 (Supabase 연결 전 미리보기용)
// expected_visitors = 일 최대 동시관람객 수 기준
export const SAMPLE_EVENTS: Event[] = [
  // ── 콘서트 ──────────────────────────────
  {
    id: '1',
    title: 'BTS 월드투어 콘서트',
    category: 'concert',
    date_start: '2026-06-14',
    date_end: '2026-06-15',
    venue: '잠실올림픽주경기장',
    location: '서울',
    district: '잠실',
    expected_visitors: 70000,   // 잠실올림픽주경기장 수용 인원
    description: '방탄소년단 월드투어 서울 공연',
  },
  {
    id: '2',
    title: '아이유 콘서트 HEREH',
    category: 'concert',
    date_start: '2026-05-24',
    date_end: '2026-05-25',
    venue: '고척스카이돔',
    location: '서울',
    district: '고척',
    expected_visitors: 20000,   // 고척스카이돔 수용 인원
  },
  {
    id: '3',
    title: '세븐틴 팬미팅',
    category: 'concert',
    date_start: '2026-07-05',
    date_end: '2026-07-06',
    venue: 'KSPO DOME',
    location: '서울',
    district: '잠실',
    expected_visitors: 15000,   // KSPO DOME 수용 인원
  },
  {
    id: '4',
    title: '뉴진스 단독 콘서트',
    category: 'concert',
    date_start: '2026-08-16',
    date_end: '2026-08-17',
    venue: '사직실내체육관',
    location: '부산',
    district: '사직',
    expected_visitors: 8000,    // 사직실내체육관 수용 인원
  },
  {
    id: '16',
    title: 'Stray Kids 월드투어',
    category: 'concert',
    date_start: '2026-05-30',
    date_end: '2026-05-31',
    venue: '인스파이어 아레나',
    location: '인천',
    district: '영종도',
    expected_visitors: 15000,   // 인스파이어 아레나 수용 인원
  },
  {
    id: '18',
    title: '에스파(aespa) 콘서트',
    category: 'concert',
    date_start: '2026-05-16',
    date_end: '2026-05-17',
    venue: '고척스카이돔',
    location: '서울',
    district: '고척',
    expected_visitors: 20000,   // 고척스카이돔 수용 인원
  },
  // ── 불꽃놀이 ─────────────────────────────
  {
    id: '5',
    title: '한화 서울세계불꽃축제',
    category: 'fireworks',
    date_start: '2026-10-04',
    date_end: '2026-10-04',
    venue: '여의도한강공원',
    location: '서울',
    district: '여의도',
    expected_visitors: 1000000, // 단일 행사, 총 = 일최대
    description: '매년 100만명 이상 방문하는 서울 대표 불꽃축제',
  },
  {
    id: '6',
    title: '부산 광안리 불꽃축제',
    category: 'fireworks',
    date_start: '2026-11-01',
    date_end: '2026-11-01',
    venue: '광안리해수욕장',
    location: '부산',
    district: '수영구',
    expected_visitors: 500000,  // 단일 행사, 총 = 일최대
  },
  {
    id: '7',
    title: '포항 국제불빛축제',
    category: 'fireworks',
    date_start: '2026-08-01',
    date_end: '2026-08-03',
    venue: '영일대해수욕장',
    location: '경북',
    district: '포항',
    expected_visitors: 70000,   // 일 최대 동시관람객 (3일 행사)
  },
  // ── 축제 ─────────────────────────────────
  {
    id: '8',
    title: '서울 재즈 페스티벌',
    category: 'festival',
    date_start: '2026-05-22',
    date_end: '2026-05-24',
    venue: '올림픽공원 88잔디마당',
    location: '서울',
    district: '잠실',
    expected_visitors: 30000,   // 일 최대 동시관람객
  },
  {
    id: '9',
    title: '인천 펜타포트 락 페스티벌',
    category: 'festival',
    date_start: '2026-08-01',
    date_end: '2026-08-03',
    venue: '송도달빛축제공원',
    location: '인천',
    district: '송도',
    expected_visitors: 40000,   // 일 최대 동시관람객
  },
  {
    id: '10',
    title: '지산 록 페스티벌',
    category: 'festival',
    date_start: '2026-07-25',
    date_end: '2026-07-27',
    venue: '지산 포레스트 리조트',
    location: '경기',
    district: '이천',
    expected_visitors: 35000,   // 일 최대 동시관람객
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
    expected_visitors: 30000,   // 일 최대 동시관람객
  },
  {
    id: '12',
    title: '대전 사이언스 페스티벌',
    category: 'festival',
    date_start: '2026-10-23',
    date_end: '2026-10-26',
    venue: '엑스포 과학공원',
    location: '대전',
    district: '유성구',
    expected_visitors: 20000,   // 일 최대 동시관람객
  },
  {
    id: '17',
    title: '서울 빛초롱축제',
    category: 'festival',
    date_start: '2026-11-07',
    date_end: '2026-11-23',
    venue: '청계천 일대',
    location: '서울',
    district: '종로',
    expected_visitors: 30000,   // 일 최대 동시관람객
  },
  // ── 스포츠 (대형 경기만) ──────────────────
  {
    id: '13',
    title: 'KBO 한국시리즈',
    category: 'sports',
    date_start: '2026-10-21',
    date_end: '2026-10-31',
    venue: '잠실야구장',
    location: '서울',
    district: '잠실',
    expected_visitors: 25000,   // 잠실야구장 수용 인원
  },
  {
    id: '14',
    title: '축구 국가대표 A매치',
    category: 'sports',
    date_start: '2026-11-15',
    date_end: '2026-11-15',
    venue: '서울월드컵경기장',
    location: '서울',
    district: '상암',
    expected_visitors: 60000,   // 서울월드컵경기장 수용 인원
  },
];
