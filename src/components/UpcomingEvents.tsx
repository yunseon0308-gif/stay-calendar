'use client';

import { useState } from 'react';
import { Event, CATEGORY_LABEL, CATEGORY_LIGHT, CATEGORY_COLOR } from '@/types/event';
import { format, parseISO, differenceInDays, isAfter, isBefore, addDays } from 'date-fns';
import { ko } from 'date-fns/locale';
import { MapPin, Clock } from 'lucide-react';
import EventModal from './EventModal';

interface Props {
  events: Event[];
  selectedLocation: string;
}

export default function UpcomingEvents({ events, selectedLocation }: Props) {
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  const today = new Date();
  const in90days = addDays(today, 90);

  const upcoming = events
    .filter((e) => {
      const end = parseISO(e.date_end);
      const start = parseISO(e.date_start);
      if (!isAfter(end, today)) return false;
      if (isBefore(start, in90days) === false) return false;
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

          return (
            <button
              key={event.id}
              onClick={() => setSelectedEvent(event)}
              className="w-full text-left bg-white border border-gray-100 rounded-xl p-3 hover:shadow-md hover:border-indigo-200 transition-all flex items-center gap-3"
            >
              {/* 카테고리 색상 바 */}
              <div className={`w-1.5 h-12 rounded-full shrink-0 ${CATEGORY_COLOR[event.category]}`} />

              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-0.5">
                  <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full border ${CATEGORY_LIGHT[event.category]}`}>
                    {CATEGORY_LABEL[event.category]}
                  </span>
                  {daysLeft <= 7 && (
                    <span className="text-[10px] font-bold text-red-500 bg-red-50 px-2 py-0.5 rounded-full border border-red-200">
                      D-{daysLeft === 0 ? 'DAY' : daysLeft}
                    </span>
                  )}
                </div>
                <p className="text-sm font-semibold text-gray-800 truncate">{event.title}</p>
                <div className="flex items-center gap-3 mt-0.5">
                  <span className="flex items-center gap-1 text-xs text-gray-400">
                    <Clock size={10} />
                    {format(start, 'M월 d일 (EEE)', { locale: ko })}
                  </span>
                  <span className="flex items-center gap-1 text-xs text-gray-400">
                    <MapPin size={10} />
                    {event.location}
                  </span>
                </div>
              </div>

              <div className="text-right shrink-0">
                <p className="text-xs text-gray-400">D-</p>
                <p className="text-lg font-bold text-indigo-600">
                  {daysLeft === 0 ? 'DAY' : daysLeft}
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
