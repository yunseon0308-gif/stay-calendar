import Link from 'next/link';

export const metadata = {
  title: '개인정보처리방침 | 스테이달력',
  description: '스테이달력 개인정보처리방침',
};

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b border-gray-100 shadow-sm">
        <div className="max-w-3xl mx-auto px-4 py-4 flex items-center gap-3">
          <Link href="/" className="text-xl font-black text-indigo-700 tracking-tight">
            🏨 스테이달력
          </Link>
          <span className="text-gray-300">/</span>
          <span className="text-sm text-gray-500">개인정보처리방침</span>
        </div>
      </header>

      <main className="max-w-3xl mx-auto px-4 py-10">
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-8 space-y-8 text-sm text-gray-700 leading-relaxed">

          <div>
            <h1 className="text-2xl font-bold text-gray-900 mb-2">개인정보처리방침</h1>
            <p className="text-gray-400 text-xs">최종 수정일: 2026년 5월 11일</p>
          </div>

          <p>
            스테이달력(이하 "본 서비스")은 이용자의 개인정보를 중요하게 생각하며,
            「개인정보 보호법」 및 관련 법령에 따라 이용자의 개인정보를 보호하고 있습니다.
            본 방침은 본 서비스가 어떤 정보를 수집하고, 어떻게 사용하는지 안내합니다.
          </p>

          <section>
            <h2 className="text-base font-bold text-gray-900 mb-2">1. 수집하는 개인정보 항목</h2>
            <p>본 서비스는 별도의 회원가입 없이 이용 가능하며, 현재 다음의 정보만 자동으로 수집됩니다.</p>
            <ul className="mt-2 space-y-1 list-disc list-inside text-gray-600">
              <li>서비스 이용 기록 (접속 IP, 접속 시간, 브라우저 종류)</li>
              <li>쿠키 및 유사 기술을 통한 이용 패턴 (Google Analytics, AdSense)</li>
            </ul>
          </section>

          <section>
            <h2 className="text-base font-bold text-gray-900 mb-2">2. 개인정보 수집 및 이용 목적</h2>
            <ul className="space-y-1 list-disc list-inside text-gray-600">
              <li>서비스 운영 및 개선</li>
              <li>방문 통계 분석 (Google Analytics)</li>
              <li>맞춤형 광고 제공 (Google AdSense)</li>
            </ul>
          </section>

          <section>
            <h2 className="text-base font-bold text-gray-900 mb-2">3. 개인정보 보유 및 이용 기간</h2>
            <p>
              수집된 개인정보는 이용 목적 달성 후 지체 없이 파기합니다.
              단, 관련 법령에 따라 보존이 필요한 경우 해당 기간 동안 보관합니다.
            </p>
          </section>

          <section>
            <h2 className="text-base font-bold text-gray-900 mb-2">4. 제3자 제공</h2>
            <p>
              본 서비스는 이용자의 개인정보를 원칙적으로 외부에 제공하지 않습니다.
              단, Google AdSense 및 Google Analytics 사용으로 인해 Google LLC에
              서비스 이용 데이터가 전달될 수 있습니다.
              Google의 개인정보처리방침은{' '}
              <a
                href="https://policies.google.com/privacy"
                target="_blank"
                rel="noopener noreferrer"
                className="text-indigo-600 underline"
              >
                https://policies.google.com/privacy
              </a>
              에서 확인할 수 있습니다.
            </p>
          </section>

          <section>
            <h2 className="text-base font-bold text-gray-900 mb-2">5. 쿠키(Cookie) 사용</h2>
            <p>
              본 서비스는 Google AdSense 및 Analytics를 위해 쿠키를 사용합니다.
              이용자는 브라우저 설정을 통해 쿠키 저장을 거부할 수 있으나,
              이 경우 일부 서비스 이용이 제한될 수 있습니다.
            </p>
          </section>

          <section>
            <h2 className="text-base font-bold text-gray-900 mb-2">6. 개인정보 보호 책임자</h2>
            <ul className="space-y-1 text-gray-600">
              <li>책임자: 스테이달력 운영자</li>
              <li>
                이메일:{' '}
                <a href="mailto:cinemomo@naver.com" className="text-indigo-600 underline">
                  cinemomo@naver.com
                </a>
              </li>
            </ul>
          </section>

          <section>
            <h2 className="text-base font-bold text-gray-900 mb-2">7. 방침 변경 안내</h2>
            <p>
              본 개인정보처리방침은 법령·정책 변경에 따라 수정될 수 있으며,
              변경 시 본 페이지를 통해 공지합니다.
            </p>
          </section>

        </div>
      </main>

      <footer className="mt-8 pb-8 text-center text-xs text-gray-400">
        <p>© 2026 스테이달력</p>
        <Link href="/" className="mt-1 block hover:text-indigo-500">← 메인으로 돌아가기</Link>
      </footer>
    </div>
  );
}
