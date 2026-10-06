// app/page.tsx
import { Metadata } from "next";
import MainClientUI from "./MainClientUI";

export const metadata: Metadata = {
  title: "서울·인천·경기 출장 프리미엄 마사지 & 바디 테라피 할인 플랫폼|케어존마사지 ",
  description:
    "서울, 인천, 경기 출장마사지 타이, 아로마, 스웨디시 웰니스 테라피 제휴 정보 및 최저가 할인을 편리하게 확인하세요.",
  keywords: [
    "케어존마사지",
    "서울출장 프리미엄 마사지",
    "경기출장 프리미엄 마사지",
    "인천출장 프리미엄 마사지",
    "스웨디시",
    "타이마사지",
    "아로마테라피",
    "수도권바디케어",
    "홈타이",
    "마사지할인",
    "프라이빗릴렉싱",
    "에스테틱케어"
  ],
  alternates: {
    canonical: "https://carezone-massage.netlify.app",
  },
  openGraph: {
    title: "서울·인천·경기 출장 프리미엄 마사지 & 바디 테라피 할인 플랫폼|케어존마사지 ",
    description:
      "서울, 인천, 경기 출장마사지 웰니스 테라피 제휴 정보를 비교하고 바로 확인해보세요.",
    url: "https://carezone-massage.netlify.app",
    siteName: "케어존마사지",
    locale: "ko_KR",
    type: "website",
    images: [
      {
        url: "/banner.jpg",
        width: 1200,
        height: 630,
        alt: "케어존마사지 대표 이미지",
      },
    ],
  },
};

export default function Page() {
  // 네이버 검색 로봇(Yeti) 색인 최적화를 위한 Schema.org 구조화 데이터
  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebSite",
        "@id": "https://carezone-massage.netlify.app/#website",
        url: "https://carezone-massage.netlify.app",
        name: "케어존마사지",
        description: "서울, 경기, 인천 전지역 출장 프리미엄 마사지 제휴 정보 플랫폼",
        inLanguage: "ko-KR",
      },
      {
        "@type": "Organization",
        "@id": "https://carezone-massage.netlify.app/#organization",
        name: "케어존마사지",
        url: "https://carezone-massage.netlify.app",
        telephone: "0507-1280-3344",
        contactPoint: {
          "@type": "ContactPoint",
          telephone: "0507-1280-3344",
          contactType: "customer service",
        },
      },
    ],
  };

  return (
    <>
      {/* 검색엔진 구조화 데이터 스크립트 */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <MainClientUI />
    </>
  );
}