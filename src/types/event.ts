export type EventCategory =
  | 'concert'
  | 'festival'
  | 'fireworks'
  | 'sports'
  | 'esports'
  | 'other';

export const CATEGORY_LABEL: Record<EventCategory, string> = {
  concert:  '콘서트',
  festival: '축제',
  fireworks:'불꽃놀이',
  sports:   '스포츠',
  esports:  '이스포츠',
  other:    '기타',
};

export const CATEGORY_COLOR: Record<EventCategory, string> = {
  concert:  'bg-purple-500',
  festival: 'bg-orange-400',
  fireworks:'bg-yellow-400',
  sports:   'bg-blue-500',
  esports:  'bg-teal-500',
  other:    'bg-gray-400',
};

export const CATEGORY_LIGHT: Record<EventCategory, string> = {
  concert:  'bg-purple-100 text-purple-700 border-purple-200',
  festival: 'bg-orange-100 text-orange-700 border-orange-200',
  fireworks:'bg-yellow-100 text-yellow-700 border-yellow-200',
  sports:   'bg-blue-100 text-blue-700 border-blue-200',
  esports:  'bg-teal-100 text-teal-700 border-teal-200',
  other:    'bg-gray-100 text-gray-700 border-gray-200',
};

// 숙박 영향도(impact) 기준 추천 요금 배율
export function getPriceRecommendation(impact?: number): string {
  if (!impact || impact <= 1) return '';
  if (impact === 5) return '2~3배 인상 추천';
  if (impact === 4) return '1.5~2배 인상 추천';
  if (impact === 3) return '1.2~1.5배 인상 추천';
  return '1.1~1.2배 인상 추천'; // impact 2
}

export interface Event {
  id: string;
  slug?: string;   // SEO URL: /event/[slug]
  title: string;
  category: EventCategory;
  date_start: string; // YYYY-MM-DD
  date_end: string;   // YYYY-MM-DD
  venue: string;
  location: string;   // 시/도 예: 서울, 부산
  district?: string;  // 상세 지역 예: 잠실, 여의도, 고척
  expected_visitors?: number;
  impact?: 1 | 2 | 3 | 4 | 5; // 숙박 영향도
  impact_basis?: string;       // 영향도 판단 근거
  source_url?: string;
  description?: string;
  created_at?: string;
}

/** 숙박 영향도 판단 근거 텍스트 */
export function getImpactBasis(impact?: number): string {
  if (!impact) return '';
  if (impact === 5) return '전국 관광객 집결';
  if (impact === 4) return '광역 수요 급증';
  if (impact === 3) return '지역 수요 증가';
  if (impact === 2) return '수요 소폭 증가';
  return '영향 미미';
}
