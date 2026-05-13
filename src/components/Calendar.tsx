'use client';

import { useState, useMemo } from 'react';
import { useRouter } from 'next/navigation';
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
import { eventHref } from '@/lib/events';
import { getActiveSeasonsForMonth, getSpecialDayMap } from '@/lib/seasonalInfo';

interface Props {
  events: Event[];
  selectedLocation: string;
}

const WEEKDAYS = ['일', '월', '화', '수', '목', '금', '토'];

export default function Calendar({ events, selectedLocation }: Props) {
  const router       = useRouter();
  const [currentDate, setCurrentDate] = useState(new Date());

  const monthStart = startOfMonth(currentDate);
  const monthEnd   = endOfMonth(currentDate);
  const days       = eachDayOfInterval({ start: monthStart, end: monthEnd });

  const startPadding = getDay(monthStart);
  const paddingDays  = Array.from({ length: startPadding });

  const filtered = events.filter(
    (e) => selectedLocation === '전체' || e.location === selectedLocation
  );

  const getEventsForDay = (day: Date) =>
    filtered.filter((e) => {
      const start = parseISO(e.date_start);
      const end   = parseISO(e.date_end);
      return isWithinInterval(day, { start, end });
    });

  // ── 시즌 배너 ───────────────────────────────────────
  const activeSeasons = useMemo(
    () => getActiveSeasonsForMonth(currentDate.getMonth() + 1),
    [currentDate]
  );

  // ── 특별일 마커 ─────────────────────────────────────
  const specialDayMap = useMemo(
    () => getSpecialDayMap(currentDate.getFullYear(), currentDate.getMonth() + 1),
    [currentDate]
  );

  const prevMonth = () => setCurrentDate((d) => subMonths(d, 1));
  const nextMonth = () => setCurrentDate((d) => addMonths(d, 1));
  const goToday   = () => setCurrentDate(new Date());

  const today = new Date();

  return (
    <div className="w-full">
      {/* 헤더 */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <button onClick={prevMonth} className="p-2 rounded-xl hover:bg-gray-100 transition-colors">
            <ChevronLeft size={20} className="text-gray-600" />
          </button>
          <h2 className="text-2xl font-bold text-gray-900 min-w-[160px] text-center">
            {format(currentDate, 'yyyy년 M월', { locale: ko })}
          </h2>
          <button onClick={nextMonth} className="p-2 rounded-xl hover:bg-gray-100 transition-colors">
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

      {/* ── 시즌 배너 (최대 2개) ─────────────────────── */}
      {activeSeasons.length > 0 && (
        <div className="flex flex-col gap-2 mb-4">
          {activeSeasons.slice(0, 2).map((s) => (
            <div
              key={s.id}
              className={`flex items-start gap-2 px-3 py-2.5 rounded-xl border ${s.bgColor} ${s.textColor} ${s.borderColor}`}
            >
              <span className="text-base shrink-0 mt-0.5">{s.icon}</span>
              <p className="text-xs leading-relaxed">
                <span className="font-bold">{s.name}!</span>
                {' '}{s.message}
              </p>
            </div>
          ))}
        </div>
      )}

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
          <div key={`pad-${i}`} className="bg-gray-50 min-h-[52px] md:min-h-[100px]" />
        ))}

        {/* 날짜 */}
        {days.map((day) => {
          const dayEvents      = getEventsForDay(day);
          const isToday        = isSameDay(day, today);
          const isCurrentMonth = isSameMonth(day, currentDate);
          const dayOfWeek      = getDay(day);
          const dayNum         = parseInt(format(day, 'd'));
          const daySpecials    = specialDayMap[dayNum] || [];

          return (
            <div
              key={day.toISOString()}
              className={`bg-white min-h-[52px] md:min-h-[100px] p-1 md:p-1.5 ${!isCurrentMonth ? 'opacity-40' : ''}`}
            >
              {/* 날짜 숫자 */}
              <div
                className={`w-6 h-6 md:w-7 md:h-7 flex items-center justify-center rounded-full text-xs md:text-sm font-medium mb-0.5 ${
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

              {/* 특별일 마커 — 모바일: 아이콘만, 데스크톱: 아이콘+텍스트 */}
              {daySpecials.length > 0 && (
                <div className="mb-0.5">
                  {daySpecials.map((s, i) => (
                    <div key={i} className={`flex items-center gap-0.5 text-[8px] md:text-[9px] font-semibold leading-tight ${s.dotColor}`}>
                      <span>{s.icon}</span>
                      <span className="truncate hidden md:inline">{s.label}</span>
                    </div>
                  ))}
                </div>
              )}

              {/* 모바일: 컬러 도트 — 클릭 시 이벤트 페이지로 이동 */}
              {dayEvents.length > 0 && (
                <div className="flex flex-wrap gap-0.5 md:hidden">
                  {dayEvents.slice(0, 3).map((event) => (
                    <button
                      key={event.id}
                      onClick={() => router.push(eventHref(event))}
                      className={`w-2 h-2 rounded-full ${CATEGORY_COLOR[event.category]} hover:opacity-70`}
                      title={event.title}
                    />
                  ))}
                  {dayEvents.length > 3 && (
                    <span className="text-[8px] text-gray-400 leading-none">+</span>
                  )}
                </div>
              )}

              {/* 데스크톱: 텍스트 pill — 클릭 시 이벤트 페이지로 이동 */}
              <div className="space-y-0.5 hidden md:block">
                {dayEvents.slice(0, 3).map((event) => (
                  <button
                    key={event.id}
                    onClick={() => router.push(eventHref(event))}
                    className={`w-full text-left text-[10px] font-medium text-white px-1.5 py-0.5 rounded truncate ${CATEGORY_COLOR[event.category]} hover:opacity-80 transition-opacity`}
                  >
                    {event.title}
                  </button>
                ))}
                {dayEvents.length > 3 && (
                  <p className="text-[10px] text-gray-400 pl-1">+{dayEvents.length - 3}개 더</p>
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
        <div className="flex items-center gap-1.5 text-xs text-gray-400 ml-auto">
          🏮 설날·추석 &nbsp;|&nbsp; 🎄 크리스마스 &nbsp;|&nbsp; 🎆 새해·연말
        </div>
      </div>
    </div>
  );
}
