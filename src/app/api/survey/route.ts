import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

function buildStats(rows: { price_range: string; occupancy: string }[]) {
  const priceCount: Record<string, number>    = {};
  const occupancyCount: Record<string, number> = {};
  for (const r of rows) {
    priceCount[r.price_range]   = (priceCount[r.price_range] || 0) + 1;
    occupancyCount[r.occupancy] = (occupancyCount[r.occupancy] || 0) + 1;
  }
  return { total: rows.length, priceCount, occupancyCount };
}

export async function GET(req: NextRequest) {
  if (!supabase) return NextResponse.json({ error: 'DB not configured' }, { status: 503 });

  // 다수 이벤트 일괄 조회: ?eventIds=id1,id2,...
  const eventIds = req.nextUrl.searchParams.get('eventIds');
  if (eventIds) {
    const ids = eventIds.split(',').filter(Boolean);
    const { data } = await supabase
      .from('survey_responses')
      .select('event_id, price_range, occupancy')
      .in('event_id', ids);

    const result: Record<string, ReturnType<typeof buildStats>> = {};
    for (const id of ids) {
      result[id] = buildStats((data || []).filter(r => r.event_id === id));
    }
    return NextResponse.json(result);
  }

  // 단일 이벤트 조회: ?eventId=xxx
  const eventId = req.nextUrl.searchParams.get('eventId');
  if (!eventId) return NextResponse.json({ error: 'eventId required' }, { status: 400 });

  const { data } = await supabase
    .from('survey_responses')
    .select('price_range, occupancy')
    .eq('event_id', eventId);

  return NextResponse.json(buildStats(data || []));
}

export async function POST(req: NextRequest) {
  if (!supabase) return NextResponse.json({ error: 'DB not configured' }, { status: 503 });

  const body = await req.json().catch(() => ({}));
  const { eventId, priceRange, occupancy } = body;
  if (!eventId || !priceRange)
    return NextResponse.json({ error: 'Missing fields' }, { status: 400 });

  await supabase.from('survey_responses').insert([{
    event_id:   eventId,
    price_range: priceRange,
    occupancy:  occupancy ?? 'unknown',
  }]);

  return NextResponse.json({ ok: true });
}
