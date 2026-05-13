'use client';

import { useMemo } from 'react';
import { Event } from '@/types/event';


interface Props {
  selected: string;
  onChange: (loc: string) => void;
  events: Event[];
}

export default function LocationFilter({ selected, onChange, events }: Props) {
  // 행사가 1개 이상 있는 지역만 추출 (이벤트 수 내림차순)
  const activeLocations = useMemo(() => {
    const countMap = new Map<string, number>();
    events.forEach(e => countMap.set(e.location, (countMap.get(e.location) ?? 0) + 1));
    const sorted = [...countMap.entries()]
      .sort((a, b) => b[1] - a[1])
      .map(([loc]) => loc);
    return ['전체', ...sorted];
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
