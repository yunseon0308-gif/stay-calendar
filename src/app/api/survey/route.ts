import { NextRequest, NextResponse } from 'next/server';
import { SAMPLE_EVENTS } from '@/lib/sampleEvents';

type SurveyEntry = {
  eventId: string;
  priceRange: string;
  occupancy: string;
  createdAt: string;
};

// In-memory store (resets on cold start — migrate to Supabase later)
const store: Record<string, SurveyEntry[]> = {};

// 제일 가까운 다가오는 행사 1개에만 시드 데이터 적용
const _today = new Date();
_today.setHours(0, 0, 0, 0);
const SEED_EVENT_ID = SAMPLE_EVENTS
  .filter(e => new Date(e.date_start) >= _today)
  .sort((a, b) => a.date_start.localeCompare(b.date_start))[0]?.id ?? '';

const SEED: { priceRange: string; occupancy: string }[] = [
  { priceRange: '1.5-2',    occupancy: '2m' },
  { priceRange: '2-3',      occupancy: '3m' },
  { priceRange: '1.5-2',    occupancy: '1m' },
  { priceRange: '1.2-1.5',  occupancy: '1m' },
  { priceRange: '2-3',      occupancy: '2m' },
  { priceRange: '1.5-2',    occupancy: '2w' },
  { priceRange: '3-5',      occupancy: '3m' },
  { priceRange: '1.2-1.5',  occupancy: '2m' },
  { priceRange: 'under1.2', occupancy: '1w' },
  { priceRange: '2-3',      occupancy: '2m' },
];

function seedFor(eventId: string): SurveyEntry[] {
  return SEED.map((d, i) => ({
    eventId,
    ...d,
    createdAt: new Date(Date.now() - (SEED.length - i) * 86400000).toISOString(),
  }));
}

function getStore(eventId: string): SurveyEntry[] {
  if (!store[eventId]) {
    // 가장 가까운 행사 1개에만 시드 적용, 나머지는 빈 배열
    store[eventId] = eventId === SEED_EVENT_ID ? seedFor(eventId) : [];
  }
  return store[eventId];
}

function buildStats(entries: SurveyEntry[]) {
  const priceCount: Record<string, number>    = {};
  const occupancyCount: Record<string, number> = {};
  for (const e of entries) {
    priceCount[e.priceRange]    = (priceCount[e.priceRange] || 0) + 1;
    occupancyCount[e.occupancy] = (occupancyCount[e.occupancy] || 0) + 1;
  }
  return { total: entries.length, priceCount, occupancyCount };
}

export async function GET(req: NextRequest) {
  // 다수 이벤트 일괄 조회: ?eventIds=id1,id2,...
  const eventIds = req.nextUrl.searchParams.get('eventIds');
  if (eventIds) {
    const ids = eventIds.split(',').filter(Boolean);
    const result: Record<string, ReturnType<typeof buildStats>> = {};
    for (const id of ids) result[id] = buildStats(getStore(id));
    return NextResponse.json(result);
  }

  // 단일 이벤트 조회
  const eventId = req.nextUrl.searchParams.get('eventId');
  if (!eventId) return NextResponse.json({ error: 'eventId required' }, { status: 400 });
  return NextResponse.json(buildStats(getStore(eventId)));
}

export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => ({}));
  const { eventId, priceRange, occupancy } = body;
  if (!eventId || !priceRange)
    return NextResponse.json({ error: 'Missing fields' }, { status: 400 });

  getStore(eventId).push({ eventId, priceRange, occupancy: occupancy ?? 'unknown', createdAt: new Date().toISOString() });
  return NextResponse.json({ ok: true });
}
