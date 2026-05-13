'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { format, parseISO } from 'date-fns';
import { ko } from 'date-fns/locale';
import { X, MapPin, Calendar, Users, TrendingUp, ExternalLink, ArrowUpRight } from 'lucide-react';
import { Event, CATEGORY_LABEL, CATEGORY_LIGHT, getPriceRecommendation } from '@/types/event';
import { eventHref } from '@/lib/events';
import EventVoting from '@/components/EventVoting';

export default function EventModal({ event }: { event: Event }) {
  const router = useRouter();
  const onClose = () => router.back();

  // body 스크롤 잠금
  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = ''; };
  }, []);

  // ESC 닫기
  useEffect(() => {
    const handler = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, []);

  const start         = parseISO(event.date_start);
  const end           = parseISO(event.date_end);
  const isSameDay     = event.date_start === event.date_end;
  const priceRec      = getPriceRecommendation(event.expected_visitors);
  const locationLabel = event.district
    ? `${event.location} / ${event.district}`
    : event.location;
  const visitorsLabel = event.expected_visitors
    ? event.expected_visitors >= 10000
      ? `${(event.expected_visitors / 10000).toFixed(0)}만명`
      : `${event.expected_visitors.toLocaleString()}명`
    : null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center"
      onClick={onClose}
    >
      {/* 배경 블러 */}
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" />

      {/* 카드 — 모바일: 하단 시트 / 데스크톱: 중앙 */}
      <div
        className="relative z-10 w-full sm:max-w-lg bg-white
          rounded-t-2xl sm:rounded-2xl shadow-2xl
          max-h-[92dvh] sm:max-h-[85vh] flex flex-col"
        onClick={e => e.stopPropagation()}
      >
        {/* 핸들 (모바일) */}
        <div className="sm:hidden flex justify-center pt-3 pb-1 shrink-0">
          <div className="w-10 h-1 rounded-full bg-gray-300" />
        </div>

        {/* 헤더 */}
        <div className="flex items-start justify-between px-5 pt-3 pb-2 shrink-0">
          <span className={`text-[11px] font-semibold px-2.5 py-1 rounded-full border ${CATEGORY_LIGHT[event.category]}`}>
            {CATEGORY_LABEL[event.category]}
          </span>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full hover:bg-gray-100 text-gray-400 hover:text-gray-600 ml-2 shrink-0 transition-colors"
          >
            <X size={18} />
          </button>
        </div>

        {/* 스크롤 내용 */}
        <div className="overflow-y-auto px-5 pb-6 flex-1">

          <h2 className="text-xl font-black text-gray-900 leading-tight mb-3">
            {event.title}
          </h2>

          {(visitorsLabel || priceRec) && (
            <div className="flex flex-wrap gap-2 mb-4">
              {visitorsLabel && (
                <span className="flex items-center gap-1.5 text-sm font-semibold bg-indigo-50 text-indigo-700 px-3 py-1.5 rounded-xl border border-indigo-100">
                  <Users size={13} /> 일 최대 {visitorsLabel}
                </span>
              )}
              {priceRec && (
                <span className="flex items-center gap-1.5 text-sm font-bold bg-emerald-50 text-emerald-700 px-3 py-1.5 rounded-xl border border-emerald-100">
                  <TrendingUp size={13} /> {priceRec}
                </span>
              )}
            </div>
          )}

          <div className="space-y-2 mb-4">
            <div className="flex items-center gap-2.5 text-sm text-gray-700">
              <Calendar size={14} className="shrink-0 text-indigo-500" />
              <span className="font-medium">
                {format(start, 'yyyy년 M월 d일 (EEE)', { locale: ko })}
                {!isSameDay && ` ~ ${format(end, 'M월 d일 (EEE)', { locale: ko })}`}
              </span>
            </div>
            <div className="flex items-center gap-2.5 text-sm text-gray-700">
              <MapPin size={14} className="shrink-0 text-red-500" />
              <span>
                <span className="font-medium">{event.venue}</span>
                <span className="ml-1.5 text-xs text-gray-400">({locationLabel})</span>
              </span>
            </div>
          </div>

          {event.description && (
            <p className="text-sm text-gray-600 bg-gray-50 rounded-xl p-3.5 leading-relaxed mb-4">
              {event.description}
            </p>
          )}

          <div className="bg-indigo-50 border border-indigo-100 rounded-xl p-3.5 mb-4">
            <p className="text-xs font-bold text-indigo-700 mb-1">💡 단가 조정 팁</p>
            <p className="text-sm text-indigo-700 leading-relaxed">
              {event.expected_visitors && event.expected_visitors >= 100000
                ? '초대형 행사. 2~3개월 전부터 미리 올려두세요.'
                : event.expected_visitors && event.expected_visitors >= 50000
                ? '중대형 행사. 1~2개월 전 조정을 추천해요.'
                : '주변 숙박 수요가 증가할 수 있습니다.'}
            </p>
            {priceRec && (
              <p className="mt-1.5 text-sm font-bold text-indigo-800">
                👉 추천 인상률: <span className="text-emerald-700">{priceRec}</span>
              </p>
            )}
          </div>

          <EventVoting eventId={event.id} />

          <div className="flex gap-2 mt-5">
            {event.source_url && (
              <a
                href={event.source_url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 flex items-center justify-center gap-1.5 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-semibold py-3 rounded-xl transition-colors"
              >
                <ExternalLink size={14} />
                예매 / 공식 사이트
              </a>
            )}
            <Link
              href={eventHref(event)}
              className="flex items-center justify-center gap-1 text-sm font-medium text-gray-500 hover:text-indigo-600 border border-gray-200 hover:border-indigo-300 px-4 py-3 rounded-xl transition-colors whitespace-nowrap"
            >
              상세페이지 <ArrowUpRight size={13} />
            </Link>
          </div>

        </div>
      </div>
    </div>
  );
}
