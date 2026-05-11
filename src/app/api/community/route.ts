import { NextRequest, NextResponse } from 'next/server';
import { isSupabaseConfigured, fetchPosts, createPost } from '@/lib/supabase';

const SAMPLE_POSTS = [
  { id: '1', nickname: '잠실호스트', location: '서울 잠실', content: '이번 BTS 공연 때 단가 3배 올렸는데 전부 예약됐어요 ㅎㅎ', likes: 24, created_at: '2025-11-01T10:00:00Z' },
  { id: '2', nickname: '여의도민박', location: '서울 여의도', content: '불꽃축제 2달 전부터 올렸더니 효과 있었습니다. 미리미리!', likes: 18, created_at: '2025-10-15T09:30:00Z' },
  { id: '3', nickname: '해운대스테이', location: '부산 해운대', content: 'BIFF 기간에 가격 2배로 올렸는데 의외로 잘 됐어요', likes: 12, created_at: '2025-10-10T14:20:00Z' },
  { id: '4', nickname: '고척숙소', location: '서울 고척', content: '콘서트 끝나고 나서 단가 올리면 늦어요... 미리 올리세요!', likes: 31, created_at: '2025-09-20T11:00:00Z' },
  { id: '5', nickname: '송도게스트', location: '인천 송도', content: '펜타포트 락 페스 때 인천도 수요 엄청 올라요. 의외!', likes: 9, created_at: '2025-08-05T16:45:00Z' },
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
