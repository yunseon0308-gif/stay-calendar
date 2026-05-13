'use client';

import { useState, useEffect } from 'react';
import { SAMPLE_EVENTS } from '@/lib/sampleEvents';
import { VOTE_RANGES } from '@/lib/voteConfig';
import { CATEGORY_LABEL, CATEGORY_LIGHT } from '@/types/event';

interface VoteData {
  results: Record<string, number>;
  total: number;
}

type Tab = 'upcoming' | 'past';

function VoteBars({ results, total, compact = false }: { results: Record<string, number>; total: number; compact?: boolean }) {
  if (total === 0) {
    return <p className="text-xs text-gray-400 py-2">아직 투표 데이터가 없습니다.</p>;
  }
  const topKey = Object.entries(results).sort((a, b) => b[1] - a[1])[0]?.[0] ?? '';
  return (
    <div className={compact ? 'space-y-1' : 'space-y-1.5'}>
      {VOTE_RANGES.map(({ key, label }) => {
        const count = results[key] || 0;
        const pct   = total > 0 ? Math.round((count / total) * 100) : 0;
        const isTop = key === topKey;
        return (
          <div key={key} className="flex items-center gap-2">
            <span className={`text-xs w-20 shrink-0 ${isTop ? 'font-bold text-indigo-700' : 'text-gray-500'}`}>
              {label}
            </span>
            <div className="flex-1 bg-gray-100 rounded-full h-2 overflow-hidden">
              <div
                className={`h-2 rounded-full transition-all duration-500 ${isTop ? 'bg-indigo-500' : 'bg-gray-300'}`}
                style={{ width: `${pct}%` }}
              />
            </div>
            <span className={`text-xs w-8 text-right ${isTop ? 'font-bold text-indigo-600' : 'text-gray-400'}`}>
              {pct}%
            </span>
          </div>
        );
      })}
      <p className="text-xs text-gray-400 pt-1">총 {total}명 참여</p>
    </div>
  );
}

export default function PastEventVotes() {
  const [activeTab, setActiveTab]   = useState<Tab>('upcoming');
  const [voteMap, setVoteMap]       = useState<Record<string, VoteData>>({});
  const [loading, setLoading]       = useState(true);

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const pastEvents     = SAMPLE_EVENTS.filter(e => new Date(e.date_end) < today);
  const upcomingEvents = SAMPLE_EVENTS.filter(e => new Date(e.date_end) >= today);

  useEffect(() => {
    const ids = SAMPLE_EVENTS.map(e => e.id).join(',');
    if (!ids) { setLoading(false); return; }
    fetch(`/api/votes?eventIds=${ids}`)
      .then(r => r.json())
      .then(data => setVoteMap(data.summaries || {}))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  // 투표 데이터 있는 것만
  const upcomingWithVotes = upcomingEvents.filter(e => (voteMap[e.id]?.total ?? 0) > 0);
  const pastWithVotes     = pastEvents.filter(e => (voteMap[e.id]?.total ?? 0) > 0);

  if (loading) {
    return <div className="text-sm text-gray-400 py-4 text-center">불러오는 중...</div>;
  }

  return (
    <div>
      {/* 탭 버튼 */}
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
          {upcomingWithVotes.length > 0 && (
            <span className="ml-1.5 text-xs bg-indigo-100 text-indigo-600 px-1.5 py-0.5 rounded-full">
              {upcomingWithVotes.length}
            </span>
          )}
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
          {pastWithVotes.length > 0 && (
            <span className="ml-1.5 text-xs bg-indigo-100 text-indigo-600 px-1.5 py-0.5 rounded-full">
              {pastWithVotes.length}
            </span>
          )}
        </button>
      </div>

      {/* 다가오는 행사 탭 */}
      {activeTab === 'upcoming' && (
        <div>
          {upcomingWithVotes.length === 0 ? (
            <div className="bg-white border border-dashed border-gray-200 rounded-2xl p-8 text-center">
              <p className="text-sm text-gray-400 mb-1">아직 투표 데이터가 없어요.</p>
              <p className="text-xs text-gray-300">달력에서 행사를 클릭해 투표에 참여해보세요!</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {upcomingWithVotes.map(event => {
                const { results, total } = voteMap[event.id] ?? { results: {}, total: 0 };
                const daysLeft = Math.ceil(
                  (new Date(event.date_start).getTime() - today.getTime()) / (1000 * 60 * 60 * 24)
                );
                return (
                  <div key={event.id} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex-1 min-w-0">
                        <span className={`inline-block text-[10px] font-semibold px-2 py-0.5 rounded-full border mb-1 ${CATEGORY_LIGHT[event.category]}`}>
                          {CATEGORY_LABEL[event.category]}
                        </span>
                        <p className="text-sm font-bold text-gray-800 leading-tight">{event.title}</p>
                        <p className="text-xs text-gray-400 mt-0.5">
                          📍 {event.district ? `${event.location} / ${event.district}` : event.location}
                          &nbsp;·&nbsp;{event.date_start}
                        </p>
                      </div>
                      <div className="flex flex-col items-end gap-1 ml-2 shrink-0">
                        <span className="text-xs font-bold text-indigo-600">D-{daysLeft}</span>
                        <span className="text-xs text-indigo-500 bg-indigo-50 border border-indigo-100 px-2 py-0.5 rounded-full font-medium">
                          {total}명 참여
                        </span>
                      </div>
                    </div>
                    <VoteBars results={results} total={total} />
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* 지난 행사 탭 */}
      {activeTab === 'past' && (
        <div>
          {pastWithVotes.length === 0 ? (
            <div className="bg-white border border-dashed border-gray-200 rounded-2xl p-8 text-center">
              <p className="text-sm text-gray-400 mb-1">아직 지난 행사 투표 결과가 없어요.</p>
              <p className="text-xs text-gray-300">행사가 끝나면 투표 결과가 여기에 쌓입니다.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {pastWithVotes.map(event => {
                const { results, total } = voteMap[event.id] ?? { results: {}, total: 0 };
                return (
                  <div key={event.id} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex-1 min-w-0">
                        <span className={`inline-block text-[10px] font-semibold px-2 py-0.5 rounded-full border mb-1 ${CATEGORY_LIGHT[event.category]}`}>
                          {CATEGORY_LABEL[event.category]}
                        </span>
                        <p className="text-sm font-bold text-gray-800 leading-tight">{event.title}</p>
                        <p className="text-xs text-gray-400 mt-0.5">
                          📍 {event.district ? `${event.location} / ${event.district}` : event.location}
                          &nbsp;·&nbsp;{event.date_start}
                        </p>
                      </div>
                      <span className="text-xs text-emerald-500 bg-emerald-50 border border-emerald-100 px-2 py-0.5 rounded-full font-medium ml-2 shrink-0">
                        {total}명 참여
                      </span>
                    </div>
                    <VoteBars results={results} total={total} />
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
