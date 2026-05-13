'use client';

import { useMemo } from 'react';
import { Event } from '@/types/event';

// 지역 표시 순서 (행사 없으면 자동 숨김)
const LOCATION_ORDER = [
  '전체', '서울', '부산', '인천', '대전', '대구', '광주', '울산',
  '경기', '강원', '충북', '충남', '경북', '경남', '전북', '전남', '제주',
];

interface Props {
  selected: string;
  onChange: (loc: string) => void;
  events: Event[];
}

export default function LocationFilter({ selected, onChange, events }: Props) {
  // 행사가 1개 이상 있는 지역만 추출 (순서 유지)
  const activeLocations = useMemo(() => {
    const locSet = new Set(events.map(e => e.location));
    return LOCATION_ORDER.filter(loc => loc === '전체' || locSet.has(loc));
  }, [events]);

  return (
    <div className="flex flex-wrap gap-2">
      {activeLocations.map((loc) => (
        <button
          key={loc}
          onClick={() => onChange(loc)}
          className={`text-sm px-3 py-1.5 rounded-full font-medium transition-colors ${
            selected === loc
              ? 'bg-indigo-600 text-white shadow-sm'
              : 'bg-white text-gray-600 border border-gray-200 hover:border-indigo-300 hover:text-indigo-600'
          }`}
        >
          {loc}
        </button>
      ))}
    </div>
  );
}
