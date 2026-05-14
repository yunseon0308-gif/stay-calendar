'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { SAMPLE_EVENTS } from '@/lib/sampleEvents';
import { CATEGORY_LABEL, CATEGORY_LIGHT } from '@/types/event';
import { ChevronRight } from 'lucide-react';

const PRICE_LABELS: Record<string, string> = {
  'under1.2': '1.2배 미만',
  '1.2-1.5':  '1.2~1.5배',
  '1.5-2':    '1.5~2배',
  '2-3':      '2~3배',
  '3-5':      '3~5배',
  'over5':    '5배 이상',
};

const SPEED_LABELS: Record<string, string> = {
  'super-fast': '2주 내 만실',
  'fast':       '한 달 전 만실',
  'normal':     '보통 속도',
  'slow':       '늦게 찼음',
  'no-effect':  '별 차이 없음',
};

type SurveyStats = {
  total: number;
  priceCount: Record<string, number>;
  occupancyCount: Record<string, number>;
};

type Tab = 'upcoming' | 'past';

export default function SurveyEventList() {
  const [surveyMap, setSurveyMap] = useState<Record<string, SurveyStats>>({});
  const [loading, setLoading]     = useState(true);
  const [activeTab, setActiveTab] = useState<Tab>('upcoming');

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  // slug 있는 행사만
  const events = SAMPLE_EVENTS.filter(e => e.slug);
  const upcoming = events.filter(e => new Date(e.date_end) >= today)
    .sort((a, b) => a.date_start.localeCompare(b.date_start));
  const past = events.filter(e => new Date(e.date_end) < today)
    .sort((a, b) => b.date_start.localeCompare(a.date_start));

  useEffect(() => {
    const ids = events.map(e => e.id).join(',');
    if (!ids) { setLoading(false); return; }
    fetch(`/api/survey?eventIds=${ids}`)
      .then(r => r.json())
      .then(data => setSurveyMap(data))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const topKey = (count: Record<string, number>) =>
    Object.entries(count).sort((a, b) => b[1] - a[1])[0]?.[0];

  const renderList = (list: typeof events) => {
    if (loading) {
      return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[1,2,3,4].map(i => (
            <div key={i} className="h-28 bg-gray-100 rounded-2xl animate-pulse" />
          ))}
        </div>
      );
    }
    if (list.length === 0) {
      return (
        <div className="bg-white border border-dashed border-gray-200 rounded-2xl p-8 text-center">
          <p className="text-sm text-gray-400">해당하는 행사가 없어요.</p>
        </div>
      );
    }
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {list.map(event => {
          const stats   = surveyMap[event.id];
          const total   = stats?.total ?? 0;
          const topPrice = stats ? topKey(stats.priceCount) : null;
          const topSpeed = stats ? topKey(stats.occupancyCount) : null;
          const isPast  = new Date(event.date_end) < today;
          const daysLeft = Math.ceil(
            (new Date(event.date_start).getTime() - today.getTime()) / 86400000
          );

          return (
            <Link
              key={event.id}
              href={`/event/${event.slug}/stats`}
              className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 hover:border-indigo-200 hover:shadow-md transition-all flex flex-col gap-2"
            >
              {/* 상단 */}
              <div className="flex items-start justify-between gap-2">
                <div className="min-w-0">
                  <span className={`inline-block text-[10px] font-semibold px-2 py-0.5 rounded-full border mb-1 ${CATEGORY_LIGHT[event.category]}`}>
                    {CATEGORY_LABEL[event.category]}
                  </span>
                  <p className="text-sm font-bold text-gray-800 leading-tight truncate">{event.title}</p>
                  <p className="text-xs text-gray-400 mt-0.5">
                    {event.district ? `${event.location} / ${event.district}` : event.location}
                    {' · '}{event.date_start}
                  </p>
                </div>
                <div className="shrink-0 flex flex-col items-end gap-1">
                  {isPast ? (
                    <span className="text-[10px] font-semibold text-gray-400 bg-gray-100 px-2 py-0.5 rounded-full">종료</span>
                  ) : (
                    <span className="text-[10px] font-bold text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded-full">D-{daysLeft}</span>
                  )}
                  <span className="text-[10px] text-gray-500">{total}명 참여</span>
                </div>
              </div>

              {/* 통계 요약 */}
              {(topPrice || topSpeed) && (
                <div className="flex flex-wrap gap-1.5">
                  {topPrice && PRICE_LABELS[topPrice] && (
                    <span className="text-[10px] font-semibold bg-indigo-50 text-indigo-600 px-2 py-1 rounded-lg border border-indigo-100">
                      💰 {PRICE_LABELS[topPrice]}
                    </span>
                  )}
                  {topSpeed && SPEED_LABELS[topSpeed] && (
                    <span className="text-[10px] font-semibold bg-emerald-50 text-emerald-600 px-2 py-1 rounded-lg border border-emerald-100">
                      ⚡ {SPEED_LABELS[topSpeed]}
                    </span>
                  )}
                </div>
              )}

              {/* 상세보기 */}
              <div className="flex items-center justify-end text-xs text-indigo-500 font-semibold gap-0.5 mt-auto pt-1 border-t border-gray-50">
                통계 + 댓글 보기
                <ChevronRight size={13} />
              </div>
            </Link>
          );
        })}
      </div>
    );
  };

  return (
    <div>
      {/* 탭 */}
      <div className="flex gap-1 bg-gray-100 rounded-xl p-1 mb-5">
        <button
          onClick={() => setActiveTab('upcoming')}
          className={`flex-1 text-sm font-medium py-2 rounded-lg transition-colors ${
            activeTab === 'upcoming'
              ? 'bg-white text-indigo-700 shadow-sm'
              : 'text-gray-500 hover:text-gray-700'
          }`}
        >
          📅 다가오는 행사
          <span className="ml-1.5 text-xs bg-indigo-100 text-indigo-600 px-1.5 py-0.5 rounded-full">
            {upcoming.length}
          </span>
        </button>
        <button
          onClick={() => setActiveTab('past')}
          className={`flex-1 text-sm font-medium py-2 rounded-lg transition-colors ${
            activeTab === 'past'
              ? 'bg-white text-indigo-700 shadow-sm'
              : 'text-gray-500 hover:text-gray-700'
          }`}
        >
          🏆 지난 행사 결과
          <span className="ml-1.5 text-xs bg-indigo-100 text-indigo-600 px-1.5 py-0.5 rounded-full">
            {past.length}
          </span>
        </button>
      </div>

      {activeTab === 'upcoming' ? renderList(upcoming) : renderList(past)}
    </div>
  );
}
