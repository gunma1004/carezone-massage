import { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "투명한 코스별 웰니스 테라피 요금 안내 | 케어존마사지",
  description:
    "케어존마사지 정찰제 기반 프로그램별 이용 요금 안내. 타이 건식 릴렉스, 아로마 케어, 감성 스웨디시 등 투명하고 정직한 테라피 코스 비용을 확인하세요.",
  keywords: [
    "케어존마사지가격",
    "마사지가격",
    "스웨디시가격",
    "타이마사지가격",
    "아로마마사지가격",
    "마사지할인요금",
    "수도권정찰제마사지",
  ],
  alternates: {
    canonical: "https://carezone-massage.netlify.app/prices",
  },
  openGraph: {
    title: "투명한 코스별 웰니스 테라피 요금 가이드 | 케어존마사지",
    description:
      "수도권 전지역 엄선된 제휴 네트워크! 투명하고 합리적인 힐링 바디 테라피 정찰 요금 안내.",
    url: "https://carezone-massage.netlify.app/prices",
    siteName: "케어존마사지",
    locale: "ko_KR",
    type: "website",
  },
};

interface PriceItem {
  title: string;
  price: string;
  priceNumber: number;
  desc: string;
  tag: string;
}

const priceList: PriceItem[] = [
  {
    title: "타이 건식 릴렉스 케어 (60분)",
    price: "60,000원부터",
    priceNumber: 60000,
    desc: "굳은 근육을 부드럽게 이완하고 전신 유연성을 회복시켜 주는 기본 스트레칭 프로그램",
    tag: "기본 피로회복",
  },
  {
    title: "아로마 오일 힐링 케어 (60분)",
    price: "70,000원부터",
    priceNumber: 70000,
    desc: "식물성 천연 에센셜 오일을 활용하여 심신 안정과 전신 순환을 돕는 부드러운 릴렉싱 코스",
    tag: "보습 & 릴렉스",
  },
  {
    title: "감성 스웨디시 테라피 (60분)",
    price: "90,000원부터",
    priceNumber: 90000,
    desc: "섬세한 터칭 기법으로 체내 림프 순환과 깊은 휴식을 선사하는 VIP 프리미엄 프로그램",
    tag: "감성 힐링",
  },
  {
    title: "한국인 베테랑 VIP 시그니처 (60분)",
    price: "140,000원부터",
    priceNumber: 140000,
    desc: "숙련된 전문 테라피스트의 체형별 1:1 맞춤형 피로 해소 및 딥 릴렉스 솔루션",
    tag: "최고급 맞춤형",
  },
];

export default function PricesPage() {
  // 검색엔진 가격 및 상품 카탈로그 구조화 데이터 (JSON-LD)
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "OfferCatalog",
    name: "케어존마사지 코스별 이용 요금표",
    itemListElement: priceList.map((item) => ({
      "@type": "Offer",
      name: item.title,
      description: item.desc,
      price: item.priceNumber,
      priceCurrency: "KRW",
      availability: "https://schema.org/InStock",
      seller: {
        "@type": "Organization",
        name: "케어존마사지",
        url: "https://carezone-massage.netlify.app",
      },
    })),
  };

  return (
    <div className="bg-[#070709] text-gray-100 min-h-screen py-10 px-4 font-sans selection:bg-amber-500 selection:text-black">
      {/* 구조화 데이터 스크립트 */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <div className="max-w-3xl mx-auto space-y-8">
        {/* 상단 타이틀 헤더 */}
        <div className="text-center space-y-2">
          <span className="text-amber-400 text-xs font-bold tracking-widest uppercase">
            TRANSPARENT PRICE SYSTEM
          </span>
          <h1 className="text-2xl md:text-3xl font-black text-white">
            투명한 코스별 이용 요금 안내
          </h1>
          <p className="text-xs md:text-sm text-gray-400">
            투명한 정찰제 가격 안내 / 안심 제휴 네트워크 가이드
          </p>
        </div>

        {/* 정찰제 안심 약속 공지 배너 */}
        <div className="bg-gradient-to-r from-amber-500/10 via-amber-500/5 to-transparent border-l-4 border-amber-500 p-4 rounded-2xl">
          <p className="text-xs md:text-sm font-bold text-amber-300">
            🔒 케어존마사지 안심 약속: 투명하고 정직한 정찰제 요금 체계를 지향합니다.
          </p>
          <p className="text-[11px] text-gray-400 mt-1">
            모든 제휴 업체는 명시된 표준 코스 가이드라인을 준수하며 부당한 추가 요금을 요구하지 않습니다.
          </p>
        </div>

        {/* 요금 카드 목록 */}
        <div className="space-y-4">
          {priceList.map((item, idx) => (
            <div
              key={idx}
              className="bg-[#111114] border border-amber-500/20 hover:border-amber-500/50 p-5 rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-3 transition-all shadow-md"
            >
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <h2 className="font-bold text-white text-sm md:text-base">
                    {item.title}
                  </h2>
                  <span className="text-[10px] text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded-md border border-amber-500/30">
                    {item.tag}
                  </span>
                </div>
                <p className="text-xs text-gray-400 leading-relaxed">{item.desc}</p>
              </div>
              <div className="self-end sm:self-center">
                <span className="text-amber-400 font-black text-sm md:text-base bg-black/60 px-4 py-2 rounded-xl border border-amber-500/30 shadow-inner whitespace-nowrap">
                  {item.price}
                </span>
              </div>
            </div>
          ))}
        </div>

        {/* 추가 이용 팁 안내 */}
        <div className="bg-[#0e0e12] border border-white/10 p-5 rounded-2xl space-y-2 text-xs text-gray-400 leading-relaxed">
          <h3 className="text-white font-bold flex items-center gap-1.5">
            <span>💡</span> 요금 및 이용 시간 안내
          </h3>
          <p>
            • 기본 코스는 60분 기준이며, 90분·120분 등 맞춤 시간 선택 시 보다 여유로운 집중 관리가 가능합니다.
          </p>
          <p>
            • 각 제휴 샵의 세부 코스 옵션 및 프로모션 혜택은 유선 상담 시 즉시 확인하실 수 있습니다.
          </p>
          <div className="pt-1">
            <Link
              href="/services"
              className="text-xs text-amber-400 hover:text-amber-300 font-bold underline underline-offset-4"
            >
              프로그램별 상세 특징 비교하기 →
            </Link>
          </div>
        </div>

        {/* 하단 CTA 버튼 */}
        <div className="flex flex-col sm:flex-row justify-center items-center gap-3 pt-4">
          <Link
            href="/"
            className="w-full sm:w-auto text-center inline-flex items-center justify-center gap-1.5 bg-neutral-900 hover:bg-neutral-800 text-amber-400 font-bold text-xs px-5 py-3 rounded-2xl border border-amber-500/30 transition-all shadow-md"
          >
            <span>🏠</span> 케어존마사지 메인으로
          </Link>
          <a
            href="tel:0507-1280-3344"
            className="w-full sm:w-auto text-center inline-flex items-center justify-center gap-1.5 bg-gradient-to-r from-amber-500 to-yellow-400 hover:from-amber-400 hover:to-yellow-300 text-black font-extrabold text-xs px-6 py-3 rounded-2xl shadow-md transition-all active:scale-95"
          >
            📞 코스 실시간 문의
          </a>
        </div>
      </div>
    </div>
  );
}