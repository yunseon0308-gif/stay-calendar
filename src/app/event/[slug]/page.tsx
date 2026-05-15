import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { format, parseISO } from 'date-fns';
import { ko } from 'date-fns/locale';
import { ChevronLeft, MapPin, Calendar, Users, TrendingUp, ExternalLink } from 'lucide-react';

import SiteHeader from '@/components/SiteHeader';
import { getEventBySlug, getAllEventSlugs, getRelatedEvents } from '@/lib/events';
import {
  CATEGORY_LABEL,
  CATEGORY_LIGHT,
  CATEGORY_COLOR,
  getPriceRecommendation,
} from '@/types/event';
import EventSurvey from '@/components/EventSurvey';

const SITE_URL = 'https://stay-calendar.vercel.app';

// ── SSG: 빌드 시 모든 slug 정적 생성 ────────────────────────
export async function generateStaticParams() {
  return getAllEventSlugs().map((slug) => ({ slug }));
}

// ── 동적 메타데이터 ──────────────────────────────────────────
export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const event = getEventBySlug(slug);
  if (!event) return {};

  const start   = parseISO(event.date_start);
  const end     = parseISO(event.date_end);
  const isSame  = event.date_start === event.date_end;
  const dateStr = isSame
    ? format(start, 'yyyy년 M월 d일', { locale: ko })
    : `${format(start, 'yyyy년 M월 d일', { locale: ko })} ~ ${format(end, 'M월 d일', { locale: ko })}`;

  const priceRec  = getPriceRecommendation(event.expected_visitors);
  const visitorsStr = event.expected_visitors
    ? event.expected_visitors >= 10000
      ? `${(event.expected_visitors / 10000).toFixed(0)}만명`
      : `${event.expected_visitors.toLocaleString()}명`
    : '';

  const description = [
    `${dateStr} · ${event.venue}`,
    visitorsStr && `예상 관람객 ${visitorsStr}`,
    priceRec && `숙박 ${priceRec}`,
    event.description,
  ]
    .filter(Boolean)
    .join(' · ');

  const canonicalUrl = `${SITE_URL}/event/${slug}`;

  return {
    title: `${event.title} | 스테이달력`,
    description,
    alternates: { canonical: canonicalUrl },
    openGraph: {
      title:       `${event.title} | 스테이달력`,
      description,
      url:         canonicalUrl,
      type:        'article',
      locale:      'ko_KR',
      siteName:    '스테이달력',
      images: [{ url: `${SITE_URL}/api/og`, width: 1200, height: 630, alt: event.title }],
    },
    twitter: {
      card:        'summary_large_image',
      title:       `${event.title} | 스테이달력`,
      description,
      images:      [`${SITE_URL}/api/og`],
    },
  };
}

// ── 페이지 컴포넌트 ──────────────────────────────────────────
export default async function EventPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const event    = getEventBySlug(slug);
  if (!event) notFound();

  const related   = getRelatedEvents(event, 4);
  const start     = parseISO(event.date_start);
  const end       = parseISO(event.date_end);
  const isSameDay = event.date_start === event.date_end;
  const priceRec  = getPriceRecommendation(event.expected_visitors);

  const locationLabel = event.district
    ? `${event.location} / ${event.district}`
    : event.location;

  const visitorsLabel = event.expected_visitors
    ? event.expected_visitors >= 10000
      ? `${(event.expected_visitors / 10000).toFixed(0)}만명`
      : `${event.expected_visitors.toLocaleString()}명`
    : null;

  // ── JSON-LD (schema.org Event) ─────────────────────────────
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Event',
    name: event.title,
    startDate: event.date_start,
    endDate:   event.date_end,
    location: {
      '@type': 'Place',
      name: event.venue,
      address: {
        '@type':           'PostalAddress',
        addressLocality:   event.district ?? event.location,
        addressRegion:     event.location,
        addressCountry:    'KR',
      },
    },
    description:         event.description ?? '',
    url:                 `${SITE_URL}/event/${slug}`,
    eventStatus:         'https://schema.org/EventScheduled',
    eventAttendanceMode: 'https://schema.org/OfflineEventAttendanceMode',
    ...(event.expected_visitors && {
      maximumAttendeeCapacity: event.expected_visitors,
    }),
    ...(event.source_url && { offers: { '@type': 'Offer', url: event.source_url } }),
    organizer: {
      '@type': 'Organization',
      name:    '스테이달력',
      url:     SITE_URL,
    },
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* JSON-LD */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      {/* 헤더 */}
      <SiteHeader />

      <main className="max-w-3xl mx-auto px-4 py-8">

        {/* 뒤로가기 */}
        <Link
          href="/"
          className="inline-flex items-center gap-1.5 text-sm text-gray-500 hover:text-indigo-600 mb-6 transition-colors group"
        >
          <ChevronLeft size={16} className="group-hover:-translate-x-0.5 transition-transform" />
          달력으로 돌아가기
        </Link>

        {/* 이벤트 카드 */}
        <article className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 md:p-8">

          {/* 카테고리 뱃지 */}
          <span className={`inline-block text-xs font-semibold px-3 py-1 rounded-full border ${CATEGORY_LIGHT[event.category]}`}>
            {CATEGORY_LABEL[event.category]}
          </span>

          {/* 제목 */}
          <h1 className="mt-3 text-2xl md:text-3xl font-black text-gray-900 leading-tight">
            {event.title}
          </h1>

          {/* 핵심 지표 배지 row */}
          {(visitorsLabel || priceRec) && (
            <div className="flex flex-wrap gap-2 mt-4">
              {visitorsLabel && (
                <span className="flex items-center gap-1.5 text-sm font-semibold bg-indigo-50 text-indigo-700 px-3 py-1.5 rounded-xl border border-indigo-100">
                  <Users size={14} />
                  일 최대 {visitorsLabel}
                </span>
              )}
              {priceRec && (
                <span className="flex items-center gap-1.5 text-sm font-bold bg-emerald-50 text-emerald-700 px-3 py-1.5 rounded-xl border border-emerald-100">
                  <TrendingUp size={14} />
                  {priceRec}
                </span>
              )}
            </div>
          )}

          {/* 상세 정보 */}
          <div className="mt-6 space-y-3 border-t border-gray-50 pt-5">
            <div className="flex items-start gap-3 text-sm text-gray-700">
              <Calendar size={16} className="mt-0.5 shrink-0 text-indigo-500" />
              <div>
                <span className="font-medium">
                  {format(start, 'yyyy년 M월 d일 (EEE)', { locale: ko })}
                </span>
                {!isSameDay && (
                  <span className="font-medium">
                    {' '}~ {format(end, 'M월 d일 (EEE)', { locale: ko })}
                  </span>
                )}
              </div>
            </div>

            <div className="flex items-start gap-3 text-sm text-gray-700">
              <MapPin size={16} className="mt-0.5 shrink-0 text-red-500" />
              <div>
                <span className="font-medium">{event.venue}</span>
                <span className="ml-2 text-gray-400 text-xs">({locationLabel})</span>
              </div>
            </div>

            {event.expected_visitors && (
              <div className="flex items-start gap-3 text-sm text-gray-700">
                <Users size={16} className="mt-0.5 shrink-0 text-green-500" />
                <span>
                  일 최대 동시관람객:{' '}
                  <strong className="text-gray-900">{visitorsLabel}</strong>
                </span>
              </div>
            )}
          </div>

          {/* 설명 */}
          {event.description && (
            <p className="mt-5 text-sm text-gray-600 bg-gray-50 rounded-xl p-4 leading-relaxed whitespace-pre-line">
              {event.description}
            </p>
          )}

          {/* 숙박업주 팁 */}
          <div className="mt-5 bg-indigo-50 border border-indigo-100 rounded-xl p-4">
            <p className="text-xs font-bold text-indigo-700 mb-1.5">💡 숙박업주 단가 조정 팁</p>
            <p className="text-sm text-indigo-700 leading-relaxed">
              {event.expected_visitors && event.expected_visitors >= 100000
                ? '초대형 행사입니다. 행사 2~3개월 전부터 단가를 미리 올려두세요. 주변 숙박시설이 빠르게 소진됩니다.'
                : event.expected_visitors && event.expected_visitors >= 50000
                ? '중대형 행사입니다. 행사 1~2개월 전 단가 조정을 추천해요. 해외 팬 수요도 고려하세요.'
                : '주변 숙박 수요가 증가할 수 있습니다. 행사 전후 날짜의 단가도 함께 확인하세요.'}
            </p>
            {priceRec && (
              <p className="mt-2 text-sm font-bold text-indigo-800">
                👉 추천 인상률: <span className="text-emerald-700">{priceRec}</span>
              </p>
            )}
          </div>

          {/* 운영자 실전 데이터 등록 */}
          <div className="mt-6">
            <EventSurvey eventId={event.id} eventSlug={event.slug ?? event.id} />
          </div>

          {/* 외부 링크 */}
          <div className="mt-6 flex gap-2">
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
            <a
              href={`https://search.naver.com/search.naver?query=${encodeURIComponent(event.title)}`}
              target="_blank"
              rel="noopener noreferrer"
              className={`flex items-center justify-center gap-1.5 text-sm font-semibold py-3 rounded-xl border transition-colors ${
                event.source_url
                  ? 'px-4 border-gray-200 text-gray-600 hover:bg-gray-50'
                  : 'flex-1 border-indigo-200 text-indigo-600 hover:bg-indigo-50'
              }`}
            >
              <ExternalLink size={14} />
              {event.source_url ? '검색' : '네이버에서 검색'}
            </a>
          </div>
        </article>

        {/* 연관 행사 (내부 링킹) */}
        {related.length > 0 && (
          <section className="mt-8" aria-label="연관 행사">
            <h2 className="text-base font-bold text-gray-700 mb-3">🔗 연관 행사</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {related.map((rel) => {
                const relStart   = parseISO(rel.date_start);
                const relPriceRec = getPriceRecommendation(rel.expected_visitors);
                return (
                  <Link
                    key={rel.id}
                    href={`/event/${rel.slug}`}
                    className="bg-white rounded-xl border border-gray-100 p-4 hover:shadow-md hover:border-indigo-200 transition-all flex items-start gap-3"
                  >
                    <div
                      className={`w-1.5 rounded-full shrink-0 mt-1 ${CATEGORY_COLOR[rel.category]}`}
                      style={{ minHeight: '40px' }}
                    />
                    <div className="min-w-0">
                      <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full border ${CATEGORY_LIGHT[rel.category]}`}>
                        {CATEGORY_LABEL[rel.category]}
                      </span>
                      <p className="text-sm font-semibold text-gray-800 mt-1 truncate">{rel.title}</p>
                      <p className="text-xs text-gray-400 mt-0.5">
                        {format(relStart, 'M월 d일 (EEE)', { locale: ko })} · {rel.location}
                      </p>
                      {relPriceRec && (
                        <p className="text-xs font-semibold text-emerald-600 mt-0.5">{relPriceRec}</p>
                      )}
                    </div>
                  </Link>
                );
              })}
            </div>
          </section>
        )}

        {/* 달력 CTA */}
        <div className="mt-8 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-2xl p-5 text-white text-center">
          <p className="font-bold mb-1">📅 다른 행사 일정도 확인하세요</p>
          <p className="text-sm text-indigo-100 mb-3">공연·축제·불꽃놀이 일정을 한눈에 파악하고 단가를 최적화하세요.</p>
          <Link
            href="/"
            className="inline-block bg-white text-indigo-700 font-bold text-sm px-6 py-2.5 rounded-xl hover:bg-indigo-50 transition-colors"
          >
            전체 행사 캘린더 보기 →
          </Link>
        </div>
      </main>

      {/* 푸터 */}
      <footer className="mt-12 border-t border-gray-100 py-6 text-center text-xs text-gray-400">
        <p>© 2026 스테이달력 · 공유숙박업 단가관리 필수 플랫폼</p>
        <p className="mt-1">문의: <a href="mailto:cinemomo@naver.com" className="hover:text-indigo-500">cinemomo@naver.com</a></p>
        <p className="mt-1">
          <Link href="/privacy" className="hover:text-indigo-500 underline">개인정보처리방침</Link>
        </p>
      </footer>
    </div>
  );
}
