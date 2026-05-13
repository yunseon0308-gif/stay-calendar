import { NextResponse } from 'next/server';
import { isSupabaseConfigured, fetchSubscribers } from '@/lib/supabase';

const SAMPLE_SUBSCRIBERS = [
  {
    id: '1',
    email: 'sample@kakao.com',
    location: '서울',
    district: '잠실',
    created_at: '2026-04-20T09:15:00Z',
  },
];

export async function GET() {
  if (!isSupabaseConfigured) {
    return NextResponse.json({ subscribers: SAMPLE_SUBSCRIBERS });
  }

  const subscribers = await fetchSubscribers();
  if (subscribers.length === 0) {
    return NextResponse.json({ subscribers: SAMPLE_SUBSCRIBERS });
  }
  return NextResponse.json({ subscribers });
}
