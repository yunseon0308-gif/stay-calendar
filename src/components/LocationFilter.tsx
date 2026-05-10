'use client';

const LOCATIONS = [
  '전체', '서울', '부산', '인천', '대구', '대전', '광주', '울산',
  '경기', '강원', '충북', '충남', '경북', '경남', '전북', '전남', '제주',
];

interface Props {
  selected: string;
  onChange: (loc: string) => void;
}

export default function LocationFilter({ selected, onChange }: Props) {
  return (
    <div className="flex flex-wrap gap-2">
      {LOCATIONS.map((loc) => (
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
