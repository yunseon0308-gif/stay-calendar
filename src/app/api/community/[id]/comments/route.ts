import { NextRequest, NextResponse } from 'next/server';
import { isSupabaseConfigured, fetchComments, createComment } from '@/lib/supabase';

export async function GET(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  if (!isSupabaseConfigured) {
    return NextResponse.json({ comments: [] });
  }
  const comments = await fetchComments(id);
  return NextResponse.json({ comments });
}

export async function POST(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const { nickname, content } = await req.json();

  if (!nickname?.trim() || !content?.trim()) {
    return NextResponse.json({ error: '닉네임과 내용을 입력해주세요.' }, { status: 400 });
  }
  if (content.length > 200) {
    return NextResponse.json({ error: '댓글은 200자 이내로 입력해주세요.' }, { status: 400 });
  }

  if (!isSupabaseConfigured) {
    const comment = {
      id: String(Date.now()),
      post_id: id,
      nickname,
      content,
      created_at: new Date().toISOString(),
    };
    return NextResponse.json({ comment });
  }

  const comment = await createComment(id, nickname.trim(), content.trim());
  if (!comment) {
    return NextResponse.json({ error: '댓글 작성에 실패했습니다.' }, { status: 500 });
  }
  return NextResponse.json({ comment });
}
