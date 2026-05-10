export type EventCategory =
  | 'concert'
  | 'festival'
  | 'fireworks'
  | 'sports'
  | 'exhibition'
  | 'other';

export const CATEGORY_LABEL: Record<EventCategory, string> = {
  concert: '콘서트',
  festival: '축제',
  fireworks: '불꽃놀이',
  sports: '스포츠',
  exhibition: '전시',
  other: '기타',
};

export const CATEGORY_COLOR: Record<EventCategory, string> = {
  concert: 'bg-purple-500',
  festival: 'bg-orange-400',
  fireworks: 'bg-yellow-400',
  sports: 'bg-blue-500',
  exhibition: 'bg-green-500',
  other: 'bg-gray-400',
};

export const CATEGORY_LIGHT: Record<EventCategory, string> = {
  concert: 'bg-purple-100 text-purple-700 border-purple-200',
  festival: 'bg-orange-100 text-orange-700 border-orange-200',
  fireworks: 'bg-yellow-100 text-yellow-700 border-yellow-200',
  sports: 'bg-blue-100 text-blue-700 border-blue-200',
  exhibition: 'bg-green-100 text-green-700 border-green-200',
  other: 'bg-gray-100 text-gray-700 border-gray-200',
};

export interface Event {
  id: string;
  title: string;
  category: EventCategory;
  date_start: string; // YYYY-MM-DD
  date_end: string;   // YYYY-MM-DD
  venue: string;
  location: string;   // 시/도 예: 서울, 부산
  expected_visitors?: number;
  source_url?: string;
  description?: string;
  created_at?: string;
}
