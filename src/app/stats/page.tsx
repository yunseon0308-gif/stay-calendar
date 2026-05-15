import Link from 'next/link';
import SurveyEventList from '@/components/SurveyEventList';
import SiteHeader from '@/components/SiteHeader';

const STATS_DATA = [
  {
    title: '한화 서울세계불꽃축제 2024',
    location: '서울 여의도',
    category: '불꽃',
    categoryColor: 'bg-yellow-100 text-yellow-700',
    demandUp: '거의 만실',
    priceMultiple: '최대 6~13배',
    icon: '🎆',
    detail: '여의도 에어비앤비 원룸 16만→93만원, 한강뷰 스위트 최대 1,300만원',
    sources: [
      { label: '뉴스1', url: 'https://www.news1.kr/industry/hotel-tourism/5558693' },
      { label: '한국일보', url: 'https://www.hankookilbo.com/News/Read/A2024092713530000703' },
    ],
  },
  {
    title: 'BTS 월드투어 ARIRANG 2026 (고양)',
    location: '경기 고양',
    category: '콘서트',
    categoryColor: 'bg-purple-100 text-purple-700',
    demandUp: '해외 +18,500%',
    priceMultiple: '만실',
    icon: '🎤',
    detail: '일정 발표 당일 고양 숙소 검색량 8배↑, 공연 기간 해외 여행객 185배·국내 44배 급등 (아고다)',
    sources: [
      { label: '헤럴드경제', url: 'https://biz.heraldcorp.com/article/10702006' },
      { label: '뉴시스(아고다)', url: 'https://mobile.newsis.com/view/ALSX20260403_0000005977' },
    ],
  },
  {
    title: '한화 서울세계불꽃축제 2025',
    location: '서울 여의도',
    category: '불꽃',
    categoryColor: 'bg-yellow-100 text-yellow-700',
    demandUp: '여의도·마포·용산 95%',
    priceMultiple: '2~4배',
    icon: '🎆',
    detail: '여의도 인근 호텔 일반실 60만→120~236만원, 투숙률 95% 거의 만실',
    sources: [
      { label: '뉴스1(호텔)', url: 'https://www.news1.kr/industry/distribution/5914445' },
      { label: '머니투데이', url: 'https://www.mt.co.kr/society/2025/09/21/2025092110581697163' },
    ],
  },
];

const QUALITATIVE_DATA = [
  {
    title: '부산 광안리 불꽃축제',
    location: '부산 수영구',
    icon: '🎇',
    note: '매년 50만명+ 방문. 광안리·해운대 숙박 당일 만실, 인근 지역까지 수요 확산',
  },
  {
    title: '대형 K-POP 콘서트 (일반)',
    location: '공연장 반경 5km',
    icon: '🎵',
    note: '공연 전날~당일 인근 숙박 조기 매진 패턴. 해외 팬 비중 높을수록 수요 강도↑',
  },
  {
    title: '서울재즈·록 페스티벌',
    location: '서울 잠실·송파',
    icon: '🎷',
    note: '3일 연속 행사로 금~일 연박 수요 발생. 올림픽공원 인근 게스트하우스 조기 매진',
  },
];

export default function StatsPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* 헤더 */}
      <SiteHeader active="stats" />

      <main className="max-w-5xl mx-auto px-4 py-10">
        {/* 페이지 타이틀 */}
        <div className="text-center mb-6">
          <h1 className="text-2xl font-black text-gray-800 mb-2">📊 역대 행사 단가 데이터</h1>
          <p className="text-sm text-gray-500">행사 기간 숙박 수요 및 평균 단가 변동 현황</p>
        </div>

        {/* 출처 안내 */}
        <div className="bg-blue-50 border border-blue-200 rounded-2xl px-5 py-3 mb-8 flex items-start gap-2 text-sm text-blue-700">
          <span className="mt-0.5 shrink-0">ℹ️</span>
          <p>실제 언론 보도 및 플랫폼 공식 발표 기반 데이터입니다. 각 카드 하단 출처를 확인하세요.</p>
        </div>

        {/* 수치 데이터 카드 */}
        <h2 className="text-sm font-bold text-gray-500 uppercase tracking-wide mb-4">📰 언론·플랫폼 공식 발표</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 mb-10">
          {STATS_DATA.map((item) => (
            <div
              key={item.title}
              className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 hover:border-indigo-100 hover:shadow-md transition-all flex flex-col"
            >
              <div className="flex items-center justify-between mb-3">
                <span className="text-2xl">{item.icon}</span>
                <span className={`text-xs font-semibold px-2.5 py-0.5 rounded-full ${item.categoryColor}`}>
                  {item.category}
                </span>
              </div>
              <h3 className="font-bold text-gray-800 text-base mb-1 leading-tight">{item.title}</h3>
              <p className="text-xs text-gray-400 mb-3 flex items-center gap-1">
                <span>📍</span><span>{item.location}</span>
              </p>
              <div className="grid grid-cols-2 gap-3 mb-3">
                <div className="bg-indigo-50 rounded-xl px-3 py-2.5 text-center">
                  <p className="text-xs text-indigo-500 font-medium mb-1">숙박 수요</p>
                  <p className="text-sm font-black text-indigo-700 leading-tight">{item.demandUp}</p>
                </div>
                <div className="bg-emerald-50 rounded-xl px-3 py-2.5 text-center">
                  <p className="text-xs text-emerald-600 font-medium mb-1">단가 변동</p>
                  <p className="text-sm font-black text-emerald-700 leading-tight">{item.priceMultiple}</p>
                </div>
              </div>
              <p className="text-xs text-gray-500 leading-relaxed mb-3 flex-1">{item.detail}</p>
              <div className="flex flex-wrap gap-1.5 pt-3 border-t border-gray-100">
                <span className="text-xs text-gray-400">출처:</span>
                {item.sources.map((s) => (
                  <a key={s.label} href={s.url} target="_blank" rel="noopener noreferrer"
                    className="text-xs text-indigo-500 hover:underline">
                    {s.label}
                  </a>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* 정성 데이터 */}
        <h2 className="text-sm font-bold text-gray-500 uppercase tracking-wide mb-4">📋 업계 패턴 (정성 데이터)</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-10">
          {QUALITATIVE_DATA.map((item) => (
            <div key={item.title} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4">
              <div className="flex items-center gap-2 mb-2">
                <span className="text-xl">{item.icon}</span>
                <div>
                  <p className="text-sm font-bold text-gray-800">{item.title}</p>
                  <p className="text-xs text-gray-400">📍 {item.location}</p>
                </div>
              </div>
              <p className="text-xs text-gray-500 leading-relaxed">{item.note}</p>
            </div>
          ))}
        </div>

        {/* ── 운영자 실전 데이터 ─────────────────── */}
        <h2 className="text-sm font-bold text-gray-500 uppercase tracking-wide mb-2">🏆 운영자 실전 데이터</h2>
        <p className="text-xs text-gray-400 mb-4">호스트들이 직접 등록한 단가 인상 및 예약 속도 데이터입니다. 클릭하면 상세 통계와 댓글을 볼 수 있어요.</p>
        <SurveyEventList />

        {/* 하단 안내 */}
        <div className="bg-indigo-50 border border-indigo-100 rounded-2xl p-5 text-sm text-indigo-700 mt-10">
          <p className="font-bold mb-2">💡 데이터 활용 팁</p>
          <ul className="list-disc list-inside space-y-1 text-indigo-600 text-xs leading-relaxed">
            <li>불꽃축제는 단가 인상 폭이 가장 큽니다 — 2개월 전부터 준비하세요.</li>
            <li>해외 팬 비중 높은 K-POP 공연은 국내보다 빨리 예약이 마감됩니다.</li>
            <li>행사 당일만 아니라 전날 숙박 수요도 함께 올라갑니다.</li>
            <li>투표 데이터는 실제 호스트들의 경험을 바탕으로 누적됩니다.</li>
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
