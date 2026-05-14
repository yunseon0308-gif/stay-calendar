import { NextRequest, NextResponse } from 'next/server';

type SurveyEntry = {
  eventId: string;
  priceRange: string;
  occupancy: string;
  createdAt: string;
};

// In-memory store (resets on cold start — migrate to Supabase later)
const store: Record<string, SurveyEntry[]> = {};

// 시드 데이터: 페이지가 처음 열릴 때 사실적인 샘플 통계 제공
const SEED: { priceRange: string; occupancy: string }[] = [
  { priceRange: '1.5-2',    occupancy: 'full' },
  { priceRange: '2-3',      occupancy: 'full' },
  { priceRange: '1.5-2',    occupancy: 'high' },
  { priceRange: '1.2-1.5',  occupancy: 'high' },
  { priceRange: '2-3',      occupancy: 'increased' },
  { priceRange: '1.5-2',    occupancy: 'full' },
  { priceRange: '3-5',      occupancy: 'full' },
  { priceRange: '1.2-1.5',  occupancy: 'high' },
  { priceRange: 'under1.2', occupancy: 'normal' },
  { priceRange: '2-3',      occupancy: 'full' },
];

function seedFor(eventId: string): SurveyEntry[] {
  return SEED.map((d, i) => ({
    eventId,
    ...d,
    createdAt: new Date(Date.now() - (SEED.length - i) * 86400000).toISOString(),
  }));
}

function getStore(eventId: string): SurveyEntry[] {
  if (!store[eventId]) store[eventId] = seedFor(eventId);
  return store[eventId];
}

export async function GET(req: NextRequest) {
  const eventId = req.nextUrl.searchParams.get('eventId');
  if (!eventId) return NextResponse.json({ error: 'eventId required' }, { status: 400 });

  const entries = getStore(eventId);
  const priceCount: Record<string, number>     = {};
  const occupancyCount: Record<string, number> = {};

  for (const e of entries) {
    priceCount[e.priceRange]     = (priceCount[e.priceRange] || 0) + 1;
    occupancyCount[e.occupancy]  = (occupancyCount[e.occupancy] || 0) + 1;
  }

  return NextResponse.json({ total: entries.length, priceCount, occupancyCount });
}

export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => ({}));
  const { eventId, priceRange, occupancy } = body;
  if (!eventId || !priceRange)
    return NextResponse.json({ error: 'Missing fields' }, { status: 400 });

  getStore(eventId).push({ eventId, priceRange, occupancy: occupancy ?? 'unknown', createdAt: new Date().toISOString() });
  return NextResponse.json({ ok: true });
}
