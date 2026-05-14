// ────────────────────────────────────────────────────────────
// 시즌 배너: 달력 상단에 표시되는 숙박 수요 시즌 안내
// ────────────────────────────────────────────────────────────
export interface Season {
  id: string;
  icon: string;
  name: string;
  message: string;      // 배너 메시지
  startMonth: number;   // 1-12
  startDay: number;
  endMonth: number;
  endDay: number;
  bgColor: string;
  textColor: string;
  borderColor: string;
  priority: number;     // 낮을수록 우선 표시
}

export const SEASONS: Season[] = [
  {
    id: 'summer',
    icon: '☀️',
    name: '여름 성수기',
    message: '해수욕장·제주·강원 지역 숙소라면 지금이 단가 올릴 타이밍이에요!',
    startMonth: 7, startDay: 15,
    endMonth: 8,  endDay: 20,
    bgColor: 'bg-amber-50', textColor: 'text-amber-800', borderColor: 'border-amber-200',
    priority: 1,
  },
  {
    id: 'cherry',
    icon: '🌸',
    name: '벚꽃 시즌',
    message: '여의도·경주·제주 등 벚꽃 명소 근처 숙소는 단가를 확인하세요.',
    startMonth: 3, startDay: 25,
    endMonth: 4,  endDay: 15,
    bgColor: 'bg-pink-50', textColor: 'text-pink-800', borderColor: 'border-pink-200',
    priority: 2,
  },
  {
    id: 'golden',
    icon: '🌼',
    name: '황금연휴',
    message: '어린이날 전후 여행 수요가 급증합니다. 단가를 미리 올려두세요!',
    startMonth: 5, startDay: 1,
    endMonth: 5,  endDay: 7,
    bgColor: 'bg-green-50', textColor: 'text-green-800', borderColor: 'border-green-200',
    priority: 1,
  },
  {
    id: 'autumn',
    icon: '🍂',
    name: '단풍 시즌',
    message: '설악산·내장산 등 단풍 명소 인근 숙소 수요가 높아지는 시기예요.',
    startMonth: 10, startDay: 1,
    endMonth: 11,  endDay: 10,
    bgColor: 'bg-orange-50', textColor: 'text-orange-800', borderColor: 'border-orange-200',
    priority: 2,
  },
  {
    id: 'ski',
    icon: '🏔️',
    name: '스키 시즌',
    message: '강원도 스키장 인근 숙소라면 시즌 내내 단가를 높게 유지하세요.',
    startMonth: 12, startDay: 1,
    endMonth: 2,   endDay: 28,
    bgColor: 'bg-sky-50', textColor: 'text-sky-800', borderColor: 'border-sky-200',
    priority: 3,
  },
  {
    id: 'christmas',
    icon: '🎄',
    name: '크리스마스·연말 시즌',
    message: '도심·스키장 숙소 커플 수요 급증! 연말 카운트다운 명소 인근도 주목하세요.',
    startMonth: 12, startDay: 20,
    endMonth: 12,  endDay: 31,
    bgColor: 'bg-red-50', textColor: 'text-red-800', borderColor: 'border-red-200',
    priority: 1,
  },
  {
    id: 'newyear',
    icon: '🎆',
    name: '연말연시',
    message: '해맞이·카운트다운 명소 인근 숙소 단가를 점검해보세요.',
    startMonth: 12, startDay: 28,
    endMonth: 1,   endDay: 3,
    bgColor: 'bg-yellow-50', textColor: 'text-yellow-800', borderColor: 'border-yellow-200',
    priority: 1,
  },
  {
    id: 'spring-exchange',
    icon: '📚',
    name: '봄학기 교환학생 입국 시즌',
    message: '외국인 교환학생 입국 집중 시기 (2월 중하순 수요 집중 · ~6월 말 체류). 대학가 인근 숙소 장기 수요가 증가해요.',
    startMonth: 2, startDay: 15,
    endMonth: 6,   endDay: 30,
    bgColor: 'bg-violet-50', textColor: 'text-violet-800', borderColor: 'border-violet-200',
    priority: 4,
  },
  {
    id: 'autumn-exchange',
    icon: '📚',
    name: '가을학기 교환학생 입국 시즌',
    message: '외국인 교환학생 입국 집중 시기 (8월 중하순 수요 집중 · ~12월 말 체류). 대학가·외국인 밀집 지역 숙소 수요가 높아지는 시기예요.',
    startMonth: 8, startDay: 15,
    endMonth: 12,  endDay: 20,
    bgColor: 'bg-indigo-50', textColor: 'text-indigo-800', borderColor: 'border-indigo-200',
    priority: 4,
  },
];

/** 주어진 월(1-12)에 해당하는 시즌 목록 반환 */
export function getActiveSeasonsForMonth(month: number): Season[] {
  const active = SEASONS.filter(s => {
    // 연말→연초 걸치는 경우 (startMonth > endMonth)
    if (s.startMonth > s.endMonth) {
      return month >= s.startMonth || month <= s.endMonth;
    }
    return month >= s.startMonth && month <= s.endMonth;
  });
  return active.sort((a, b) => a.priority - b.priority);
}


// ────────────────────────────────────────────────────────────
// 특별일 마커: 달력 날짜 칸에 표시되는 전국 이벤트
// ────────────────────────────────────────────────────────────
export interface SpecialDay {
  month: number;
  day: number;
  label: string;
  icon: string;
  dotColor: string;
}

export interface YearlySpecialDay extends SpecialDay {
  year: number;
}

// 매년 고정 날짜
export const FIXED_SPECIAL_DAYS: SpecialDay[] = [
  { month: 1,  day: 1,  label: '새해',        icon: '🎆', dotColor: 'text-yellow-500' },
  { month: 2,  day: 14, label: '발렌타인',     icon: '💝', dotColor: 'text-red-400'    },
  { month: 5,  day: 5,  label: '어린이날',     icon: '🎈', dotColor: 'text-emerald-500'},
  { month: 10, day: 31, label: '핼러윈',       icon: '🎃', dotColor: 'text-orange-500' },
  { month: 12, day: 24, label: '크리스마스이브', icon: '🎄', dotColor: 'text-red-400'   },
  { month: 12, day: 25, label: '크리스마스',   icon: '🎄', dotColor: 'text-red-600'    },
  { month: 12, day: 31, label: '연말',         icon: '🎆', dotColor: 'text-yellow-500' },
];

// 연도별 음력 공휴일 (설날·추석 연휴)
export const YEARLY_SPECIAL_DAYS: YearlySpecialDay[] = [
  // ── 2025 ──────────────────────────────────
  // 설날 연휴: 1/28(화)~1/30(목)
  { year: 2025, month: 1,  day: 28, label: '설날', icon: '🏮', dotColor: 'text-red-500' },
  { year: 2025, month: 1,  day: 29, label: '설날', icon: '🏮', dotColor: 'text-red-500' },
  { year: 2025, month: 1,  day: 30, label: '설날', icon: '🏮', dotColor: 'text-red-500' },
  // 추석 연휴: 10/5(일)~10/7(화)
  { year: 2025, month: 10, day: 5,  label: '추석', icon: '🌕', dotColor: 'text-amber-500' },
  { year: 2025, month: 10, day: 6,  label: '추석', icon: '🌕', dotColor: 'text-amber-500' },
  { year: 2025, month: 10, day: 7,  label: '추석', icon: '🌕', dotColor: 'text-amber-500' },

  // ── 2026 ──────────────────────────────────
  // 설날 연휴: 2/16(월)~2/18(수)
  { year: 2026, month: 2,  day: 16, label: '설날', icon: '🏮', dotColor: 'text-red-500' },
  { year: 2026, month: 2,  day: 17, label: '설날', icon: '🏮', dotColor: 'text-red-500' },
  { year: 2026, month: 2,  day: 18, label: '설날', icon: '🏮', dotColor: 'text-red-500' },
  // 추석 연휴: 9/24(목)~9/26(토)
  { year: 2026, month: 9,  day: 24, label: '추석', icon: '🌕', dotColor: 'text-amber-500' },
  { year: 2026, month: 9,  day: 25, label: '추석', icon: '🌕', dotColor: 'text-amber-500' },
  { year: 2026, month: 9,  day: 26, label: '추석', icon: '🌕', dotColor: 'text-amber-500' },

  // ── 2027 ──────────────────────────────────
  // 설날 연휴: 2/6(토)~2/8(월)
  { year: 2027, month: 2,  day: 6,  label: '설날', icon: '🏮', dotColor: 'text-red-500' },
  { year: 2027, month: 2,  day: 7,  label: '설날', icon: '🏮', dotColor: 'text-red-500' },
  { year: 2027, month: 2,  day: 8,  label: '설날', icon: '🏮', dotColor: 'text-red-500' },
  // 추석 연휴: 9/14(화)~9/16(목)
  { year: 2027, month: 9,  day: 14, label: '추석', icon: '🌕', dotColor: 'text-amber-500' },
  { year: 2027, month: 9,  day: 15, label: '추석', icon: '🌕', dotColor: 'text-amber-500' },
  { year: 2027, month: 9,  day: 16, label: '추석', icon: '🌕', dotColor: 'text-amber-500' },
];

/** 주어진 연/월에 해당하는 특별일 맵 (day → 특별일 배열) 반환 */
export function getSpecialDayMap(
  year: number,
  month: number
): Record<number, { label: string; icon: string; dotColor: string }[]> {
  const map: Record<number, { label: string; icon: string; dotColor: string }[]> = {};

  const addDay = (day: number, entry: { label: string; icon: string; dotColor: string }) => {
    if (!map[day]) map[day] = [];
    map[day].push(entry);
  };

  for (const s of FIXED_SPECIAL_DAYS) {
    if (s.month === month) addDay(s.day, s);
  }
  for (const s of YEARLY_SPECIAL_DAYS) {
    if (s.year === year && s.month === month) addDay(s.day, s);
  }
  return map;
}
