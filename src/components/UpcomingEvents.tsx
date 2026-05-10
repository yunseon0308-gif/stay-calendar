'use client';

import { useState } from 'react';
import { Event, CATEGORY_LABEL, CATEGORY_LIGHT, CATEGORY_COLOR, getPriceRecommendation } from '@/types/event';
import { format, parseISO, differenceInDays, isAfter, addDays } from 'date-fns';
import { ko } from 'date-fns/locale';
import { MapPin, Clock, Users, TrendingUp } from 'lucide-react';
import EventModal from './EventModal';

interface Props {
  events: Event[];
  selectedLocation: string;
}

export default function UpcomingEvents({ events, selectedLocation }: Props) {
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const in90days = addDays(today, 90);

  const upcoming = events
    .filter((e) => {
      const end = parseISO(e.date_end);
      const start = parseISO(e.date_start);
      if (end < today) return false;
      if (start > in90days) return false;
      if (selectedLocation !== '전체' && e.location !== selectedLocation) return false;
      return true;
    })
    .sort((a, b) => a.date_start.localeCompare(b.date_start))
    .slice(0, 8);

  if (upcoming.length === 0) return null;

  return (
    <div className="w-full">
      <h3 className="text-lg font-bold text-gray-800 mb-3">
        📅 다가오는 행사 (90일 이내)
      </h3>
      <div className="space-y-2">
        {upcoming.map((event) => {
          const start = parseISO(event.date_start);
          const daysLeft = differenceInDays(start, today);
          const priceRec = getPriceRecommendation(event.expected_visitors);

          // 지역 표기: 서울 / 잠실
          const locationLabel = event.district
            ? `${event.location} / ${event.district}`
            : event.location;

          // D-day 표기
          const dLabel = daysLeft === 0 ? '끝' : String(daysLeft);
          const isToday = daysLeft === 0;

          return (
            <button
              key={event.id}
              onClick={() => setSelectedEvent(event)}
              className="w-full text-left bg-white border border-gray-100 rounded-xl p-3 hover:shadow-md hover:border-indigo-200 transition-all flex items-start gap-3"
            >
              {/* 카테고리 색상 바 */}
              <div className={`w-1.5 rounded-full shrink-0 mt-1 ${CATEGORY_COLOR[event.category]}`} style={{ minHeight: '48px' }} />

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
              </div>

              {/* D-Day 숫자 */}
              <div className="text-right shrink-0">
                <p className={`text-base font-bold whitespace-nowrap ${isToday ? 'text-gray-400' : 'text-indigo-600'}`}>
                  {isToday ? '끝' : `D-${dLabel}`}
                </p>
              </div>
            </button>
          );
        })}
      </div>

      {selectedEvent && (
        <EventModal event={selectedEvent} onClose={() => setSelectedEvent(null)} />
      )}
    </div>
  );
}
