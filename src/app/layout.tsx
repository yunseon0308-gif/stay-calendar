import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import Script from "next/script";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const ADSENSE_CLIENT = process.env.NEXT_PUBLIC_ADSENSE_CLIENT || '';

export const metadata: Metadata = {
  metadataBase: new URL('https://stay-calendar.vercel.app'),
  title: "스테이달력 - 공유숙박업 단가관리 필수 행사 캘린더",
  description: "콘서트, 축제, 불꽃놀이 등 숙박 수요를 높이는 대형 행사 일정을 한눈에! 공유숙박업 자영업자를 위한 단가 조정 필수 캘린더.",
  keywords: "공유숙박, 에어비앤비, 단가조정, 콘서트 일정, 축제 일정, 숙박업 캘린더",
  openGraph: {
    title: "스테이달력 - 공유숙박업 단가관리 필수 캘린더",
    description: "BTS 콘서트, 불꽃축제 등 숙박 수요 폭증 행사를 미리 파악하고 단가를 올리세요!",
    images: [{ url: '/api/og', width: 1200, height: 630, alt: '스테이달력 프리뷰' }],
    type: 'website',
    locale: 'ko_KR',
    siteName: '스테이달력',
  },
  twitter: {
    card: 'summary_large_image',
    title: "스테이달력 - 공유숙박업 단가관리",
    description: "행사 일정 미리 파악하고 단가 조정으로 수익 극대화!",
    images: ['/api/og'],
  },
};

export default function RootLayout({
  children,
  modal,
}: Readonly<{
  children: React.ReactNode;
  modal: React.ReactNode;
}>) {
  return (
    <html
      lang="ko"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        {children}
        {modal}
        {ADSENSE_CLIENT && (
          <Script
            async
            src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${ADSENSE_CLIENT}`}
            crossOrigin="anonymous"
            strategy="afterInteractive"
          />
        )}
      </body>
    </html>
  );
}
