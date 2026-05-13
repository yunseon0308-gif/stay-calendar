'use client';

import { useState, useEffect } from 'react';
import { VOTE_RANGES } from '@/lib/voteConfig';

interface Props {
  eventId: string;
}

export default function EventVoting({ eventId }: Props) {
  const [voteResults, setVoteResults] = useState<Record<string, number>>({});
  const [voteTotal, setVoteTotal]     = useState(0);
  const [myVote, setMyVote]           = useState<string | null>(null);
  const [voting, setVoting]           = useState(false);
  const [showResults, setShowResults] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem(`vote_${eventId}`);
    if (stored) setMyVote(stored);

    fetch(`/api/votes?eventId=${eventId}`)
      .then((r) => r.json())
      .then((data) => {
        setVoteResults(data.results || {});
        setVoteTotal(data.total || 0);
      })
      .catch(() => {});
  }, [eventId]);

  const handleVote = async (range: string) => {
    if (myVote || voting) return;
    setVoting(true);
    try {
      const res = await fetch('/api/votes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ eventId, range }),
      });
      const data = await res.json();
      if (res.ok) {
        setMyVote(range);
        localStorage.setItem(`vote_${eventId}`, range);
        setVoteResults(data.results || {});
        setVoteTotal(data.total || 0);
      }
    } finally {
      setVoting(false);
    }
  };

  return (
    <div className="border-t border-gray-100 pt-5">
      <p className="text-sm font-bold text-gray-700 mb-3">📊 단가 인상률 투표</p>

      {myVote || showResults ? (
        <div>
          <div className="flex items-center justify-between mb-3">
            <p className="text-xs text-gray-400">
              {myVote ? '✅ 투표해 주셔서 감사합니다!' : '현재 투표 현황'}
            </p>
            {!myVote && (
              <button
                onClick={() => setShowResults(false)}
                className="text-xs text-indigo-500 hover:text-indigo-700 font-medium transition-colors"
              >
                ← 투표하기
              </button>
            )}
          </div>
          <div className="space-y-2">
            {VOTE_RANGES.map(({ key, label }) => {
              const count = voteResults[key] || 0;
              const pct   = voteTotal > 0 ? Math.round((count / voteTotal) * 100) : 0;
              const isMine = myVote === key;
              return (
                <div key={key} className="flex items-center gap-2">
                  <span className={`text-xs w-20 shrink-0 ${isMine ? 'font-bold text-indigo-700' : 'text-gray-500'}`}>
                    {label}
                  </span>
                  <div className="flex-1 bg-gray-100 rounded-full h-2 overflow-hidden">
                    <div
                      className={`h-2 rounded-full transition-all duration-500 ${isMine ? 'bg-indigo-500' : 'bg-gray-300'}`}
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                  <span className="text-xs text-gray-400 w-8 text-right">{pct}%</span>
                  {isMine && <span className="text-indigo-500 text-xs">✓</span>}
                </div>
              );
            })}
          </div>
          <p className="text-xs text-gray-400 mt-2">총 {voteTotal}명 참여</p>
        </div>
      ) : (
        <div>
          <p className="text-xs text-gray-500 mb-2.5">이 행사 때 단가를 얼마나 올리실 예정인가요?</p>
          <div className="flex flex-wrap gap-2">
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
  );
}
