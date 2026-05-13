import { notFound } from 'next/navigation';
import { getEventBySlug } from '@/lib/events';
import EventModal from '@/components/EventModal';

export default async function InterceptedEventModal({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const event = getEventBySlug(slug);
  if (!event) notFound();

  return <EventModal event={event} />;
}
