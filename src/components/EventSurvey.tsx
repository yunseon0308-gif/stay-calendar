'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

const PRICE_OPTIONS = [
  { key: 'under1.2', label: '1.2배 미만' },
  { key: '1.2-1.5',  label: '1.2~1.5배' },
  { key: '1.5-2',    label: '1.5~2배' },
  { key: '2-3',      label: '2~3배' },
  { key: '3-5',      label: '3~5배' },
  { key: 'over5',    label: '5배 이상' },
];

interface Props {
  eventId: string;
  eventSlug: string;
  onStats?: () => void; // 모달에서 호출 시 모달 닫힘 처리용
}

export default function EventSurvey({ eventId, eventSlug, onStats }: Props) {
  const router = useRouter();
  const [priceRange, setPriceRange] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const handleStats = async () => {
    if (!priceRange || submitting) return;
    setSubmitting(true);
    try {
      await fetch('/api/survey', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ eventId, priceRange }),
      });
    } catch {
      // ignore
    }
    if (onStats) {
      onStats();
    } else {
      router.push(`/event/${eventSlug}/stats`);
    }
  };

  return (
    <div className="border-t border-gray-100 pt-5">

      {/* 헤더 */}
      <p className="text-sm font-bold text-gray-800 mb-3">🏆 운영자 실전 데이터 등록</p>

      {/* Q1 단가 인상률 */}
      <p className="text-[11px] font-semibold text-gray-600 mb-2">
        이 행사 기간, 평소 대비 단가를 얼마나 인상하셨나요?
      </p>
      <div className="flex flex-wrap gap-1.5 mb-4">
        {PRICE_OPTIONS.map(({ key, label }) => (
          <button
            key={key}
            type="button"
            onClick={() => setPriceRange(key)}
            className={`text-xs px-3 py-1.5 rounded-lg border transition-colors ${
              priceRange === key
                ? 'bg-indigo-600 text-white border-indigo-600 font-semibold'
                : 'border-gray-200 text-gray-600 hover:border-indigo-300 hover:text-indigo-600 hover:bg-indigo-50'
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      {/* 선택 후 통계보기 버튼 등장 */}
      {priceRange && (
        <button
          type="button"
          onClick={handleStats}
          disabled={submitting}
          className="w-full text-sm font-semibold bg-indigo-600 hover:bg-indigo-700 text-white py-2.5 rounded-xl transition-all disabled:opacity-60"
        >
          {submitting ? '저장 중...' : '📊 이 행사 통계 보기 →'}
        </button>
      )}

    </div>
  );
}
