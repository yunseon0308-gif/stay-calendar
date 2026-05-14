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

const OCCUPANCY_OPTIONS = [
  { key: 'full',      label: '거의 만실' },
  { key: 'high',      label: '예약 많음' },
  { key: 'increased', label: '평소보다 증가' },
  { key: 'normal',    label: '비슷함' },
  { key: 'low',       label: '영향 적음' },
];

interface Props {
  eventId: string;
  eventSlug: string;
}

export default function EventSurvey({ eventId, eventSlug }: Props) {
  const router = useRouter();

  const [priceRange, setPriceRange] = useState<string | null>(null);
  const [occupancy, setOccupancy]   = useState<string | null>(null);
  const [submitted, setSubmitted]   = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const goToStats = () => router.push(`/event/${eventSlug}/stats`);

  const handleSubmit = async () => {
    if (!priceRange || !occupancy || submitting) return;
    setSubmitting(true);
    try {
      await fetch('/api/survey', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ eventId, priceRange, occupancy }),
      });
    } catch {
      // ignore
    } finally {
      setSubmitting(false);
      setSubmitted(true);
    }
  };

  /* ── 제출 완료 상태 ── */
  if (submitted) {
    return (
      <div className="border-t border-gray-100 pt-5">
        <div className="bg-emerald-50 border border-emerald-100 rounded-xl p-4 text-center">
          <p className="text-sm font-bold text-emerald-700 mb-1">✅ 공유 감사해요!</p>
          <p className="text-xs text-emerald-600 mb-3">소중한 경험이 다른 운영자에게 도움이 됩니다.</p>
          <button
            type="button"
            onClick={goToStats}
            className="inline-flex items-center gap-1.5 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold px-4 py-2 rounded-lg transition-colors"
          >
            📊 이 행사 통계 보기 →
          </button>
        </div>
      </div>
    );
  }

  /* ── 설문 폼 ── */
  return (
    <div className="border-t border-gray-100 pt-5">

      {/* 헤더 */}
      <div className="flex items-start justify-between mb-3 gap-3">
        <div>
          <p className="text-sm font-bold text-gray-800">🏆 운영자 실전 데이터 등록</p>
          <p className="text-xs text-gray-500 mt-0.5 leading-relaxed">
            실제 운영 경험을 공유해 더 정확한 행사 시즌 단가 데이터를 함께 만듭니다.
          </p>
        </div>
        <button
          type="button"
          onClick={goToStats}
          className="text-xs text-indigo-500 hover:text-indigo-700 whitespace-nowrap shrink-0 transition-colors"
        >
          이 행사 통계보기 →
        </button>
      </div>

      {/* Q1 단가 인상률 */}
      <div className="mb-3">
        <p className="text-[11px] font-semibold text-gray-700 mb-2">
          Q1. 이 행사 기간, 평소 대비 단가를 얼마나 인상하셨나요?
        </p>
        <div className="flex flex-wrap gap-1.5">
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
      </div>

      {/* Q2 예약률 체감 */}
      <div className="mb-4">
        <p className="text-[11px] font-semibold text-gray-700 mb-2">
          Q2. 예약률 체감은 어떠셨나요?
        </p>
        <div className="flex flex-wrap gap-1.5">
          {OCCUPANCY_OPTIONS.map(({ key, label }) => (
            <button
              key={key}
              type="button"
              onClick={() => setOccupancy(key)}
              className={`text-xs px-3 py-1.5 rounded-lg border transition-colors ${
                occupancy === key
                  ? 'bg-indigo-600 text-white border-indigo-600 font-semibold'
                  : 'border-gray-200 text-gray-600 hover:border-indigo-300 hover:text-indigo-600 hover:bg-indigo-50'
              }`}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      {/* 제출 */}
      <button
        type="button"
        onClick={handleSubmit}
        disabled={!priceRange || !occupancy || submitting}
        className="w-full text-sm font-semibold bg-indigo-600 hover:bg-indigo-700 text-white py-2.5 rounded-xl transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
      >
        {submitting ? '등록 중...' : '실전 데이터 공유하기'}
      </button>

    </div>
  );
}
