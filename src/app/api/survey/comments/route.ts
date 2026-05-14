import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function GET(req: NextRequest) {
  if (!supabase) return NextResponse.json({ comments: [] });

  const eventId = req.nextUrl.searchParams.get('eventId');
  if (!eventId) return NextResponse.json({ error: 'eventId required' }, { status: 400 });

  const { data, error } = await supabase
    .from('survey_comments')
    .select('*')
    .eq('event_id', eventId)
    .order('created_at', { ascending: true });

  if (error) return NextResponse.json({ comments: [] });

  const comments = (data || []).map(c => ({
    id:        c.id,
    eventId:   c.event_id,
    author:    c.author,
    content:   c.content,
    createdAt: c.created_at,
    isSample:  c.is_sample,
  }));

  return NextResponse.json({ comments });
}

export async function POST(req: NextRequest) {
  if (!supabase) return NextResponse.json({ error: 'DB not configured' }, { status: 503 });

  const body = await req.json().catch(() => ({}));
  const { eventId, author, content } = body;
  if (!eventId || !content?.trim())
    return NextResponse.json({ error: 'Missing fields' }, { status: 400 });

  const { data, error } = await supabase
    .from('survey_comments')
    .insert([{
      event_id: eventId,
      author:   author?.trim() || '익명 운영자',
      content:  content.trim(),
    }])
    .select()
    .single();

  if (error) return NextResponse.json({ error: 'Insert failed' }, { status: 500 });

  return NextResponse.json({
    comment: {
      id:        data.id,
      eventId:   data.event_id,
      author:    data.author,
      content:   data.content,
      createdAt: data.created_at,
      isSample:  false,
    },
  });
}

export async function DELETE(req: NextRequest) {
  if (!supabase) return NextResponse.json({ error: 'DB not configured' }, { status: 503 });

  const { commentId } = await req.json().catch(() => ({}));
  if (!commentId)
    return NextResponse.json({ error: 'Missing fields' }, { status: 400 });

  // 샘플 댓글은 삭제 불가
  const { error } = await supabase
    .from('survey_comments')
    .delete()
    .eq('id', commentId)
    .eq('is_sample', false);

  if (error) return NextResponse.json({ error: 'Delete failed' }, { status: 500 });

  return NextResponse.json({ ok: true });
}
