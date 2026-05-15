import Link from 'next/link';

const TABS = [
  { href: '/',          label: '달력',     key: 'calendar'  },
  { href: '/community', label: '커뮤니티', key: 'community' },
  { href: '/subscribe', label: '알림신청', key: 'subscribe' },
  { href: '/stats',     label: '통계',     key: 'stats'     },
] as const;

type TabKey = typeof TABS[number]['key'];

/** 모든 페이지 공통 헤더 — 데스크톱 우측 메뉴 + 모바일 하단 탭 줄 */
export default function SiteHeader({ active }: { active?: TabKey }) {
  return (
    <header className="bg-white border-b border-gray-100 sticky top-0 z-40 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
        <Link href="/" className="flex flex-col">
          <span className="text-xl font-black text-indigo-700 tracking-tight">🏨 스테이달력</span>
          <span className="text-xs text-gray-400 mt-0.5">공유숙박업 단가관리 필수 행사 캘린더</span>
        </Link>

        {/* 데스크톱 메뉴 */}
        <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-gray-600">
          {TABS.map(t => (
            <Link
              key={t.key}
              href={t.href}
              className={active === t.key
                ? 'text-indigo-700 font-bold'
                : 'hover:text-indigo-600 transition-colors'}
            >
              {t.label}
            </Link>
          ))}
        </nav>

        <Link
          href="/admin"
          className="text-xs text-gray-500 hover:text-indigo-600 border border-gray-200 px-3 py-1.5 rounded-lg hover:border-indigo-300 transition-colors"
        >
          관리자
        </Link>
      </div>

      {/* 모바일 전용 탭 네비게이션 */}
      <nav className="md:hidden flex items-center border-t border-gray-100 text-sm font-medium">
        {TABS.map(t => (
          <Link
            key={t.key}
            href={t.href}
            className={`flex-1 text-center py-2.5 transition-colors ${
              active === t.key
                ? 'text-indigo-700 font-bold border-b-2 border-indigo-600'
                : 'text-gray-500 hover:text-indigo-600'
            }`}
          >
            {t.label}
          </Link>
        ))}
      </nav>
    </header>
  );
}
