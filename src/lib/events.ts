import { Event } from '@/types/event';
import { SAMPLE_EVENTS } from './sampleEvents';
import { parseISO, differenceInDays } from 'date-fns';

/** slug로 이벤트 단일 조회 */
export function getEventBySlug(slug: string): Event | undefined {
  return SAMPLE_EVENTS.find((e) => e.slug === slug);
}

/** generateStaticParams용 slug 목록 */
export function getAllEventSlugs(): string[] {
  return SAMPLE_EVENTS.filter((e) => e.slug).map((e) => e.slug!);
}

/**
 * 연관 행사 반환 (같은 카테고리 > 같은 지역 > 날짜 근접 순)
 */
export function getRelatedEvents(event: Event, limit = 4): Event[] {
  const pivot = parseISO(event.date_start);

  return SAMPLE_EVENTS.filter((e) => e.id !== event.id && e.slug)
    .map((e) => {
      const score =
        (e.category === event.category ? 3 : 0) +
        (e.location === event.location ? 2 : 0) +
        (Math.abs(differenceInDays(parseISO(e.date_start), pivot)) <= 45 ? 1 : 0);
      return { e, score };
    })
    .sort((a, b) => b.score - a.score || a.e.date_start.localeCompare(b.e.date_start))
    .slice(0, limit)
    .map(({ e }) => e);
}

/** slug 없을 때 fallback 경로 */
export function eventHref(event: Event): string {
  return event.slug ? `/event/${event.slug}` : `/event/${event.id}`;
}
