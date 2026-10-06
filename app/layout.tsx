// app/layout.tsx
import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  metadataBase: new URL('https://carezone-massage.netlify.app'),
  title: {
    default: '경기·인천·서울 출장 힐링케어 마사지 할인 예약 플랫폼 | 케어존마사지 ',
    template: '%s | 케어존마사지',
  },
  description:
    '서울, 인천, 경기 출장마사지, 스웨디시, 타이, 아로마 힐링 케어 정보 및 최저가 제휴 할인 플랫폼 케어존마사지입니다.',
  keywords: [
    '케어존마사지',
    '서울마사지',
    '경기마사지',
    '인천마사지',
    '스웨디시',
    '타이마사지',
    '아로마마사지',
    '마사지할인',
  ],
  authors: [{ name: '케어존마사지' }],
  creator: '케어존마사지',
  openGraph: {
    type: 'website',
    locale: 'ko_KR',
    url: 'https://carezone-massage.netlify.app',
    siteName: '케어존마사지',
    title: '경기·인천·서울 출장 힐링케어 마사지 할인 예약 플랫폼 | 케어존마사지 ',
    description:
      '서울, 인천, 경기 출장마사지, 스웨디시, 타이, 아로마 힐링 케어 정보 및 최저가 제휴 할인 정보 제공.',
    images: [
      {
        url: '/og-image.png', // public/og-image.png (권장: 1200x630px)
        width: 1200,
        height: 630,
        alt: '케어존마사지',
      },
    ],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
    },
  },
  // 네이버 서치어드바이저 소유권 확인 태그 (발급받은 코드 입력)
  verification: {
    other: {
      'naver-site-verification': '9992595a7b731f47f23a2ac97bd1c3c1f93cb664',
    },
  },
  alternates: {
    canonical: 'https://carezone-massage.netlify.app',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ko">
      <body>{children}</body>
    </html>
  );
}