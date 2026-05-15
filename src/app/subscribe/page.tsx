'use client';

import { useState } from 'react';
import Link from 'next/link';
import SiteHeader from '@/components/SiteHeader';

const LOCATIONS = ['서울', '부산', '인천', '대구', '대전', '광주', '울산', '수원', '고양', '기타'];

export default function SubscribePage() {
  const [email, setEmail] = useState('');
  const [location, setLocation] = useState('');
  const [district, setDistrict] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');
    setError('');

    try {
      const res = await fetch('/api/subscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, location, district }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || '오류가 발생했습니다.');
      } else {
        setMessage(data.message);
        setEmail('');
        setLocation('');
        setDistrict('');
      }
    } catch {
      setMessage('구독 신청이 접수되었습니다.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* 헤더 */}
      <SiteHeader active="subscribe" />

      <main className="max-w-2xl mx-auto px-4 py-10">
        {/* 페이지 타이틀 */}
        <div className="text-center mb-8">
          <h1 className="text-2xl font-black text-gray-800 mb-2">🔔 행사 알림 구독</h1>
          <p className="text-sm text-gray-500">매월 말일, 다음 달 대형 행사 일정을 이메일로 일괄 받아보세요.</p>
        </div>

        {/* 폼 카드 */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
          <form onSubmit={handleSubmit} className="flex flex-col gap-5">
            {/* 이메일 */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                이메일 <span className="text-red-500">*</span>
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="your@email.com"
                required
                className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm text-gray-800 placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-300 focus:border-transparent transition"
              />
            </div>

            {/* 지역 선택 */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                지역 <span className="text-red-500">*</span>
              </label>
              <select
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                required
                className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-indigo-300 focus:border-transparent transition bg-white"
              >
                <option value="">지역을 선택하세요</option>
                {LOCATIONS.map((loc) => (
                  <option key={loc} value={loc}>{loc}</option>
                ))}
              </select>
            </div>

            {/* 상세 지역 */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                상세 지역 <span className="text-gray-400 font-normal">(선택)</span>
              </label>
              <input
                type="text"
                value={district}
                onChange={(e) => setDistrict(e.target.value)}
                placeholder="예: 잠실, 여의도, 해운대"
                className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm text-gray-800 placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-300 focus:border-transparent transition"
              />
            </div>

            {/* 성공 메시지 */}
            {message && (
              <div className="bg-green-50 border border-green-200 text-green-700 rounded-xl px-4 py-3 text-sm font-medium">
                ✅ {message}
              </div>
            )}

            {/* 에러 메시지 */}
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-600 rounded-xl px-4 py-3 text-sm font-medium">
                ⚠️ {error}
              </div>
            )}

            {/* 제출 버튼 */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 rounded-xl text-sm transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {loading ? '처리 중...' : '🔔 알림 구독하기'}
            </button>
          </form>
        </div>

        {/* 안내 */}
        <div className="mt-6 bg-indigo-50 border border-indigo-100 rounded-2xl p-4 text-xs text-indigo-700 leading-relaxed">
          <p className="font-semibold mb-1">📌 알림 구독 안내</p>
          <ul className="list-disc list-inside space-y-1 text-indigo-600">
            <li>매월 말일, 다음 달 대형 행사 알림을 일괄 발송합니다.</li>
            <li>지역 기반 필터링 — 선택한 지역의 행사만 보내드려요.</li>
            <li>구독자 개인정보는 알림 발송 목적으로만 사용됩니다.</li>
            <li>수신 거부: 메일 하단 「수신거부」 링크 또는 <a href="mailto:llstaycall@gmail.com?subject=수신거부 요청" className="underline">llstaycall@gmail.com</a>으로 회신해주세요.</li>
          </ul>
        </div>
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
