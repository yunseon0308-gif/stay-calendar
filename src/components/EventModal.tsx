'use client';

import { Event, CATEGORY_LABEL, CATEGORY_LIGHT } from '@/types/event';
import { format, parseISO } from 'date-fns';
import { ko } from 'date-fns/locale';
import { X, MapPin, Calendar, Users, ExternalLink } from 'lucide-react';

interface Props {
  event: Event;
  onClose: () => void;
}

export default function EventModal({ event, onClose }: Props) {
  const start = parseISO(event.date_start);
  const end = parseISO(event.date_end);
  const isSameDay = event.date_start === event.date_end;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-6 relative"
        onClick={(e) => e.stopPropagation()}
      >
        {/* 닫기 */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-700"
        >
          <X size={20} />
        </button>

        {/* 카테고리 뱃지 */}
        <span
          className={`inline-block text-xs font-semibold px-3 py-1 rounded-full border ${CATEGORY_LIGHT[event.category]}`}
        >
          {CATEGORY_LABEL[event.category]}
        </span>

        {/* 제목 */}
        <h2 className="mt-3 text-xl font-bold text-gray-900 leading-tight">
          {event.title}
        </h2>

        {/* 정보 */}
        <div className="mt-4 space-y-3">
          <div className="flex items-start gap-3 text-sm text-gray-600">
            <Calendar size={16} className="mt-0.5 shrink-0 text-indigo-500" />
            <span>
              {format(start, 'yyyy년 M월 d일 (EEE)', { locale: ko })}
              {!isSameDay && (
                <> ~ {format(end, 'M월 d일 (EEE)', { locale: ko })}</>
              )}
            </span>
          </div>

          <div className="flex items-start gap-3 text-sm text-gray-600">
            <MapPin size={16} className="mt-0.5 shrink-0 text-red-500" />
            <span>
              {event.venue}
              <span className="ml-1 text-gray-400">({event.location})</span>
            </span>
          </div>

          {event.expected_visitors && (
            <div className="flex items-start gap-3 text-sm text-gray-600">
              <Users size={16} className="mt-0.5 shrink-0 text-green-500" />
              <span>예상 방문객: <strong>{event.expected_visitors.toLocaleString()}명</strong></span>
            </div>
          )}
        </div>

        {/* 설명 */}
        {event.description && (
          <p className="mt-4 text-sm text-gray-500 bg-gray-50 rounded-xl p-3">
            {event.description}
          </p>
        )}

        {/* 숙박업주 팁 */}
        <div className="mt-4 bg-indigo-50 border border-indigo-100 rounded-xl p-3">
          <p className="text-xs font-semibold text-indigo-700 mb-1">💡 숙박업주 팁</p>
          <p className="text-xs text-indigo-600">
            {event.expected_visitors && event.expected_visitors >= 100000
              ? '대규모 행사! 행사 2~3개월 전부터 단가를 미리 올려두세요.'
              : event.expected_visitors && event.expected_visitors >= 50000
              ? '중대형 행사입니다. 행사 1~2개월 전 단가 조정을 추천해요.'
              : '주변 숙박 수요가 증가할 수 있어요. 단가 조정을 확인하세요.'}
          </p>
        </div>

        {/* 링크 */}
        {event.source_url && (
          <a
            href={event.source_url}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-4 flex items-center gap-2 text-sm text-indigo-600 hover:underline"
          >
            <ExternalLink size={14} />
            공식 페이지 바로가기
          </a>
        )}
      </div>
    </div>
  );
}
