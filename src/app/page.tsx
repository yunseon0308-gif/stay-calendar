'use client';

import { useState } from 'react';
import Calendar from '@/components/Calendar';
import LocationFilter from '@/components/LocationFilter';
import UpcomingEvents from '@/components/UpcomingEvents';
import { SAMPLE_EVENTS } from '@/lib/sampleEvents';

export default function Home() {
  const [selectedLocation, setSelectedLocation] = useState('전체');

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
          <a
            href="/admin"
            className="text-xs text-gray-500 hover:text-indigo-600 border border-gray-200 px-3 py-1.5 rounded-lg hover:border-indigo-300 transition-colors"
          >
            관리자
          </a>
        </div>
      </header>

      {/* 상단 안내 배너 */}
      <div className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-3 text-center text-sm">
        💰 행사 시즌 전에 단가 조정하고 수익 극대화하세요!&nbsp;&nbsp;
        <span className="underline cursor-pointer opacity-80">단가 조정 가이드 보기 →</span>
      </div>

      <main className="max-w-7xl mx-auto px-4 py-6">

        {/* 소개 + 단가 조정 가이드 (상단 2컬럼) */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          {/* 스테이달력이란? */}
          <div className="bg-white rounded-2xl border border-gray-100 p-4 shadow-sm">
            <h2 className="text-sm font-bold text-gray-800 mb-1.5">📌 스테이달력이란?</h2>
            <p className="text-xs text-gray-500 leading-relaxed">
              공연·축제·불꽃놀이 등 대형 행사 일정을 한눈에 볼 수 있는 공유숙박업주 전용 캘린더입니다.
              주변 숙박 수요가 급증하는 날짜를 미리 파악하고, 단가를 최적화해 수익을 극대화하세요.
            </p>
          </div>

          {/* 단가 조정 가이드 */}
          <div className="bg-indigo-600 rounded-2xl p-4 text-white shadow-sm">
            <p className="text-sm font-bold mb-2">💡 단가 조정 가이드</p>
            <ul className="text-xs space-y-1.5 opacity-90">
              <li>🔴 일최대 30만명↑ 행사 → 3~4배 인상 가능</li>
              <li>🟡 일최대 5만명↑ 행사 → 2~3배 인상 추천</li>
              <li>🟢 콘서트·스포츠 전날 → 성수기 단가 적용</li>
              <li>📆 행사 2개월 전부터 미리 올리세요</li>
            </ul>
          </div>
        </div>

        {/* 지역 필터 */}
        <div className="mb-6">
          <p className="text-sm font-semibold text-gray-700 mb-2">📍 지역 필터</p>
          <LocationFilter selected={selectedLocation} onChange={setSelectedLocation} />
        </div>

        {/* 메인 그리드 — 캘린더 : 이벤트 리스트 등높이 */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:items-stretch">
          {/* 캘린더 (2/3) */}
          <div className="lg:col-span-2 flex flex-col">
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4 flex-1">
              <Calendar events={SAMPLE_EVENTS} selectedLocation={selectedLocation} />
            </div>
          </div>

          {/* 사이드바 (1/3) — 캘린더와 같은 높이, 내부 스크롤 */}
          <div className="flex flex-col min-h-0">
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4 flex-1 overflow-y-auto min-h-0">
              <UpcomingEvents events={SAMPLE_EVENTS} selectedLocation={selectedLocation} />
            </div>
          </div>
        </div>

        {/* 광고 영역 */}
        <div className="mt-4 grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 bg-white border border-dashed border-gray-300 rounded-2xl h-24 flex items-center justify-center text-gray-400 text-sm">
            광고 영역 (Google AdSense)
          </div>
          <div className="bg-white border border-dashed border-gray-300 rounded-2xl h-24 flex items-center justify-center text-gray-400 text-sm">
            광고 영역 (Google AdSense)
          </div>
        </div>
      </main>

      {/* 푸터 */}
      <footer className="mt-12 border-t border-gray-100 py-6 text-center text-xs text-gray-400">
        <p>© 2025 스테이달력 · 공유숙박업 단가관리 필수 플랫폼</p>
        <p className="mt-1">문의: contact@staycalendar.kr</p>
      </footer>
    </div>
  );
}
