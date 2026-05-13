'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { CalendarDays, MessageCircle, Bell, BarChart2 } from 'lucide-react';

const NAV_ITEMS = [
  { href: '/',          icon: CalendarDays,  label: '달력'     },
  { href: '/community', icon: MessageCircle, label: '커뮤니티' },
  { href: '/subscribe', icon: Bell,          label: '알림신청' },
  { href: '/stats',     icon: BarChart2,     label: '통계'     },
];

export default function MobileNav() {
  const pathname = usePathname();

  if (pathname.startsWith('/admin')) return null;

  return (
    /* flex로 명시 — md 이상에서만 hidden */
    <nav className="flex md:hidden fixed bottom-0 left-0 right-0 z-[999] bg-white border-t border-gray-200 shadow-[0_-2px_8px_rgba(0,0,0,0.06)]">
      {NAV_ITEMS.map(({ href, icon: Icon, label }) => {
        const isActive = pathname === href;
        return (
          <Link
            key={href}
            href={href}
            className={`flex-1 flex flex-col items-center justify-center gap-0.5 py-2 text-[11px] font-medium transition-colors ${
              isActive ? 'text-indigo-600' : 'text-gray-400'
            }`}
          >
            <Icon
              size={22}
              strokeWidth={isActive ? 2.5 : 1.8}
            />
            <span>{label}</span>
          </Link>
        );
      })}
    </nav>
  );
}
