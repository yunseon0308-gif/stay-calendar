'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { SAMPLE_EVENTS } from '@/lib/sampleEvents';
import { CATEGORY_LABEL, CATEGORY_LIGHT, CATEGORY_COLOR } from '@/types/event';

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

  const CAT_ORDER = ['concert','festival','fireworks','sports','esports','other'];
  const byCat = (a: typeof SAMPLE_EVENTS[0], b: typeof SAMPLE_EVENTS[0]) => {
    const ci = CAT_ORDER.indexOf(a.category) - CAT_ORDER.indexOf(b.category);
    return ci !== 0 ? ci : a.date_start.localeCompare(b.date_start);
  };

  const events   = SAMPLE_EVENTS.filter(e => e.slug);
  const upcoming = events.filter(e => new Date(e.date_end) >= today).sort(byCat);
  const past     = events.filter(e => new Date(e.date_end) < today)
    .sort((a, b) => {
      const ci = CAT_ORDER.indexOf(a.category) - CAT_ORDER.indexOf(b.category);
      return ci !== 0 ? ci : b.date_start.localeCompare(a.date_start);
    });

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

  const renderGrid = (list: typeof events) => {
    if (loading) {
      return (
        <div className="grid grid-cols-4 gap-2">
          {Array.from({ length: 9 }).map((_, i) => (
            <div key={i} className="h-24 bg-gray-100 rounded-xl animate-pulse" />
          ))}
        </div>
      );
    }
    if (list.length === 0) {
      return (
        <div className="text-center py-8 text-sm text-gray-400">해당하는 행사가 없어요.</div>
      );
    }

    return (
      /* 3열 그리드, 3행 완전히 보이고 이후 스크롤 */
      <div className="overflow-y-auto" style={{ maxHeight: '308px' }}>
        <div className="grid grid-cols-4 gap-2">
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
                className="bg-white border border-gray-100 rounded-xl overflow-hidden hover:border-indigo-200 hover:shadow-sm transition-all flex flex-col"
              >
                {/* 상단 컬러 바 */}
                <div className={`h-1 shrink-0 ${CATEGORY_COLOR[event.category]}`} />

                <div className="p-2.5 flex flex-col gap-1 flex-1">
                  {/* 카테고리 + D-N */}
                  <div className="flex items-center justify-between gap-1">
                    <span className={`text-[9px] font-semibold px-1.5 py-0.5 rounded-full border leading-none ${CATEGORY_LIGHT[event.category]}`}>
                      {CATEGORY_LABEL[event.category]}
                    </span>
                    {isPast ? (
                      <span className="text-[9px] text-gray-400 font-medium leading-none">종료</span>
                    ) : (
                      <span className="text-[9px] font-bold text-indigo-600 leading-none">D-{daysLeft}</span>
                    )}
                  </div>

                  {/* 제목 */}
                  <p className="text-xs font-semibold text-gray-800 leading-tight line-clamp-2">{event.title}</p>

                  {/* 날짜 */}
                  <p className="text-[10px] text-gray-400 leading-none">{event.date_start}</p>

                  {/* 단가 + 속도 */}
                  {topPrice && PRICE_LABELS[topPrice] && (
                    <span className="text-[9px] font-semibold text-indigo-600 leading-none">
                      💰 {PRICE_LABELS[topPrice]}
                    </span>
                  )}
                  {topSpeed && SPEED_LABELS[topSpeed] && (
                    <span className="text-[9px] font-semibold text-emerald-600 leading-none">
                      ⚡ {SPEED_LABELS[topSpeed]}
                    </span>
                  )}

                  {/* 참여수 */}
                  <p className="text-[9px] text-gray-300 leading-none mt-auto">{total}명 참여</p>
                </div>
              </Link>
            );
          })}
        </div>
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

      {activeTab === 'upcoming' ? renderGrid(upcoming) : renderGrid(past)}
    </div>
  );
}
