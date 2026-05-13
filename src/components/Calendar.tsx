'use client';

import { useState, useMemo } from 'react';
import {
  format,
  startOfMonth,
  endOfMonth,
  eachDayOfInterval,
  getDay,
  isSameDay,
  parseISO,
  addMonths,
  subMonths,
  isSameMonth,
  isBefore,
  isAfter,
  differenceInDays,
} from 'date-fns';
import { ko } from 'date-fns/locale';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { Event, CATEGORY_COLOR, CATEGORY_LABEL } from '@/types/event';
import { eventHref } from '@/lib/events';
import { getActiveSeasonsForMonth, getSpecialDayMap } from '@/lib/seasonalInfo';

interface Props {
  events: Event[];
  selectedLocation: string;
}

interface StripInfo {
  event: Event;
  startCol: number; // 0-based column in this week
  colSpan: number;
  slot: number;     // vertical row for stacking
  isStart: boolean; // event actually starts in this week
  isEnd: boolean;   // event actually ends in this week
}

const WEEKDAYS  = ['일', '월', '화', '수', '목', '금', '토'];
const STRIP_H   = 22; // px per strip row (including gap)
const DAY_NUM_H = 28; // px reserved for the day-number area

// Outline style for long events (7+ days) — border-only, no fill
const CATEGORY_OUTLINE: Record<string, string> = {
  concert:  'border border-purple-400 text-purple-700 bg-purple-50',
  festival: 'border border-orange-400 text-orange-700 bg-orange-50',
  fireworks:'border border-yellow-400 text-yellow-600 bg-yellow-50',
  sports:   'border border-blue-400 text-blue-700 bg-blue-50',
  esports:  'border border-teal-400 text-teal-700 bg-teal-50',
  other:    'border border-gray-400 text-gray-600 bg-gray-50',
};

// ── helpers ──────────────────────────────────────────────────────────────────

function buildWeeks(paddingCount: number, days: Date[]): (Date | null)[][] {
  const all: (Date | null)[] = [...Array(paddingCount).fill(null), ...days];
  while (all.length % 7 !== 0) all.push(null);
  const weeks: (Date | null)[][] = [];
  for (let i = 0; i < all.length; i += 7) weeks.push(all.slice(i, i + 7));
  return weeks;
}

function computeStrips(
  week: (Date | null)[],
  events: Event[],
): { strips: StripInfo[]; numRows: number } {
  const realDays = week.filter(Boolean) as Date[];
  if (!realDays.length) return { strips: [], numRows: 0 };

  const weekStart = realDays[0];
  const weekEnd   = realDays[realDays.length - 1];

  // Multi-day events overlapping this week
  const multiDay = events
    .filter(e => e.date_start !== e.date_end)
    .filter(e => {
      const s  = parseISO(e.date_start);
      const en = parseISO(e.date_end);
      return !isAfter(s, weekEnd) && !isBefore(en, weekStart);
    })
    .sort((a, b) => a.date_start.localeCompare(b.date_start));

  if (!multiDay.length) return { strips: [], numRows: 0 };

  // Greedy slot assignment to avoid visual overlap
  const slotRanges: [number, number][][] = [];
  const strips: StripInfo[] = [];

  for (const event of multiDay) {
    const s  = parseISO(event.date_start);
    const en = parseISO(event.date_end);

    let startCol = -1, endCol = -1;
    for (let c = 0; c < 7; c++) {
      const d = week[c];
      if (!d) continue;
      if (!isBefore(d, s) && !isAfter(d, en)) {
        if (startCol === -1) startCol = c;
        endCol = c;
      }
    }
    if (startCol === -1) continue;

    let slot = 0;
    while (true) {
      if (!slotRanges[slot]) { slotRanges[slot] = [[startCol, endCol]]; break; }
      const conflict = slotRanges[slot].some(
        ([sc, ec]) => sc <= endCol && ec >= startCol,
      );
      if (!conflict) { slotRanges[slot].push([startCol, endCol]); break; }
      slot++;
    }

    strips.push({
      event,
      startCol,
      colSpan: endCol - startCol + 1,
      slot,
      isStart: !isBefore(s,  weekStart),
      isEnd:   !isAfter(en, weekEnd),
    });
  }

  return {
    strips,
    numRows: strips.length ? Math.max(...strips.map(s => s.slot)) + 1 : 0,
  };
}

// ── component ─────────────────────────────────────────────────────────────────

export default function Calendar({ events, selectedLocation }: Props) {
  const router = useRouter();
  const handleClick = (event: Event) => router.push(eventHref(event));
  const [currentDate, setCurrentDate] = useState(new Date());

  const monthStart   = startOfMonth(currentDate);
  const monthEnd     = endOfMonth(currentDate);
  const days         = eachDayOfInterval({ start: monthStart, end: monthEnd });
  const startPadding = getDay(monthStart);

  const filtered = useMemo(
    () => events.filter(e => selectedLocation === '전체' || e.location === selectedLocation),
    [events, selectedLocation],
  );

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const weeks = useMemo(() => buildWeeks(startPadding, days), [currentDate]);

  const weekLayouts = useMemo(
    () => weeks.map(w => computeStrips(w, filtered)),
    [weeks, filtered],
  );

  const activeSeasons = useMemo(
    () => getActiveSeasonsForMonth(currentDate.getMonth() + 1),
    [currentDate],
  );
  const specialDayMap = useMemo(
    () => getSpecialDayMap(currentDate.getFullYear(), currentDate.getMonth() + 1),
    [currentDate],
  );

  const prevMonth = () => setCurrentDate(d => subMonths(d, 1));
  const nextMonth = () => setCurrentDate(d => addMonths(d, 1));
  const goToday   = () => setCurrentDate(new Date());
  const today     = new Date();

  return (
    <div className="w-full">

      {/* ── 헤더 ────────────────────────────────────────── */}
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

      {/* ── 시즌 배너 ────────────────────────────────────── */}
      {activeSeasons.length > 0 && (
        <div className="flex flex-col gap-2 mb-4">
          {activeSeasons.slice(0, 2).map(s => (
            <div
              key={s.id}
              className={`flex items-start gap-2 px-3 py-2.5 rounded-xl border ${s.bgColor} ${s.textColor} ${s.borderColor}`}
            >
              <span className="text-base shrink-0 mt-0.5">{s.icon}</span>
              <p className="text-xs leading-relaxed">
                <span className="font-bold">{s.name}!</span>{' '}{s.message}
              </p>
            </div>
          ))}
        </div>
      )}

      {/* ── 요일 헤더 ─────────────────────────────────────── */}
      <div className="grid grid-cols-7 mb-1">
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

      {/* ── 날짜 그리드 (주 단위 렌더링) ─────────────────── */}
      <div className="rounded-2xl overflow-hidden border border-gray-200 divide-y divide-gray-200">

        {weeks.map((week, wi) => {
          const { strips, numRows } = weekLayouts[wi];
          const multiDayAreaH = numRows * STRIP_H;
          const totalTopH     = DAY_NUM_H + multiDayAreaH;

          return (
            <div key={wi} className="relative">

              {/* Day cells */}
              <div className="grid grid-cols-7 gap-px bg-gray-200">
                {week.map((day, ci) => {

                  /* ── padding cell ── */
                  if (!day) {
                    return (
                      <div
                        key={`pad-${wi}-${ci}`}
                        className="bg-gray-50"
                        style={{ minHeight: `${totalTopH + 32}px` }}
                      />
                    );
                  }

                  const isToday        = isSameDay(day, today);
                  const isCurrentMonth = isSameMonth(day, currentDate);
                  const dayOfWeek      = getDay(day);
                  const dayNum         = parseInt(format(day, 'd'));
                  const daySpecials    = specialDayMap[dayNum] || [];

                  // Only single-day events in cells; multi-day handled by strips
                  const singleEvts = filtered.filter(
                    e => e.date_start === e.date_end && isSameDay(parseISO(e.date_start), day),
                  );

                  return (
                    <div
                      key={day.toISOString()}
                      className={`bg-white flex flex-col ${!isCurrentMonth ? 'opacity-40' : ''}`}
                      style={{ minHeight: `${totalTopH + 32}px` }}
                    >
                      {/* Day number */}
                      <div
                        className="flex items-center gap-0.5 px-1 pt-1"
                        style={{ height: `${DAY_NUM_H}px` }}
                      >
                        <div
                          className={`w-6 h-6 flex items-center justify-center rounded-full text-xs font-medium shrink-0 ${
                            isToday         ? 'bg-indigo-600 text-white' :
                            dayOfWeek === 0 ? 'text-red-500'             :
                            dayOfWeek === 6 ? 'text-blue-500'            :
                                              'text-gray-700'
                          }`}
                        >
                          {format(day, 'd')}
                        </div>
                        {daySpecials.map((s, i) => (
                          <span
                            key={i}
                            className={`text-[8px] font-semibold leading-none ${s.dotColor}`}
                          >
                            {s.icon}
                            <span className="hidden md:inline ml-0.5 text-[8px]">{s.label}</span>
                          </span>
                        ))}
                      </div>

                      {/* Space reserved for multi-day strips */}
                      <div style={{ height: `${multiDayAreaH}px`, flexShrink: 0 }} />

                      {/* Single-day events */}
                      <div className="flex-1 px-1 pb-1">
                        {/* Mobile: dots */}
                        {singleEvts.length > 0 && (
                          <div className="flex flex-wrap gap-0.5 mb-0.5 md:hidden">
                            {singleEvts.slice(0, 3).map(evt => (
                              <button
                                key={evt.id}
                                onClick={() => handleClick(evt)}
                                className={`w-2 h-2 rounded-full ${CATEGORY_COLOR[evt.category]} hover:opacity-70`}
                                title={evt.title}
                              />
                            ))}
                            {singleEvts.length > 3 && (
                              <span className="text-[8px] text-gray-400">+</span>
                            )}
                          </div>
                        )}
                        {/* Desktop: pills */}
                        <div className="space-y-0.5 hidden md:block">
                          {singleEvts.slice(0, 3).map(evt => (
                            <button
                              key={evt.id}
                              onClick={() => handleClick(evt)}
                              className={`w-full text-left text-[10px] font-medium text-white px-1.5 py-0.5 rounded truncate ${CATEGORY_COLOR[evt.category]} hover:opacity-80 transition-opacity`}
                            >
                              {evt.title}
                            </button>
                          ))}
                          {singleEvts.length > 3 && (
                            <p className="text-[10px] text-gray-400 pl-1">
                              +{singleEvts.length - 3}개 더
                            </p>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* ── Multi-day event strips (absolute overlay) ── */}
              {strips.map(strip => {
                const topPx   = DAY_NUM_H + strip.slot * STRIP_H + 2;
                const leftPct = `${(strip.startCol / 7) * 100}%`;
                const widthPct= `${(strip.colSpan  / 7) * 100}%`;
                const stripH  = STRIP_H - 4;

                // Rounded corners & margins to visually show start/end
                const roundL = strip.isStart  ? 'rounded-l ml-0.5' : '';
                const roundR = strip.isEnd    ? 'rounded-r mr-0.5' : '';

                // 7일 이상 이벤트: 테두리만, 짧은 이벤트: 채움색
                const isLong = differenceInDays(
                  parseISO(strip.event.date_end),
                  parseISO(strip.event.date_start),
                ) >= 6;
                const colorClass = isLong
                  ? CATEGORY_OUTLINE[strip.event.category]
                  : `${CATEGORY_COLOR[strip.event.category]} text-white`;

                return (
                  <button
                    key={`${strip.event.id}-w${wi}`}
                    onClick={() => handleClick(strip.event)}
                    style={{
                      position: 'absolute',
                      top:    `${topPx}px`,
                      left:   leftPct,
                      width:  widthPct,
                      height: `${stripH}px`,
                      zIndex: 10,
                    }}
                    className={`
                      ${colorClass}
                      ${roundL} ${roundR}
                      hover:opacity-80 transition-opacity
                      flex items-center overflow-hidden cursor-pointer
                    `}
                  >
                    {/* 이벤트 이름: 데스크톱만, 시작 위치 또는 주 첫 열에서 표시 */}
                    {(strip.isStart || strip.startCol === 0) && (
                      <span className="text-[10px] font-semibold px-1.5 truncate leading-none hidden md:block whitespace-nowrap">
                        {strip.event.title}
                      </span>
                    )}
                    {/* 모바일: outline 이벤트도 점 표시 */}
                    {strip.isStart && isLong && (
                      <span className="w-1.5 h-1.5 rounded-full ml-1 shrink-0 md:hidden"
                        style={{ background: 'currentColor', opacity: 0.7 }}
                      />
                    )}
                  </button>
                );
              })}

            </div>
          );
        })}
      </div>

      {/* ── 범례 ──────────────────────────────────────────── */}
      <div className="mt-4 flex flex-wrap gap-3">
        {(Object.keys(CATEGORY_COLOR) as Array<keyof typeof CATEGORY_COLOR>).map(cat => (
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
