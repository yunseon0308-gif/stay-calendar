'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

interface Post {
  id: string;
  nickname: string;
  location: string;
  content: string;
  likes: number;
  created_at: string;
}

function timeAgo(dateStr: string): string {
  const diff = Date.now() - new Date(dateStr).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return '방금 전';
  if (mins < 60) return `${mins}분 전`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${hours}시간 전`;
  const days = Math.floor(hours / 24);
  return `${days}일 전`;
}

export default function CommunityPage() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [nickname, setNickname] = useState('');
  const [location, setLocation] = useState('');
  const [content, setContent] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState('');
  const [showForm, setShowForm] = useState(false);

  useEffect(() => {
    loadPosts();
  }, []);

  const loadPosts = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/community');
      const data = await res.json();
      setPosts(data.posts || []);
    } catch {
      setPosts([]);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError('');
    if (!nickname.trim() || !content.trim()) {
      setFormError('닉네임과 내용을 입력해주세요.');
      return;
    }
    setSubmitting(true);
    try {
      const res = await fetch('/api/community', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ nickname, location, content }),
      });
      const data = await res.json();
      if (!res.ok) {
        setFormError(data.error || '오류가 발생했습니다.');
      } else {
        setPosts((prev) => [data.post, ...prev]);
        setNickname('');
        setLocation('');
        setContent('');
        setShowForm(false);
      }
    } catch {
      setFormError('오류가 발생했습니다. 다시 시도해주세요.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* 헤더 */}
      <header className="bg-white border-b border-gray-100 sticky top-0 z-40 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <Link href="/" className="flex flex-col">
            <span className="text-xl font-black text-indigo-700 tracking-tight">🏨 스테이달력</span>
            <span className="text-xs text-gray-400 mt-0.5">공유숙박업 단가관리 필수 행사 캘린더</span>
          </Link>
          <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-gray-600">
            <Link href="/" className="hover:text-indigo-600 transition-colors">달력</Link>
            <Link href="/community" className="text-indigo-700 font-bold">커뮤니티</Link>
            <Link href="/subscribe" className="hover:text-indigo-600 transition-colors">알림신청</Link>
            <Link href="/stats" className="hover:text-indigo-600 transition-colors">통계</Link>
          </nav>
          <Link
            href="/admin"
            className="text-xs text-gray-500 hover:text-indigo-600 border border-gray-200 px-3 py-1.5 rounded-lg hover:border-indigo-300 transition-colors"
          >
            관리자
          </Link>
        </div>
      </header>

      <main className="max-w-2xl mx-auto px-4 py-10">
        {/* 페이지 타이틀 */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-black text-gray-800 mb-1">💬 커뮤니티</h1>
            <p className="text-sm text-gray-500">숙박업주들의 단가 노하우를 공유해요</p>
          </div>
          <button
            onClick={() => setShowForm((v) => !v)}
            className="bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-bold px-4 py-2 rounded-xl transition-colors"
          >
            {showForm ? '✕ 닫기' : '✏️ 글쓰기'}
          </button>
        </div>

        {/* 글쓰기 폼 */}
        {showForm && (
          <div className="bg-white rounded-2xl border border-indigo-100 shadow-sm p-5 mb-6">
            <h2 className="text-sm font-bold text-gray-700 mb-4">새 글 작성</h2>
            <form onSubmit={handleSubmit} className="flex flex-col gap-3">
              <div className="flex gap-3">
                <input
                  type="text"
                  value={nickname}
                  onChange={(e) => setNickname(e.target.value)}
                  placeholder="닉네임 *"
                  maxLength={20}
                  className="flex-1 border border-gray-200 rounded-xl px-3 py-2 text-sm text-gray-800 placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-300 transition"
                />
                <input
                  type="text"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  placeholder="지역 (예: 서울 잠실)"
                  maxLength={30}
                  className="flex-1 border border-gray-200 rounded-xl px-3 py-2 text-sm text-gray-800 placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-300 transition"
                />
              </div>
              <textarea
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="단가 조정 경험이나 노하우를 공유해주세요..."
                maxLength={300}
                rows={4}
                className="border border-gray-200 rounded-xl px-3 py-2 text-sm text-gray-800 placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-300 resize-none transition"
              />
              <div className="flex items-center justify-between">
                <span className="text-xs text-gray-400">{content.length}/300</span>
                {formError && (
                  <span className="text-xs text-red-500">{formError}</span>
                )}
                <button
                  type="submit"
                  disabled={submitting}
                  className="bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-bold px-5 py-2 rounded-xl transition-colors disabled:opacity-60"
                >
                  {submitting ? '등록 중...' : '등록'}
                </button>
              </div>
            </form>
          </div>
        )}

        {/* 게시글 목록 */}
        {loading ? (
          <div className="text-center py-20 text-gray-400 text-sm">불러오는 중...</div>
        ) : posts.length === 0 ? (
          <div className="text-center py-20 text-gray-400 text-sm">아직 게시글이 없습니다. 첫 번째 글을 작성해보세요!</div>
        ) : (
          <div className="flex flex-col gap-3">
            {posts.map((post) => (
              <div key={post.id} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 hover:border-indigo-100 transition-colors">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-sm text-gray-800">{post.nickname}</span>
                    {post.location && (
                      <span className="bg-indigo-50 text-indigo-600 text-xs px-2 py-0.5 rounded-full font-medium">
                        📍 {post.location}
                      </span>
                    )}
                  </div>
                  <span className="text-xs text-gray-400">{timeAgo(post.created_at)}</span>
                </div>
                <p className="text-sm text-gray-700 leading-relaxed">{post.content}</p>
                <div className="mt-3 flex items-center gap-1 text-xs text-gray-400">
                  <span>👍</span>
                  <span>{post.likes}</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>

      {/* 푸터 */}
      <footer className="mt-12 border-t border-gray-100 py-6 text-center text-xs text-gray-400">
        <p>© 2026 스테이달력 · 공유숙박업 단가관리 필수 플랫폼</p>
        <p className="mt-1">
          <Link href="/privacy" className="hover:text-indigo-500 underline">개인정보처리방침</Link>
        </p>
      </footer>
    </div>
  );
}
