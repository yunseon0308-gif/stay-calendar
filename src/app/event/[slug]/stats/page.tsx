import { notFound } from 'next/navigation';
import Link from 'next/link';
import { format, parseISO } from 'date-fns';
import { ko } from 'date-fns/locale';
import { ChevronLeft } from 'lucide-react';
import { getEventBySlug } from '@/lib/events';
import { CATEGORY_LIGHT, CATEGORY_LABEL } from '@/types/event';
import EventStatsClient from '@/components/EventStatsClient';

// 통계·댓글은 실시간 데이터 → 서버사이드 렌더링
export const dynamic = 'force-dynamic';

export default async function EventStatsPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const event    = getEventBySlug(slug);
  if (!event) notFound();

  const start     = parseISO(event.date_start);
  const end       = parseISO(event.date_end);
  const isSameDay = event.date_start === event.date_end;

  return (
    <div className="min-h-screen bg-gray-50">

      {/* 헤더 */}
      <header className="bg-white border-b border-gray-100 sticky top-0 z-40 shadow-sm">
        <div className="max-w-2xl mx-auto px-4 py-4 flex items-center justify-between">
          <Link
            href="/"
            className="flex items-center gap-1 text-sm text-gray-500 hover:text-indigo-600 transition-colors group"
          >
            <ChevronLeft size={16} className="group-hover:-translate-x-0.5 transition-transform" />
            홈으로 돌아가기
          </Link>
          <Link href="/" className="text-lg font-black text-indigo-700">🏨 스테이달력</Link>
        </div>
      </header>

      <main className="max-w-2xl mx-auto px-4 py-8">

        {/* 행사 헤더 */}
        <div className="mb-6">
          <div className="flex items-center gap-2 mb-2">
            <span className={`text-[11px] font-semibold px-2.5 py-0.5 rounded-full border ${CATEGORY_LIGHT[event.category]}`}>
              {CATEGORY_LABEL[event.category]}
            </span>
            <span className="text-xs text-gray-400">
              {format(start, 'M월 d일', { locale: ko })}
              {!isSameDay && ` ~ ${format(end, 'M월 d일', { locale: ko })}`}
              {' · '}{event.location}
            </span>
          </div>
          <h1 className="text-xl font-black text-gray-900 leading-tight">{event.title}</h1>
          <p className="text-xs text-indigo-500 font-semibold mt-1">📊 운영자 실전 데이터</p>
        </div>

        {/* 통계 + 댓글 클라이언트 컴포넌트 */}
        <EventStatsClient eventId={event.id} eventSlug={slug} />

        {/* 달력 CTA */}
        <div className="mt-8 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-2xl p-5 text-white text-center">
          <p className="font-bold mb-1">📅 다른 행사도 확인해보세요</p>
          <p className="text-sm text-indigo-100 mb-3">공연·축제·스포츠 일정과 단가 인사이트를 한눈에.</p>
          <Link
            href="/"
            className="inline-block bg-white text-indigo-700 font-bold text-sm px-6 py-2.5 rounded-xl hover:bg-indigo-50 transition-colors"
          >
            전체 행사 캘린더 보기 →
          </Link>
        </div>

      </main>

      <footer className="mt-12 border-t border-gray-100 py-6 text-center text-xs text-gray-400">
        <p>© 2026 스테이달력 · 공유숙박업 단가관리 필수 플랫폼</p>
      </footer>
    </div>
  );
}
