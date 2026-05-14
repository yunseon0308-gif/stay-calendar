'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

const PRICE_OPTIONS = [
  { key: 'under1.2', label: '1.2배 미만' },
  { key: '1.2-1.5',  label: '1.2~1.5배' },
  { key: '1.5-2',    label: '1.5~2배' },
  { key: '2-3',      label: '2~3배' },
  { key: '3-5',      label: '3~5배' },
  { key: 'over5',    label: '5배 이상' },
];

const SPEED_OPTIONS = [
  { key: '3m', label: '3개월 전' },
  { key: '2m', label: '2개월 전' },
  { key: '1m', label: '1개월 전' },
  { key: '2w', label: '2주 전' },
  { key: '1w', label: '1주 전' },
];

const PRICE_LABELS: Record<string, string> = {
  'under1.2': '1.2배 미만', '1.2-1.5': '1.2~1.5배',
  '1.5-2': '1.5~2배', '2-3': '2~3배', '3-5': '3~5배', 'over5': '5배 이상',
};
const SPEED_LABELS: Record<string, string> = {
  '3m': '3개월 전', '2m': '2개월 전', '1m': '1개월 전', '2w': '2주 전', '1w': '1주 전',
};

type Stats = { total: number; priceCount: Record<string, number>; occupancyCount: Record<string, number> };

interface Props {
  eventId: string;
  eventSlug: string;
  onStats?: () => void;
}

export default function EventSurvey({ eventId, eventSlug, onStats }: Props) {
  const router = useRouter();
  const [priceRange, setPriceRange] = useState<string | null>(null);
  const [speed, setSpeed]           = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [stats, setStats]           = useState<Stats | null>(null);

  useEffect(() => {
    fetch(`/api/survey?eventId=${eventId}`)
      .then(r => r.json()).then(setStats).catch(() => {});
  }, [eventId]);

  const topOf = (count: Record<string, number>) =>
    Object.entries(count).sort((a, b) => b[1] - a[1])[0];
  const pct = (n: number, total: number) =>
    total > 0 ? Math.round((n / total) * 100) : 0;

  const bothSelected = !!(priceRange && speed);
  const topPrice  = stats?.total ? topOf(stats.priceCount) : null;
  const topSpeed  = stats?.total ? topOf(stats.occupancyCount) : null;

  const goToStats = async () => {
    if (submitting) return;
    if (bothSelected) {
      setSubmitting(true);
      try {
        await fetch('/api/survey', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ eventId, priceRange, occupancy: speed }),
        });
      } catch {}
    }
    if (onStats) onStats();
    else router.push(`/event/${eventSlug}/stats`);
  };

  return (
    <div className="border-t border-gray-100 pt-5">

      <p className="text-sm font-bold text-gray-800 mb-3">🏆 운영자 실전 데이터 등록</p>

      {/* Q1 */}
      <p className="text-[11px] font-semibold text-gray-600 mb-2">
        Q1. 평소 대비 단가를 얼마나 인상하셨나요?
      </p>
      <div className="flex flex-wrap gap-1.5 mb-4">
        {PRICE_OPTIONS.map(({ key, label }) => (
          <button key={key} type="button" onClick={() => setPriceRange(key)}
            className={`text-xs px-3 py-1.5 rounded-lg border transition-colors ${
              priceRange === key
                ? 'bg-indigo-600 text-white border-indigo-600 font-semibold'
                : 'border-gray-200 text-gray-600 hover:border-indigo-300 hover:text-indigo-600 hover:bg-indigo-50'
            }`}>{label}</button>
        ))}
      </div>

      {/* Q2 */}
      <div className="mb-4">
        <p className="text-[11px] font-semibold text-gray-600 mb-2">Q2. 예약이 언제쯤 찼나요?</p>
        <div className="flex flex-wrap gap-1.5">
          {SPEED_OPTIONS.map(({ key, label }) => (
            <button key={key} type="button" onClick={() => setSpeed(key)}
              className={`text-xs px-3 py-1.5 rounded-lg border transition-colors ${
                speed === key
                  ? 'bg-emerald-600 text-white border-emerald-600 font-semibold'
                  : 'border-gray-200 text-gray-600 hover:border-emerald-300 hover:text-emerald-600 hover:bg-emerald-50'
              }`}>{label}</button>
          ))}
        </div>
      </div>

      {/* 통계보기 버튼 — 항상 노출, 선택 완료 시 내용 전환 */}
      <button
        type="button"
        onClick={goToStats}
        disabled={submitting}
        className={`w-full rounded-xl transition-all disabled:opacity-60 ${
          bothSelected
            ? 'bg-indigo-600 hover:bg-indigo-700 text-white py-3'
            : 'bg-gray-50 hover:bg-indigo-50 border border-gray-200 hover:border-indigo-300 text-gray-500 hover:text-indigo-600 py-2.5'
        }`}
      >
        {submitting ? (
          <span className="text-sm font-semibold">저장 중...</span>
        ) : bothSelected && topPrice && topSpeed ? (
          /* 선택 완료: 최다 득표 결과 미리보기 */
          <div className="flex flex-col items-center gap-0.5">
            <div className="flex items-center gap-3 text-xs font-semibold">
              <span>💰 {PRICE_LABELS[topPrice[0]] ?? topPrice[0]} ({pct(topPrice[1], stats!.total)}%)</span>
              <span className="text-indigo-200">|</span>
              <span>⏰ {SPEED_LABELS[topSpeed[0]] ?? topSpeed[0]} ({pct(topSpeed[1], stats!.total)}%)</span>
            </div>
            <span className="text-[11px] text-indigo-200 font-medium">📊 상세 통계 보기 →</span>
          </div>
        ) : (
          <span className="text-sm font-semibold">📊 이 행사 통계 보기 →</span>
        )}
      </button>

    </div>
  );
}
