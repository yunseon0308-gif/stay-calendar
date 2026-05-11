import { NextRequest, NextResponse } from 'next/server';
import { isSupabaseConfigured, saveSubscriber } from '@/lib/supabase';

export async function POST(req: NextRequest) {
  const { email, location, district } = await req.json();

  if (!email || !location) {
    return NextResponse.json({ error: '이메일과 지역을 입력해주세요.' }, { status: 400 });
  }

  if (!isSupabaseConfigured) {
    return NextResponse.json({ message: '구독 신청이 접수되었습니다.' });
  }

  const ok = await saveSubscriber(email, location, district || '');
  if (!ok) {
    return NextResponse.json({ error: '이미 등록된 이메일이거나 오류가 발생했습니다.' }, { status: 400 });
  }

  return NextResponse.json({ message: '구독 신청이 접수되었습니다.' });
}
