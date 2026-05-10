import { NextResponse } from 'next/server';
import { fetchEvents, createEvent, isSupabaseConfigured } from '@/lib/supabase';
import { SAMPLE_EVENTS } from '@/lib/sampleEvents';

export async function GET() {
  if (!isSupabaseConfigured) {
    return NextResponse.json({ events: SAMPLE_EVENTS, source: 'sample' });
  }
  const events = await fetchEvents();
  const result = events.length > 0 ? events : SAMPLE_EVENTS;
  return NextResponse.json({ events: result, source: events.length > 0 ? 'supabase' : 'sample' });
}

export async function POST(req: Request) {
  const body = await req.json();
  const event = await createEvent(body);
  if (!event) return NextResponse.json({ error: 'Failed to create event' }, { status: 500 });
  return NextResponse.json({ event }, { status: 201 });
}
