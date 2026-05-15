'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Heart, MessageCircle, Send } from 'lucide-react';
import SiteHeader from '@/components/SiteHeader';

interface Post {
  id: string;
  nickname: string;
  location: string;
  content: string;
  likes: number;
  created_at: string;
  is_sample?: boolean;
}

interface Comment {
  id: string;
  post_id: string;
  nickname: string;
  content: string;
  created_at: string;
}

const ADMIN_EMAIL = 'llstaycall@gmail.com';

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

  // 좋아요
  const [likedPosts, setLikedPosts] = useState<Set<string>>(new Set());

  // 댓글
  const [openComments, setOpenComments] = useState<string | null>(null);
  const [commentsMap, setCommentsMap] = useState<Record<string, Comment[]>>({});
  const [commentNick, setCommentNick] = useState('');
  const [commentContent, setCommentContent] = useState('');
  const [commentSubmitting, setCommentSubmitting] = useState(false);

  useEffect(() => {
    loadPosts();
    const liked = JSON.parse(localStorage.getItem('liked_posts') || '[]');
    setLikedPosts(new Set(liked));
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

  // 좋아요 핸들러
  const handleLike = async (postId: string) => {
    if (likedPosts.has(postId)) return;
    // 낙관적 업데이트
    setPosts(prev => prev.map(p => p.id === postId ? { ...p, likes: p.likes + 1 } : p));
    const newLiked = new Set(likedPosts);
    newLiked.add(postId);
    setLikedPosts(newLiked);
    localStorage.setItem('liked_posts', JSON.stringify([...newLiked]));
    // API 호출
    await fetch('/api/community', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ postId }),
    });
  };

  // 댓글 토글
  const toggleComments = async (postId: string) => {
    if (openComments === postId) {
      setOpenComments(null);
      return;
    }
    setOpenComments(postId);
    setCommentNick('');
    setCommentContent('');
    if (!commentsMap[postId]) {
      try {
        const res = await fetch(`/api/community/${postId}/comments`);
        const data = await res.json();
        setCommentsMap(prev => ({ ...prev, [postId]: data.comments || [] }));
      } catch {
        setCommentsMap(prev => ({ ...prev, [postId]: [] }));
      }
    }
  };

  // 댓글 작성
  const handleCommentSubmit = async (postId: string, e: React.FormEvent) => {
    e.preventDefault();
    if (!commentNick.trim() || !commentContent.trim()) return;
    setCommentSubmitting(true);
    try {
      const res = await fetch(`/api/community/${postId}/comments`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ nickname: commentNick, content: commentContent }),
      });
      const data = await res.json();
      if (res.ok && data.comment) {
        setCommentsMap(prev => ({
          ...prev,
          [postId]: [...(prev[postId] || []), data.comment],
        }));
        setCommentContent('');
      }
    } finally {
      setCommentSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* 헤더 */}
      <SiteHeader active="community" />

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
                {formError && <span className="text-xs text-red-500">{formError}</span>}
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
            {posts.map((post) => {
              const isLiked = likedPosts.has(post.id);
              const isCommentOpen = openComments === post.id;
              const comments = commentsMap[post.id] || [];

              return (
                <div key={post.id} className={`bg-white rounded-2xl border shadow-sm hover:border-indigo-100 transition-colors ${post.is_sample ? 'border-amber-100' : 'border-gray-100'}`}>
                  {/* 샘플 안내 배너 */}
                  {post.is_sample && (
                    <div className="bg-amber-50 rounded-t-2xl px-5 py-2 flex items-center gap-1.5 border-b border-amber-100">
                      <span className="text-xs font-bold text-amber-600">📋 샘플 게시글</span>
                      <span className="text-xs text-amber-500">· 실제 이용 예시입니다. 첫 번째 글을 남겨보세요!</span>
                    </div>
                  )}
                  {/* 게시글 본문 */}
                  <div className="p-5">
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

                    {/* 좋아요 · 댓글 버튼 */}
                    <div className="mt-4 flex items-center gap-4">
                      <button
                        onClick={() => handleLike(post.id)}
                        className={`flex items-center gap-1.5 text-sm font-medium transition-colors ${
                          isLiked
                            ? 'text-red-500 cursor-default'
                            : 'text-gray-400 hover:text-red-400 cursor-pointer'
                        }`}
                      >
                        <Heart
                          size={15}
                          className={isLiked ? 'fill-red-500 stroke-red-500' : ''}
                        />
                        <span>{post.likes}</span>
                      </button>
                      <button
                        onClick={() => toggleComments(post.id)}
                        className={`flex items-center gap-1.5 text-sm font-medium transition-colors ${
                          isCommentOpen ? 'text-indigo-600' : 'text-gray-400 hover:text-indigo-500'
                        }`}
                      >
                        <MessageCircle size={15} />
                        <span>{comments.length > 0 ? comments.length : '댓글'}</span>
                      </button>
                    </div>
                  </div>

                  {/* 댓글 영역 */}
                  {isCommentOpen && (
                    <div className="border-t border-gray-50 bg-gray-50/60 rounded-b-2xl px-5 py-4">
                      {/* 기존 댓글 목록 */}
                      {comments.length > 0 && (
                        <div className="flex flex-col gap-2 mb-4">
                          {comments.map((c) => (
                            <div key={c.id} className="flex gap-2">
                              <span className="text-xs font-bold text-gray-700 shrink-0">{c.nickname}</span>
                              <span className="text-xs text-gray-600 leading-relaxed">{c.content}</span>
                              <span className="text-xs text-gray-300 shrink-0 ml-auto">{timeAgo(c.created_at)}</span>
                            </div>
                          ))}
                        </div>
                      )}
                      {comments.length === 0 && (
                        <p className="text-xs text-gray-400 mb-3">아직 댓글이 없어요. 첫 댓글을 남겨보세요!</p>
                      )}

                      {/* 댓글 작성 폼 */}
                      <form
                        onSubmit={(e) => handleCommentSubmit(post.id, e)}
                        className="flex gap-2"
                      >
                        <input
                          type="text"
                          value={commentNick}
                          onChange={(e) => setCommentNick(e.target.value)}
                          placeholder="닉네임"
                          maxLength={15}
                          className="w-20 border border-gray-200 rounded-lg px-2 py-1.5 text-xs focus:outline-none focus:ring-1 focus:ring-indigo-300 bg-white"
                        />
                        <input
                          type="text"
                          value={commentContent}
                          onChange={(e) => setCommentContent(e.target.value)}
                          placeholder="댓글을 입력하세요 (200자 이내)"
                          maxLength={200}
                          className="flex-1 border border-gray-200 rounded-lg px-2 py-1.5 text-xs focus:outline-none focus:ring-1 focus:ring-indigo-300 bg-white"
                        />
                        <button
                          type="submit"
                          disabled={commentSubmitting || !commentNick.trim() || !commentContent.trim()}
                          className="bg-indigo-600 hover:bg-indigo-700 text-white px-2.5 py-1.5 rounded-lg transition-colors disabled:opacity-40"
                        >
                          <Send size={13} />
                        </button>
                      </form>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </main>

      {/* 푸터 */}
      <footer className="mt-12 border-t border-gray-100 py-6 text-center text-xs text-gray-400">
        <p>© 2026 스테이달력 · 공유숙박업 단가관리 필수 플랫폼</p>
        <p className="mt-1 flex items-center justify-center gap-3">
          <Link href="/privacy" className="hover:text-indigo-500 underline">개인정보처리방침</Link>
          <span>·</span>
          <a href={`mailto:${ADMIN_EMAIL}`} className="hover:text-indigo-500">{ADMIN_EMAIL}</a>
        </p>
      </footer>
    </div>
  );
}
