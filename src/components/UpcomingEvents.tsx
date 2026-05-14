'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Event, CATEGORY_LABEL, CATEGORY_LIGHT, CATEGORY_COLOR, getPriceRecommendation, getImpactBasis } from '@/types/event';
import { format, parseISO, differenceInDays, addDays } from 'date-fns';
import { ko } from 'date-fns/locale';
import { MapPin, Clock, Users, TrendingUp } from 'lucide-react';
import { eventHref } from '@/lib/events';
import { VOTE_RANGES } from '@/lib/voteConfig';

interface Props {
  events: Event[];
  selectedLocation: string;
}

export default function UpcomingEvents({ events, selectedLocation }: Props) {
  const [voteSummary, setVoteSummary] = useState<Record<string, { total: number; topLabel: string }>>({});

  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const in365days = addDays(today, 365);

  const upcoming = events
    .filter((e) => {
      const end   = parseISO(e.date_end);
      const start = parseISO(e.date_start);
      if (end < today) return false;
      if (start > in365days) return false;
      if (selectedLocation !== '전체' && e.location !== selectedLocation) return false;
      return true;
    })
    .sort((a, b) => a.date_start.localeCompare(b.date_start));

  // 투표 요약 일괄 조회
  useEffect(() => {
    if (events.length === 0) return;
    const ids = events.map(e => e.id).join(',');
    fetch(`/api/votes?eventIds=${ids}`)
      .then(r => r.json())
      .then(data => {
        const summary: Record<string, { total: number; topLabel: string }> = {};
        for (const [id, v] of Object.entries(data.summaries || {})) {
          const { results, total } = v as { results: Record<string, number>; total: number };
          if (total === 0) continue;
          const topKey = Object.entries(results).sort((a, b) => b[1] - a[1])[0]?.[0] ?? '';
          const topLabel = VOTE_RANGES.find(r => r.key === topKey)?.label ?? '';
          summary[id] = { total, topLabel };
        }
        setVoteSummary(summary);
      })
      .catch(() => {});
  }, [events]);

  if (upcoming.length === 0) return null;

  return (
    <div className="w-full">
      <h3 className="text-lg font-bold text-gray-800 mb-3">
        📅 다가오는 행사 <span className="text-sm font-normal text-gray-400">{upcoming.length}건</span>
      </h3>
      <div className="space-y-2">
        {upcoming.map((event) => {
          const start    = parseISO(event.date_start);
          const daysLeft = differenceInDays(start, today);
          const priceRec = getPriceRecommendation(event.expected_visitors);
          const vote     = voteSummary[event.id];

          const locationLabel = event.district
            ? `${event.location} / ${event.district}`
            : event.location;

          const dLabel  = daysLeft === 0 ? '끝' : String(daysLeft);
          const isToday = daysLeft === 0;

          return (
            <Link
              key={event.id}
              href={eventHref(event)}
              className="w-full text-left bg-white border border-gray-100 rounded-xl p-3 hover:shadow-md hover:border-indigo-200 transition-all flex items-start gap-3"
            >
              {/* 카테고리 색상 바 */}
              <div
                className={`w-1.5 rounded-full shrink-0 mt-1 ${CATEGORY_COLOR[event.category]}`}
                style={{ minHeight: '48px' }}
              />

              <div className="flex-1 min-w-0">
                {/* 뱃지 row */}
                <div className="flex items-center gap-1.5 mb-0.5 flex-wrap">
                  <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full border ${CATEGORY_LIGHT[event.category]}`}>
                    {CATEGORY_LABEL[event.category]}
                  </span>
                  {daysLeft <= 7 && (
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${
                      isToday
                        ? 'text-gray-500 bg-gray-100 border-gray-200'
                        : 'text-red-500 bg-red-50 border-red-200'
                    }`}>
                      D-{dLabel}
                    </span>
                  )}
                </div>

                {/* 제목 */}
                <p className="text-sm font-semibold text-gray-800 truncate">{event.title}</p>

                {/* 날짜 + 지역 */}
                <div className="flex items-center gap-3 mt-0.5 flex-wrap">
                  <span className="flex items-center gap-1 text-xs text-gray-400">
                    <Clock size={10} />
                    {format(start, 'M월 d일 (EEE)', { locale: ko })}
                  </span>
                  <span className="flex items-center gap-1 text-xs text-gray-400">
                    <MapPin size={10} />
                    {locationLabel}
                  </span>
                </div>

                {/* 숙박 영향도 별점 */}
                {event.impact && (
                  <div className="flex items-center gap-1.5 mt-0.5">
                    <span className="flex items-center leading-none">
                      {[1,2,3,4,5].map(i => (
                        <span key={i} className={`text-xs ${i <= event.impact! ? 'text-yellow-400' : 'text-gray-200'}`}>★</span>
                      ))}
                    </span>
                    <span className="text-[10px] text-gray-400">{getImpactBasis(event.impact)}</span>
                  </div>
                )}

                {/* 예상 인원 + 추천 요금 */}
                {(event.expected_visitors || priceRec) && (
                  <div className="flex items-center gap-3 mt-1 flex-wrap">
                    {event.expected_visitors && (
                      <span className="flex items-center gap-1 text-xs text-gray-500">
                        <Users size={10} className="text-indigo-400" />
                        일최대&nbsp;{event.expected_visitors >= 10000
                          ? `${(event.expected_visitors / 10000).toFixed(0)}만명`
                          : `${event.expected_visitors.toLocaleString()}명`}
                      </span>
                    )}
                    {priceRec && (
                      <span className="flex items-center gap-1 text-xs font-semibold text-emerald-600">
                        <TrendingUp size={10} />
                        {priceRec}
                      </span>
                    )}
                  </div>
                )}

                {/* 투표 요약 */}
                {vote && vote.total > 0 && (
                  <div className="flex items-center gap-1 mt-1">
                    <span className="text-[10px] text-indigo-500 bg-indigo-50 border border-indigo-100 px-1.5 py-0.5 rounded-full font-medium">
                      📊 {vote.total}명 투표 · 최다 {vote.topLabel}
                    </span>
                  </div>
                )}
              </div>

              {/* D-Day 숫자 */}
              <div className="text-right shrink-0">
                <p className={`text-base font-bold whitespace-nowrap ${isToday ? 'text-gray-400' : 'text-indigo-600'}`}>
                  {isToday ? '끝' : `D-${dLabel}`}
                </p>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
