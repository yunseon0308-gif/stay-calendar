import Link from 'next/link';

const STATS_DATA = [
  {
    title: 'BTS 월드투어 2025',
    location: '잠실',
    category: '콘서트',
    categoryColor: 'bg-purple-100 text-purple-700',
    demandUp: '+280%',
    priceMultiple: '3.2배',
    icon: '🎤',
  },
  {
    title: '한화불꽃축제 2025',
    location: '여의도',
    category: '불꽃',
    categoryColor: 'bg-orange-100 text-orange-700',
    demandUp: '+420%',
    priceMultiple: '3.8배',
    icon: '🎆',
  },
  {
    title: '아이유 콘서트 2025',
    location: '고척',
    category: '콘서트',
    categoryColor: 'bg-purple-100 text-purple-700',
    demandUp: '+190%',
    priceMultiple: '2.4배',
    icon: '🎵',
  },
  {
    title: '부산국제영화제 2025',
    location: '해운대',
    category: '축제',
    categoryColor: 'bg-blue-100 text-blue-700',
    demandUp: '+150%',
    priceMultiple: '2.1배',
    icon: '🎬',
  },
  {
    title: '서울재즈페스 2025',
    location: '잠실',
    category: '축제',
    categoryColor: 'bg-blue-100 text-blue-700',
    demandUp: '+120%',
    priceMultiple: '1.8배',
    icon: '🎷',
  },
  {
    title: '광안리불꽃축제 2025',
    location: '수영구',
    category: '불꽃',
    categoryColor: 'bg-orange-100 text-orange-700',
    demandUp: '+310%',
    priceMultiple: '3.4배',
    icon: '🎇',
  },
];

export default function StatsPage() {
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
            <Link href="/community" className="hover:text-indigo-600 transition-colors">커뮤니티</Link>
            <Link href="/subscribe" className="hover:text-indigo-600 transition-colors">알림신청</Link>
            <Link href="/stats" className="text-indigo-700 font-bold">통계</Link>
          </nav>
          <Link
            href="/admin"
            className="text-xs text-gray-500 hover:text-indigo-600 border border-gray-200 px-3 py-1.5 rounded-lg hover:border-indigo-300 transition-colors"
          >
            관리자
          </Link>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-4 py-10">
        {/* 페이지 타이틀 */}
        <div className="text-center mb-6">
          <h1 className="text-2xl font-black text-gray-800 mb-2">📊 역대 행사 단가 데이터</h1>
          <p className="text-sm text-gray-500">행사 기간 숙박 수요 및 평균 단가 변동 현황</p>
        </div>

        {/* 샘플 데이터 안내 */}
        <div className="bg-amber-50 border border-amber-200 rounded-2xl px-5 py-3 mb-8 flex items-start gap-2 text-sm text-amber-700">
          <span className="mt-0.5 shrink-0">⚠️</span>
          <p>샘플 데이터입니다. 실제 데이터는 순차적으로 축적됩니다.</p>
        </div>

        {/* 통계 카드 그리드 */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {STATS_DATA.map((item) => (
            <div
              key={item.title}
              className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 hover:border-indigo-100 hover:shadow-md transition-all"
            >
              {/* 상단: 아이콘 + 카테고리 */}
              <div className="flex items-center justify-between mb-3">
                <span className="text-2xl">{item.icon}</span>
                <span className={`text-xs font-semibold px-2.5 py-0.5 rounded-full ${item.categoryColor}`}>
                  {item.category}
                </span>
              </div>

              {/* 행사명 */}
              <h3 className="font-bold text-gray-800 text-base mb-1 leading-tight">{item.title}</h3>
              <p className="text-xs text-gray-400 mb-4 flex items-center gap-1">
                <span>📍</span>
                <span>{item.location}</span>
              </p>

              {/* 수치 */}
              <div className="grid grid-cols-2 gap-3">
                <div className="bg-indigo-50 rounded-xl px-3 py-2.5 text-center">
                  <p className="text-xs text-indigo-500 font-medium mb-1">숙박 수요</p>
                  <p className="text-lg font-black text-indigo-700">{item.demandUp}</p>
                </div>
                <div className="bg-emerald-50 rounded-xl px-3 py-2.5 text-center">
                  <p className="text-xs text-emerald-600 font-medium mb-1">평균 단가</p>
                  <p className="text-lg font-black text-emerald-700">{item.priceMultiple}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* 하단 안내 */}
        <div className="mt-10 bg-indigo-50 border border-indigo-100 rounded-2xl p-5 text-sm text-indigo-700">
          <p className="font-bold mb-2">💡 데이터 활용 팁</p>
          <ul className="list-disc list-inside space-y-1 text-indigo-600 text-xs leading-relaxed">
            <li>수요 증가율이 높을수록 행사 전 단가 인상 효과가 큽니다.</li>
            <li>평균 단가 2배 이상 행사는 최소 2개월 전부터 준비하세요.</li>
            <li>불꽃축제는 수요 급증 폭이 가장 크므로 특히 주의하세요.</li>
            <li>실제 데이터가 쌓일수록 더 정밀한 예측이 가능해집니다.</li>
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
