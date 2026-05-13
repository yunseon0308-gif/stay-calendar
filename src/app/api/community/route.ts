import { NextRequest, NextResponse } from 'next/server';
import { isSupabaseConfigured, fetchPosts, createPost, likePost } from '@/lib/supabase';

const SAMPLE_POSTS = [
  { id: '1', nickname: '잠실호스트', location: '서울 잠실', content: '이번 BTS 공연 때 단가 3배 올렸는데 전부 예약됐어요 ㅎㅎ', likes: 24, created_at: '2025-11-01T10:00:00Z', is_sample: true },
];

export async function GET() {
  if (!isSupabaseConfigured) {
    return NextResponse.json({ posts: SAMPLE_POSTS });
  }

  const posts = await fetchPosts();
  if (posts.length === 0) {
    return NextResponse.json({ posts: SAMPLE_POSTS });
  }
  return NextResponse.json({ posts });
}

export async function POST(req: NextRequest) {
  const { nickname, location, content } = await req.json();

  if (!nickname || !content) {
    return NextResponse.json({ error: '닉네임과 내용을 입력해주세요.' }, { status: 400 });
  }

  if (!isSupabaseConfigured) {
    const newPost = {
      id: String(Date.now()),
      nickname,
      location: location || '',
      content,
      likes: 0,
      created_at: new Date().toISOString(),
    };
    return NextResponse.json({ post: newPost });
  }

  const post = await createPost(nickname, location || '', content);
  if (!post) {
    return NextResponse.json({ error: '게시글 작성에 실패했습니다.' }, { status: 500 });
  }
  return NextResponse.json({ post });
}

export async function PATCH(req: NextRequest) {
  const { postId } = await req.json();
  if (!postId) return NextResponse.json({ error: 'postId required' }, { status: 400 });

  if (!isSupabaseConfigured) {
    return NextResponse.json({ likes: 1 });
  }

  const newLikes = await likePost(postId);
  if (newLikes === null) {
    return NextResponse.json({ error: '좋아요 처리 실패' }, { status: 500 });
  }
  return NextResponse.json({ likes: newLikes });
}
