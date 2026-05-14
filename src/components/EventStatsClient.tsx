'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { formatDistanceToNow } from 'date-fns';
import { ko } from 'date-fns/locale';

const PRICE_LABELS: Record<string, string> = {
  'under1.2': '1.2배 미만',
  '1.2-1.5':  '1.2~1.5배',
  '1.5-2':    '1.5~2배',
  '2-3':      '2~3배',
  '3-5':      '3~5배',
  'over5':    '5배 이상',
};

const OCCUPANCY_LABELS: Record<string, string> = {
  'super-fast': '2주 내 만실',
  'fast':       '한 달 전 만실',
  'normal':     '보통 속도',
  'slow':       '늦게 찼음',
  'no-effect':  '별 차이 없음',
  // 구버전 호환
  'full':       '거의 만실',
  'high':       '예약 많음',
  'increased':  '평소보다 증가',
  'low':        '영향 적음',
  'unknown':    '-',
};

const PRICE_ORDER     = ['under1.2','1.2-1.5','1.5-2','2-3','3-5','over5'];
const OCCUPANCY_ORDER = ['super-fast','fast','normal','slow','no-effect'];

type Stats = {
  total: number;
  priceCount: Record<string, number>;
  occupancyCount: Record<string, number>;
};
type Comment = { id: string; author: string; content: string; createdAt: string };

interface Props { eventId: string; eventSlug: string; }

export default function EventStatsClient({ eventId, eventSlug }: Props) {
  const [stats, setStats]       = useState<Stats | null>(null);
  const [comments, setComments] = useState<Comment[]>([]);
  const [author, setAuthor]     = useState('');
  const [content, setContent]   = useState('');
  const [submitting, setSubmit] = useState(false);

  useEffect(() => {
    fetch(`/api/survey?eventId=${eventId}`)
      .then(r => r.json()).then(setStats).catch(() => {});
    fetch(`/api/survey/comments?eventId=${eventId}`)
      .then(r => r.json()).then(d => setComments(d.comments || [])).catch(() => {});
  }, [eventId]);

  const pct = (n: number, total: number) =>
    total > 0 ? Math.round((n / total) * 100) : 0;

  const topPrice     = stats && Object.entries(stats.priceCount).sort((a,b)=>b[1]-a[1])[0];
  const topOccupancy = stats && Object.entries(stats.occupancyCount).sort((a,b)=>b[1]-a[1])[0];

  const handleComment = async () => {
    if (!content.trim() || submitting) return;
    setSubmit(true);
    try {
      const res  = await fetch('/api/survey/comments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ eventId, author, content }),
      });
      const data = await res.json();
      if (data.comment) {
        setComments(prev => [...prev, data.comment]);
        setContent(''); setAuthor('');
      }
    } finally { setSubmit(false); }
  };

  return (
    <div className="space-y-5">

      {/* 요약 카드 */}
      {stats ? (
        <div className="bg-indigo-600 text-white rounded-2xl p-5">
          <p className="text-xs font-semibold text-indigo-200 mb-3">운영자 {stats.total}명 응답</p>
          <div className="flex gap-6 flex-wrap">
            {topPrice && (
              <div>
                <p className="text-[10px] text-indigo-300 uppercase tracking-wide">최다 단가 인상</p>
                <p className="text-xl font-black mt-0.5">{PRICE_LABELS[topPrice[0]]}</p>
              </div>
            )}
            {topOccupancy && (
              <div>
                <p className="text-[10px] text-indigo-300 uppercase tracking-wide">최다 예약 체감</p>
                <p className="text-xl font-black mt-0.5">{OCCUPANCY_LABELS[topOccupancy[0]]}</p>
              </div>
            )}
          </div>
        </div>
      ) : (
        <div className="h-24 bg-gray-100 rounded-2xl animate-pulse" />
      )}

      {/* 단가 인상률 분포 */}
      <div className="bg-white rounded-2xl border border-gray-100 p-5">
        <p className="text-sm font-bold text-gray-800 mb-4">💰 단가 인상률 분포</p>
        {stats ? (
          <div className="space-y-2.5">
            {PRICE_ORDER.map(key => {
              const count = stats.priceCount[key] || 0;
              const p     = pct(count, stats.total);
              const isTop = topPrice?.[0] === key;
              return (
                <div key={key} className="flex items-center gap-2">
                  <span className={`text-xs w-20 shrink-0 ${isTop ? 'font-bold text-indigo-700' : 'text-gray-500'}`}>
                    {PRICE_LABELS[key]}
                  </span>
                  <div className="flex-1 bg-gray-100 rounded-full h-2 overflow-hidden">
                    <div
                      className={`h-2 rounded-full transition-all duration-700 ${isTop ? 'bg-indigo-500' : 'bg-indigo-200'}`}
                      style={{ width: `${p}%` }}
                    />
                  </div>
                  <span className="text-xs text-gray-400 w-8 text-right">{p}%</span>
                </div>
              );
            })}
          </div>
        ) : <div className="h-32 bg-gray-50 rounded-xl animate-pulse" />}
      </div>

      {/* 예약률 체감 */}
      <div className="bg-white rounded-2xl border border-gray-100 p-5">
        <p className="text-sm font-bold text-gray-800 mb-4">⚡ 예약 속도</p>
        {stats ? (
          <div className="space-y-2.5">
            {OCCUPANCY_ORDER.map(key => {
              const count = stats.occupancyCount[key] || 0;
              const p     = pct(count, stats.total);
              const isTop = topOccupancy?.[0] === key;
              return (
                <div key={key} className="flex items-center gap-2">
                  <span className={`text-xs w-24 shrink-0 ${isTop ? 'font-bold text-indigo-700' : 'text-gray-500'}`}>
                    {OCCUPANCY_LABELS[key]}
                  </span>
                  <div className="flex-1 bg-gray-100 rounded-full h-2 overflow-hidden">
                    <div
                      className={`h-2 rounded-full transition-all duration-700 ${isTop ? 'bg-emerald-500' : 'bg-emerald-200'}`}
                      style={{ width: `${p}%` }}
                    />
                  </div>
                  <span className="text-xs text-gray-400 w-8 text-right">{p}%</span>
                </div>
              );
            })}
          </div>
        ) : <div className="h-28 bg-gray-50 rounded-xl animate-pulse" />}
      </div>

      {/* 아직 미등록 CTA */}
      <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4 flex items-center justify-between gap-4">
        <div>
          <p className="text-sm font-bold text-amber-800">아직 데이터를 등록하지 않으셨나요?</p>
          <p className="text-xs text-amber-600 mt-0.5">실전 경험을 공유하고 커뮤니티에 기여해보세요.</p>
        </div>
        <Link
          href={`/event/${eventSlug}`}
          className="text-xs font-semibold bg-amber-500 hover:bg-amber-600 text-white px-3 py-2 rounded-lg whitespace-nowrap transition-colors"
        >
          데이터 등록
        </Link>
      </div>

      {/* 댓글 */}
      <div className="bg-white rounded-2xl border border-gray-100 p-5">
        <p className="text-sm font-bold text-gray-800 mb-4">
          💬 운영자 이야기
          <span className="text-gray-400 font-normal text-xs ml-1.5">{comments.length}개</span>
        </p>

        <div className="space-y-4 mb-6">
          {comments.map(c => (
            <div key={c.id} className="border-b border-gray-50 pb-4 last:border-0 last:pb-0">
              <div className="flex items-center justify-between mb-1">
                <span className="text-xs font-semibold text-gray-700">{c.author}</span>
                <span className="text-[10px] text-gray-300">
                  {formatDistanceToNow(new Date(c.createdAt), { addSuffix: true, locale: ko })}
                </span>
              </div>
              <p className="text-sm text-gray-600 leading-relaxed">{c.content}</p>
            </div>
          ))}
        </div>

        {/* 댓글 입력 */}
        <div className="space-y-2 border-t border-gray-100 pt-4">
          <input
            type="text"
            placeholder="닉네임 (예: 서울 강남 운영자) · 선택"
            value={author}
            onChange={e => setAuthor(e.target.value)}
            className="w-full text-sm border border-gray-200 rounded-xl px-3 py-2.5 placeholder:text-gray-300 focus:outline-none focus:border-indigo-400 transition-colors"
          />
          <textarea
            placeholder="행사 운영 경험을 자유롭게 공유해주세요 (단가, 예약 시점, 고객층 등)"
            value={content}
            onChange={e => setContent(e.target.value)}
            rows={3}
            className="w-full text-sm border border-gray-200 rounded-xl px-3 py-2.5 placeholder:text-gray-300 focus:outline-none focus:border-indigo-400 transition-colors resize-none"
          />
          <button
            onClick={handleComment}
            disabled={!content.trim() || submitting}
            className="w-full text-sm font-semibold bg-indigo-600 hover:bg-indigo-700 text-white py-2.5 rounded-xl transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
          >
            {submitting ? '등록 중...' : '댓글 등록하기'}
          </button>
        </div>
      </div>

    </div>
  );
}
