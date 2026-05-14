'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { SAMPLE_EVENTS } from '@/lib/sampleEvents';
import { CATEGORY_LABEL, CATEGORY_LIGHT, CATEGORY_COLOR } from '@/types/event';
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

  const events   = SAMPLE_EVENTS.filter(e => e.slug);
  const upcoming = events.filter(e => new Date(e.date_end) >= today)
    .sort((a, b) => a.date_start.localeCompare(b.date_start));
  const past     = events.filter(e => new Date(e.date_end) < today)
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
        <div className="space-y-2">
          {[1,2,3].map(i => <div key={i} className="h-14 bg-gray-100 rounded-xl animate-pulse" />)}
        </div>
      );
    }
    if (list.length === 0) {
      return (
        <div className="text-center py-6 text-sm text-gray-400">해당하는 행사가 없어요.</div>
      );
    }
    return (
      /* 3개 높이 고정, 세로 스크롤 */
      <div className="overflow-y-auto max-h-[228px] space-y-2 pr-1">
        {list.map(event => {
          const stats    = surveyMap[event.id];
          const total    = stats?.total ?? 0;
          const topPrice = stats ? topKey(stats.priceCount) : null;
          const topSpeed = stats ? topKey(stats.occupancyCount) : null;
          const isPast   = new Date(event.date_end) < today;
          const daysLeft = Math.ceil(
            (new Date(event.date_start).getTime() - today.getTime()) / 86400000
          );

          return (
            <Link
              key={event.id}
              href={`/event/${event.slug}/stats`}
              className="flex items-start gap-3 bg-white border border-gray-100 rounded-xl p-3 hover:border-indigo-200 hover:shadow-sm transition-all"
            >
              {/* 카테고리 컬러 바 */}
              <div
                className={`w-1.5 rounded-full shrink-0 mt-0.5 ${CATEGORY_COLOR[event.category]}`}
                style={{ minHeight: '44px' }}
              />

              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-1.5 mb-0.5 flex-wrap">
                  <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full border ${CATEGORY_LIGHT[event.category]}`}>
                    {CATEGORY_LABEL[event.category]}
                  </span>
                  {topPrice && PRICE_LABELS[topPrice] && (
                    <span className="text-[10px] font-semibold text-indigo-600 bg-indigo-50 border border-indigo-100 px-1.5 py-0.5 rounded-full">
                      {PRICE_LABELS[topPrice]}
                    </span>
                  )}
                  {topSpeed && SPEED_LABELS[topSpeed] && (
                    <span className="text-[10px] font-semibold text-emerald-600 bg-emerald-50 border border-emerald-100 px-1.5 py-0.5 rounded-full">
                      {SPEED_LABELS[topSpeed]}
                    </span>
                  )}
                </div>
                <p className="text-sm font-semibold text-gray-800 truncate leading-tight">{event.title}</p>
                <p className="text-xs text-gray-400 mt-0.5 truncate">
                  {event.date_start} · {event.district ? `${event.location}/${event.district}` : event.location}
                </p>
              </div>

              {/* 우측 */}
              <div className="shrink-0 flex flex-col items-end gap-1">
                {isPast ? (
                  <span className="text-[10px] text-gray-400 bg-gray-100 px-2 py-0.5 rounded-full font-medium">종료</span>
                ) : (
                  <span className="text-[10px] font-bold text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded-full">D-{daysLeft}</span>
                )}
                <span className="text-[10px] text-gray-400">{total}명</span>
                <ChevronRight size={12} className="text-gray-300" />
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
      <div className="flex gap-1 bg-gray-100 rounded-xl p-1 mb-3">
        <button
          onClick={() => setActiveTab('upcoming')}
          className={`flex-1 text-sm font-medium py-1.5 rounded-lg transition-colors ${
            activeTab === 'upcoming'
              ? 'bg-white text-indigo-700 shadow-sm'
              : 'text-gray-500 hover:text-gray-700'
          }`}
        >
          📅 다가오는 행사
          <span className="ml-1 text-xs bg-indigo-100 text-indigo-600 px-1.5 py-0.5 rounded-full">
            {upcoming.length}
          </span>
        </button>
        <button
          onClick={() => setActiveTab('past')}
          className={`flex-1 text-sm font-medium py-1.5 rounded-lg transition-colors ${
            activeTab === 'past'
              ? 'bg-white text-indigo-700 shadow-sm'
              : 'text-gray-500 hover:text-gray-700'
          }`}
        >
          🏆 지난 행사 결과
          <span className="ml-1 text-xs bg-indigo-100 text-indigo-600 px-1.5 py-0.5 rounded-full">
            {past.length}
          </span>
        </button>
      </div>

      {activeTab === 'upcoming' ? renderList(upcoming) : renderList(past)}
    </div>
  );
}
