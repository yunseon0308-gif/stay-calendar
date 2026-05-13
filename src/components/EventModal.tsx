'use client';

import { useState, useEffect } from 'react';
import { Event, CATEGORY_LABEL, CATEGORY_LIGHT } from '@/types/event';
import { format, parseISO } from 'date-fns';
import { ko } from 'date-fns/locale';
import { X, MapPin, Calendar, Users, ExternalLink } from 'lucide-react';
import { VOTE_RANGES } from '@/lib/voteConfig';

interface Props {
  event: Event;
  onClose: () => void;
}

export default function EventModal({ event, onClose }: Props) {
  const start = parseISO(event.date_start);
  const end = parseISO(event.date_end);
  const isSameDay = event.date_start === event.date_end;

  // ── 투표 상태 ──────────────────────────────────────────────
  const [voteResults, setVoteResults] = useState<Record<string, number>>({});
  const [voteTotal, setVoteTotal]     = useState(0);
  const [myVote, setMyVote]           = useState<string | null>(null);
  const [voting, setVoting]           = useState(false);
  const [showResults, setShowResults] = useState(false);

  useEffect(() => {
    // localStorage에서 이전 투표 확인
    const stored = typeof window !== 'undefined'
      ? localStorage.getItem(`vote_${event.id}`)
      : null;
    if (stored) setMyVote(stored);

    // 투표 결과 불러오기
    fetch(`/api/votes?eventId=${event.id}`)
      .then(r => r.json())
      .then(data => {
        setVoteResults(data.results || {});
        setVoteTotal(data.total || 0);
      })
      .catch(() => {});
  }, [event.id]);

  const handleVote = async (range: string) => {
    if (myVote || voting) return;
    setVoting(true);
    try {
      const res = await fetch('/api/votes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ eventId: event.id, range }),
      });
      const data = await res.json();
      if (res.ok) {
        setMyVote(range);
        localStorage.setItem(`vote_${event.id}`, range);
        setVoteResults(data.results || {});
        setVoteTotal(data.total || 0);
      }
    } finally {
      setVoting(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-6 relative max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* 닫기 */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-700"
        >
          <X size={20} />
        </button>

        {/* 카테고리 뱃지 */}
        <span className={`inline-block text-xs font-semibold px-3 py-1 rounded-full border ${CATEGORY_LIGHT[event.category]}`}>
          {CATEGORY_LABEL[event.category]}
        </span>

        {/* 제목 */}
        <h2 className="mt-3 text-xl font-bold text-gray-900 leading-tight">{event.title}</h2>

        {/* 정보 */}
        <div className="mt-4 space-y-3">
          <div className="flex items-start gap-3 text-sm text-gray-600">
            <Calendar size={16} className="mt-0.5 shrink-0 text-indigo-500" />
            <span>
              {format(start, 'yyyy년 M월 d일 (EEE)', { locale: ko })}
              {!isSameDay && <> ~ {format(end, 'M월 d일 (EEE)', { locale: ko })}</>}
            </span>
          </div>
          <div className="flex items-start gap-3 text-sm text-gray-600">
            <MapPin size={16} className="mt-0.5 shrink-0 text-red-500" />
            <span>
              {event.venue}
              <span className="ml-1 text-gray-400">
                ({event.district ? `${event.location} / ${event.district}` : event.location})
              </span>
            </span>
          </div>
          {event.expected_visitors && (
            <div className="flex items-start gap-3 text-sm text-gray-600">
              <Users size={16} className="mt-0.5 shrink-0 text-green-500" />
              <span>일 최대 동시관람객: <strong>
                {event.expected_visitors >= 10000
                  ? `${(event.expected_visitors / 10000).toFixed(0)}만명`
                  : `${event.expected_visitors.toLocaleString()}명`}
              </strong></span>
            </div>
          )}
        </div>

        {/* 설명 */}
        {event.description && (
          <p className="mt-4 text-sm text-gray-500 bg-gray-50 rounded-xl p-3">{event.description}</p>
        )}

        {/* 숙박업주 팁 */}
        <div className="mt-4 bg-indigo-50 border border-indigo-100 rounded-xl p-3">
          <p className="text-xs font-semibold text-indigo-700 mb-1">💡 숙박업주 팁</p>
          <p className="text-xs text-indigo-600">
            {event.expected_visitors && event.expected_visitors >= 100000
              ? '대규모 행사! 행사 2~3개월 전부터 단가를 미리 올려두세요.'
              : event.expected_visitors && event.expected_visitors >= 50000
              ? '중대형 행사입니다. 행사 1~2개월 전 단가 조정을 추천해요.'
              : '주변 숙박 수요가 증가할 수 있어요. 단가 조정을 확인하세요.'}
          </p>
        </div>

        {/* ── 단가 인상률 투표 ────────────────────────────── */}
        <div className="mt-4 border-t border-gray-100 pt-4">
          <p className="text-xs font-bold text-gray-700 mb-2.5">📊 단가 인상률 투표</p>

          {myVote || showResults ? (
            /* 결과 표시 */
            <div>
              <div className="flex items-center justify-between mb-2.5">
                <p className="text-xs text-gray-400">
                  {myVote ? '✅ 투표해 주셔서 감사합니다!' : '현재 투표 현황'}
                </p>
                {/* 미리보기일 때만 → 투표하기 토글 */}
                {!myVote && (
                  <button
                    onClick={() => setShowResults(false)}
                    className="text-xs text-indigo-500 hover:text-indigo-700 font-medium flex items-center gap-1 transition-colors"
                  >
                    ← 투표하기
                  </button>
                )}
              </div>
              <div className="space-y-1.5">
                {VOTE_RANGES.map(({ key, label }) => {
                  const count  = voteResults[key] || 0;
                  const pct    = voteTotal > 0 ? Math.round((count / voteTotal) * 100) : 0;
                  const isMine = myVote === key;
                  return (
                    <div key={key} className="flex items-center gap-2">
                      <span className={`text-xs w-20 shrink-0 ${isMine ? 'font-bold text-indigo-700' : 'text-gray-500'}`}>
                        {label}
                      </span>
                      <div className="flex-1 bg-gray-100 rounded-full h-1.5 overflow-hidden">
                        <div
                          className={`h-1.5 rounded-full transition-all duration-500 ${isMine ? 'bg-indigo-500' : 'bg-gray-300'}`}
                          style={{ width: `${pct}%` }}
                        />
                      </div>
                      <span className="text-xs text-gray-400 w-8 text-right">{pct}%</span>
                      {isMine && <span className="text-indigo-500 text-xs shrink-0">✓</span>}
                    </div>
                  );
                })}
              </div>
              <p className="text-xs text-gray-400 mt-2">총 {voteTotal}명 참여</p>
            </div>
          ) : (
            /* 투표 버튼 */
            <div>
              <p className="text-xs text-gray-500 mb-2">이 행사 때 단가를 얼마나 올리실 예정인가요?</p>
              <div className="flex flex-wrap gap-1.5">
                {VOTE_RANGES.map(({ key, label }) => (
                  <button
                    key={key}
                    onClick={() => handleVote(key)}
                    disabled={voting}
                    className="text-xs px-3 py-1.5 rounded-lg border border-gray-200 text-gray-600 hover:border-indigo-400 hover:text-indigo-600 hover:bg-indigo-50 transition-colors disabled:opacity-50"
                  >
                    {label}
                  </button>
                ))}
              </div>
              {voteTotal > 0 && (
                <button
                  onClick={() => setShowResults(true)}
                  className="text-xs text-indigo-500 hover:text-indigo-700 mt-2 block"
                >
                  결과 먼저 보기 ({voteTotal}명 참여)
                </button>
              )}
            </div>
          )}
        </div>

        {/* 링크 버튼 */}
        <div className="mt-4 flex gap-2">
          {event.source_url && (
            <a
              href={event.source_url}
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 flex items-center justify-center gap-1.5 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-semibold py-2.5 rounded-xl transition-colors"
            >
              <ExternalLink size={14} />
              예매 / 공식 사이트
            </a>
          )}
          <a
            href={`https://search.naver.com/search.naver?query=${encodeURIComponent(event.title)}`}
            target="_blank"
            rel="noopener noreferrer"
            className={`flex items-center justify-center gap-1.5 text-sm font-semibold py-2.5 rounded-xl border transition-colors ${
              event.source_url
                ? 'px-4 border-gray-200 text-gray-600 hover:bg-gray-50'
                : 'flex-1 border-indigo-200 text-indigo-600 hover:bg-indigo-50'
            }`}
          >
            <ExternalLink size={14} />
            {event.source_url ? '검색' : '네이버에서 검색'}
          </a>
        </div>
      </div>
    </div>
  );
}
