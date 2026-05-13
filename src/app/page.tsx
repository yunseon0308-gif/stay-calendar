'use client';

import { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import Calendar from '@/components/Calendar';
import LocationFilter from '@/components/LocationFilter';
import UpcomingEvents from '@/components/UpcomingEvents';
import { SAMPLE_EVENTS } from '@/lib/sampleEvents';

export default function Home() {
  const [selectedLocation, setSelectedLocation] = useState('전체');

  // 행사가 있는 지역 목록 계산
  const activeLocSet = useMemo(
    () => new Set(SAMPLE_EVENTS.map(e => e.location)),
    [],
  );
  // 선택된 지역에 행사가 없으면 전체로 복귀
  useEffect(() => {
    if (selectedLocation !== '전체' && !activeLocSet.has(selectedLocation)) {
      setSelectedLocation('전체');
    }
  }, [selectedLocation, activeLocSet]);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* 헤더 */}
      <header className="bg-white border-b border-gray-100 sticky top-0 z-40 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <div>
            <h1 className="text-xl font-black text-indigo-700 tracking-tight">
              🏨 스테이달력
            </h1>
            <p className="text-xs text-gray-400 mt-0.5">공유숙박업 단가관리 필수 행사 캘린더</p>
          </div>
          <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-gray-600">
            <Link href="/" className="text-indigo-700 font-bold">달력</Link>
            <Link href="/community" className="hover:text-indigo-600 transition-colors">커뮤니티</Link>
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

      {/* 상단 안내 배너 */}
      <div className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-3 text-center text-sm">
        💰 행사 시즌 전에 단가 조정하고 수익 극대화하세요!
      </div>

      <main className="max-w-7xl mx-auto px-4 py-6">

        {/* 소개 */}
        <div className="bg-white rounded-2xl border border-gray-100 p-4 shadow-sm mb-6">
          <h2 className="text-sm font-bold text-gray-800 mb-1.5">📌 스테이달력이란?</h2>
          <p className="text-xs text-gray-500 leading-relaxed">
            공연·축제·불꽃놀이 등 대형 행사 일정을 한눈에 볼 수 있는 공유숙박업주 전용 캘린더입니다.
            주변 숙박 수요가 급증하는 날짜를 미리 파악하고 단가를 최적화해 수익을 극대화하세요.
            📆 <strong className="text-gray-600">행사 2개월 전부터 미리 단가를 올려두는 것</strong>이 핵심입니다.
          </p>
        </div>

        {/* 지역 필터 */}
        <div className="mb-6">
          <p className="text-sm font-semibold text-gray-700 mb-2">📍 지역 필터</p>
          <LocationFilter selected={selectedLocation} onChange={setSelectedLocation} events={SAMPLE_EVENTS} />
        </div>

        {/* 메인 그리드 */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
          {/* 캘린더 (2/3) */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4">
              <Calendar events={SAMPLE_EVENTS} selectedLocation={selectedLocation} />
            </div>
          </div>

          {/* 사이드바 (1/3) — sticky + 내부 스크롤 */}
          <div className="lg:sticky lg:top-[73px]">
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4 overflow-y-auto max-h-[calc(100vh-100px)]">
              <UpcomingEvents events={SAMPLE_EVENTS} selectedLocation={selectedLocation} />
            </div>
          </div>
        </div>

      </main>

      {/* 푸터 */}
      <footer className="mt-12 border-t border-gray-100 py-6 text-center text-xs text-gray-400">
        <p>© 2026 스테이달력 · 공유숙박업 단가관리 필수 플랫폼</p>
        <p className="mt-1">문의: <a href="mailto:cinemomo@naver.com" className="hover:text-indigo-500">cinemomo@naver.com</a></p>
        <p className="mt-1">
          <a href="/privacy" className="hover:text-indigo-500 underline">개인정보처리방침</a>
        </p>
      </footer>
    </div>
  );
}
