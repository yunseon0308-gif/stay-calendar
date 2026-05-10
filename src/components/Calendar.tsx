'use client';

import { useState } from 'react';
import {
  format,
  startOfMonth,
  endOfMonth,
  eachDayOfInterval,
  getDay,
  isSameDay,
  parseISO,
  isWithinInterval,
  addMonths,
  subMonths,
  isSameMonth,
} from 'date-fns';
import { ko } from 'date-fns/locale';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Event, CATEGORY_COLOR, CATEGORY_LABEL } from '@/types/event';
import EventModal from './EventModal';

interface Props {
  events: Event[];
  selectedLocation: string;
}

const WEEKDAYS = ['일', '월', '화', '수', '목', '금', '토'];

export default function Calendar({ events, selectedLocation }: Props) {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);

  const monthStart = startOfMonth(currentDate);
  const monthEnd = endOfMonth(currentDate);
  const days = eachDayOfInterval({ start: monthStart, end: monthEnd });

  // 앞쪽 빈칸 (일요일 기준)
  const startPadding = getDay(monthStart);
  const paddingDays = Array.from({ length: startPadding });

  // 필터링된 이벤트
  const filtered = events.filter(
    (e) => selectedLocation === '전체' || e.location === selectedLocation
  );

  // 특정 날짜에 해당하는 이벤트
  const getEventsForDay = (day: Date) =>
    filtered.filter((e) => {
      const start = parseISO(e.date_start);
      const end = parseISO(e.date_end);
      return isWithinInterval(day, { start, end });
    });

  const prevMonth = () => setCurrentDate((d) => subMonths(d, 1));
  const nextMonth = () => setCurrentDate((d) => addMonths(d, 1));
  const goToday = () => setCurrentDate(new Date());

  const today = new Date();

  return (
    <div className="w-full">
      {/* 헤더 */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <button
            onClick={prevMonth}
            className="p-2 rounded-xl hover:bg-gray-100 transition-colors"
          >
            <ChevronLeft size={20} className="text-gray-600" />
          </button>
          <h2 className="text-2xl font-bold text-gray-900 min-w-[160px] text-center">
            {format(currentDate, 'yyyy년 M월', { locale: ko })}
          </h2>
          <button
            onClick={nextMonth}
            className="p-2 rounded-xl hover:bg-gray-100 transition-colors"
          >
            <ChevronRight size={20} className="text-gray-600" />
          </button>
        </div>
        <button
          onClick={goToday}
          className="text-sm px-4 py-2 rounded-xl bg-indigo-50 text-indigo-600 hover:bg-indigo-100 font-medium transition-colors"
        >
          오늘
        </button>
      </div>

      {/* 요일 헤더 */}
      <div className="grid grid-cols-7 mb-2">
        {WEEKDAYS.map((d, i) => (
          <div
            key={d}
            className={`text-center text-xs font-semibold py-2 ${
              i === 0 ? 'text-red-400' : i === 6 ? 'text-blue-400' : 'text-gray-400'
            }`}
          >
            {d}
          </div>
        ))}
      </div>

      {/* 날짜 그리드 */}
      <div className="grid grid-cols-7 gap-px bg-gray-200 rounded-2xl overflow-hidden border border-gray-200">
        {/* 앞 빈칸 */}
        {paddingDays.map((_, i) => (
          <div key={`pad-${i}`} className="bg-gray-50 min-h-[100px]" />
        ))}

        {/* 날짜 */}
        {days.map((day) => {
          const dayEvents = getEventsForDay(day);
          const isToday = isSameDay(day, today);
          const isCurrentMonth = isSameMonth(day, currentDate);
          const dayOfWeek = getDay(day);

          return (
            <div
              key={day.toISOString()}
              className={`bg-white min-h-[100px] p-1.5 ${
                !isCurrentMonth ? 'opacity-40' : ''
              }`}
            >
              {/* 날짜 숫자 */}
              <div
                className={`w-7 h-7 flex items-center justify-center rounded-full text-sm font-medium mb-1 ${
                  isToday
                    ? 'bg-indigo-600 text-white'
                    : dayOfWeek === 0
                    ? 'text-red-500'
                    : dayOfWeek === 6
                    ? 'text-blue-500'
                    : 'text-gray-700'
                }`}
              >
                {format(day, 'd')}
              </div>

              {/* 이벤트 목록 */}
              <div className="space-y-0.5">
                {dayEvents.slice(0, 3).map((event) => (
                  <button
                    key={event.id}
                    onClick={() => setSelectedEvent(event)}
                    className={`w-full text-left text-[10px] font-medium text-white px-1.5 py-0.5 rounded truncate ${CATEGORY_COLOR[event.category]} hover:opacity-80 transition-opacity`}
                  >
                    {event.title}
                  </button>
                ))}
                {dayEvents.length > 3 && (
                  <p className="text-[10px] text-gray-400 pl-1">
                    +{dayEvents.length - 3}개 더
                  </p>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* 범례 */}
      <div className="mt-4 flex flex-wrap gap-3">
        {(Object.keys(CATEGORY_COLOR) as Array<keyof typeof CATEGORY_COLOR>).map((cat) => (
          <div key={cat} className="flex items-center gap-1.5 text-xs text-gray-500">
            <span className={`w-3 h-3 rounded-sm ${CATEGORY_COLOR[cat]}`} />
            {CATEGORY_LABEL[cat]}
          </div>
        ))}
      </div>

      {/* 이벤트 모달 */}
      {selectedEvent && (
        <EventModal event={selectedEvent} onClose={() => setSelectedEvent(null)} />
      )}
    </div>
  );
}
