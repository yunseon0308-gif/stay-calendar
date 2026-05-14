import { NextRequest, NextResponse } from 'next/server';
import { SAMPLE_EVENTS } from '@/lib/sampleEvents';

type Comment = {
  id: string;
  eventId: string;
  author: string;
  content: string;
  createdAt: string;
  isSample?: boolean;
};

const store: Record<string, Comment[]> = {};

// 제일 가까운 다가오는 행사 1개에만 샘플 댓글 적용
const _today = new Date();
_today.setHours(0, 0, 0, 0);
const SEED_EVENT_ID = SAMPLE_EVENTS
  .filter(e => new Date(e.date_start) >= _today)
  .sort((a, b) => a.date_start.localeCompare(b.date_start))[0]?.id ?? '';

const SAMPLE_COMMENTS: Omit<Comment, 'eventId'>[] = [
  {
    id: 'sample-1',
    author: '서울 강남 에어비앤비',
    content: '작년 같은 행사 때 2.5배 올렸는데 하루만에 예약 다 찼어요. 올해는 3달 전부터 미리 올려뒀습니다!',
    createdAt: new Date(Date.now() - 3 * 86400000).toISOString(),
    isSample: true,
  },
  {
    id: 'sample-2',
    author: '잠실권 오피스텔 운영자',
    content: '일본 팬들이 많이 예약해서 2박 이상이 대부분이었어요. 픽업 서비스 끼워팔기도 반응이 좋았습니다.',
    createdAt: new Date(Date.now() - 2 * 86400000).toISOString(),
    isSample: true,
  },
  {
    id: 'sample-3',
    author: '인천 게스트하우스',
    content: '스테이달력 보고 미리 준비했어요. 주변 숙소보다 2주 일찍 단가 올려서 좋은 결과 봤습니다 👍',
    createdAt: new Date(Date.now() - 1 * 86400000).toISOString(),
    isSample: true,
  },
];

function getStore(eventId: string): Comment[] {
  if (!store[eventId]) {
    store[eventId] = eventId === SEED_EVENT_ID
      ? SAMPLE_COMMENTS.map(c => ({ ...c, eventId }))
      : [];
  }
  return store[eventId];
}

export async function GET(req: NextRequest) {
  const eventId = req.nextUrl.searchParams.get('eventId');
  if (!eventId) return NextResponse.json({ error: 'eventId required' }, { status: 400 });
  return NextResponse.json({ comments: getStore(eventId) });
}

export async function DELETE(req: NextRequest) {
  const { eventId, commentId } = await req.json().catch(() => ({}));
  if (!eventId || !commentId)
    return NextResponse.json({ error: 'Missing fields' }, { status: 400 });

  const list = store[eventId];
  if (!list) return NextResponse.json({ error: 'Not found' }, { status: 404 });

  const idx = list.findIndex(c => c.id === commentId);
  if (idx === -1) return NextResponse.json({ error: 'Not found' }, { status: 404 });

  list.splice(idx, 1);
  return NextResponse.json({ ok: true });
}

export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => ({}));
  const { eventId, author, content } = body;
  if (!eventId || !content?.trim())
    return NextResponse.json({ error: 'Missing fields' }, { status: 400 });

  const comment: Comment = {
    id: `c-${Date.now()}`,
    eventId,
    author: author?.trim() || '익명 운영자',
    content: content.trim(),
    createdAt: new Date().toISOString(),
  };
  getStore(eventId).push(comment);
  return NextResponse.json({ comment });
}
