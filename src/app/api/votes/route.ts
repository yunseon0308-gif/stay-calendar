import { NextRequest, NextResponse } from 'next/server';
import { isSupabaseConfigured, fetchVotes, createVote } from '@/lib/supabase';
import { VALID_VOTE_KEYS } from '@/lib/voteConfig';

// 샘플 투표 데이터 (과거 행사 1개 + 사이드바 확인용 1개)
const SAMPLE_VOTES: Record<string, Record<string, number>> = {
  'past1': { 'under1.5': 7, '1.5to2': 38, '2to3': 24, '3to5': 8, 'over5': 3 },
  '8':     { 'under1.5': 4, '1.5to2': 21, '2to3': 12, '3to5': 3, 'over5': 1 },
};

export async function GET(req: NextRequest) {
  const eventId  = req.nextUrl.searchParams.get('eventId');
  const eventIds = req.nextUrl.searchParams.get('eventIds'); // 쉼표 구분 bulk

  // ── Bulk 조회 ──────────────────────────────────────────────
  if (eventIds) {
    const ids = eventIds.split(',').filter(Boolean);
    const summaries: Record<string, { results: Record<string, number>; total: number }> = {};

    if (!isSupabaseConfigured) {
      for (const id of ids) {
        const data = SAMPLE_VOTES[id] || {};
        const total = Object.values(data).reduce((a, b) => a + b, 0);
        summaries[id] = { results: data, total };
      }
      return NextResponse.json({ summaries });
    }

    for (const id of ids) {
      summaries[id] = await fetchVotes(id);
    }
    return NextResponse.json({ summaries });
  }

  // ── 단일 조회 ──────────────────────────────────────────────
  if (!eventId) return NextResponse.json({ error: 'eventId required' }, { status: 400 });

  if (!isSupabaseConfigured) {
    const data  = SAMPLE_VOTES[eventId] || {};
    const total = Object.values(data).reduce((a, b) => a + b, 0);
    return NextResponse.json({ results: data, total });
  }

  const v = await fetchVotes(eventId);
  return NextResponse.json(v);
}

export async function POST(req: NextRequest) {
  const { eventId, range } = await req.json();

  if (!eventId || !VALID_VOTE_KEYS.includes(range)) {
    return NextResponse.json({ error: '잘못된 요청입니다.' }, { status: 400 });
  }

  if (!isSupabaseConfigured) {
    const base: Record<string, number>    = SAMPLE_VOTES[eventId] || {};
    const updated: Record<string, number> = { ...base, [range]: (base[range] || 0) + 1 };
    const total = (Object.values(updated) as number[]).reduce((a, b) => a + b, 0);
    return NextResponse.json({ success: true, results: updated, total });
  }

  const ok = await createVote(eventId, range);
  if (!ok) return NextResponse.json({ error: '투표 처리 실패' }, { status: 500 });

  const v = await fetchVotes(eventId);
  return NextResponse.json({ success: true, ...v });
}
