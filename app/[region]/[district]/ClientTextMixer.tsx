"use client";

import { useMemo } from "react";
import Link from "next/link";

interface ShopItem {
  id: number | string;
  name: string;
  desc: string;
  phone: string;
  price: string;
  image: string;
}

interface ClientTextMixerProps {
  region: string;
  district: string;
  dongName?: string;
  shops?: ShopItem[];
}

// 🌟 요청하신 SEO 규칙 적용 패턴 10종:
// - "출장"과 "마사지" 사이에 세부 카테고리(웰니스/타이/아로마/스웨디시 등) 결합
// - {지역} 출장 홈 마사지 안내문구 조화
const WELLNESS_PATTERNS = [
  "출장 웰니스 마사지 & 프리미엄 바디케어 안내",
  "출장 타이 마사지 & 전신 릴렉스 프로그램",
  "출장 아로마 마사지 & 천연 오일 순환 케어",
  "출장 스웨디시 마사지 & 감성 힐링 테라피",
  "출장 프라이빗 마사지 & 1:1 맞춤형 바디 관리",
  "출장 딥티슈 마사지 & 집중 피로회복 솔루션",
  "출장 림프케어 마사지 & 바디 밸런스 트리트먼트",
  "출장 건식 릴렉스 마사지 & 전신 스트레칭",
  "출장 안심 케어 마사지 & 표준 정찰제 가이드",
  "출장 나이트 힐링 마사지 & 편안한 이완 케어"
];

// 기본 제휴점 데이터
const defaultShops: ShopItem[] = [
  {
    id: 1,
    name: "🔥 한국미녀테라피",
    desc: "굳은 근육을 부드럽게 이완하는 건식 타이 & 딥 릴렉스 전문 센터",
    phone: "0507-1280-3140",
    price: "110,000원부터~",
    image: "/shop1.jpg"
  },
  {
    id: 2,
    name: "✨ 오늘밤테라피",
    desc: "천연 에센셜 오일과 정교한 핸드 테크닉의 프리미엄 아로마 바디 순환 케어",
    phone: "0507-1280-3199",
    price: "60,000원부터~",
    image: "/shop2.jpg"
  },
  {
    id: 3,
    name: "💎 주주홈타이",
    desc: "타이와 아로마를 결합한 VIP 시그니처 힐링 프로그램",
    phone: "0507-1280-3197",
    price: "60,000원부터~",
    image: "/shop3.jpg"
  },
  {
    id: 4,
    name: "🌟 한국골든테라피",
    desc: "정직한 정찰제 운영과 편안한 힐링을 약속하는 감성 스웨디시",
    phone: "0507-1280-3360",
    price: "60,000원부터~",
    image: "/shop4.jpg"
  },
  {
    id: 5,
    name: "👑 퀸즈홈테라피",
    desc: "전문 테라피스트들의 1:1 맞춤형 VIP 피로회복 웰니스 케어",
    phone: "0507-1280-3296",
    price: "60,000원부터~",
    image: "/shop5.jpg"
  }
];

export default function ClientTextMixer({
  region,
  district,
  dongName,
  shops = defaultShops
}: ClientTextMixerProps) {
  // 동 명칭 유무에 따른 지역 키워드
  const locationText = dongName ? `${district} ${dongName}`.trim() : `${district}`.trim();

  // 지역별 고유 인트로 텍스트 조합 (SSR/CSR 불일치 없는 해시 인덱싱)
  const introText = useMemo(() => {
    if (!locationText) return `출장 웰니스 마사지 & 바디케어 안내`;
    const index =
      Math.abs(
        locationText
          .split("")
          .reduce((acc, char) => acc + char.charCodeAt(0), 0)
      ) % WELLNESS_PATTERNS.length;
    return `${locationText} ${WELLNESS_PATTERNS[index]}`;
  }, [locationText]);

  return (
    <div className="space-y-8">
      {/* 1. 지역 단위 상단 클린 키워드 배너 */}
      <div className="bg-amber-500/10 border border-amber-500/30 p-4 rounded-2xl text-center shadow-inner">
        <p className="text-xs md:text-sm font-black text-amber-300 tracking-wide">
          ✨ {introText}
        </p>
        <p className="text-[11px] text-gray-400 mt-1">
          {locationText} 출장 홈 마사지 정찰제 추천 코스를 케어존마사지에서 편리하게 확인하세요.
        </p>
      </div>

      {/* 2. 제휴 샵 리스트 */}
      <section className="space-y-4">
        <div className="flex justify-between items-center">
          <h2 className="text-sm font-black text-amber-400 tracking-wider uppercase">
            🏆 {locationText} 추천 제휴점 안내
          </h2>
          <span className="text-[11px] text-gray-500">표준 정찰제 제휴 센터</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {shops.map((shop) => {
            // 동이 있으면 /[region]/[district]/[dong]/shop/[id], 없으면 /[region]/[district]/shop/[id]
            const shopDetailUrl = dongName
              ? `/${region}/${encodeURIComponent(district)}/${encodeURIComponent(dongName)}/shop/${shop.id}`
              : `/${region}/${encodeURIComponent(district)}/shop/${shop.id}`;

            return (
              <div
                key={shop.id}
                className="bg-gradient-to-br from-[#161619] to-[#101013] border border-amber-500/25 hover:border-amber-400 rounded-2xl p-4 flex gap-4 items-center shadow-lg transition-all group relative"
              >
                {/* 카드 전체 클릭 시 상세 URL 이동 */}
                <Link
                  href={shopDetailUrl}
                  className="absolute inset-0 z-10"
                  aria-label={`${shop.name} (${locationText}) 상세 코스 및 요금 보기`}
                />

                <div className="w-20 h-20 md:w-24 md:h-24 rounded-xl overflow-hidden shrink-0 border border-amber-500/30">
                  <img
                    src={shop.image}
                    alt={`${shop.name} ${locationText}`}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                  />
                </div>

                <div className="flex-1 min-w-0">
                  <h3 className="font-extrabold text-sm md:text-base text-white truncate group-hover:text-amber-400 transition-colors">
                    {shop.name}
                  </h3>
                  <p className="text-[11px] text-gray-300 mt-1 line-clamp-2 leading-relaxed">
                    {shop.desc}
                  </p>
                  <div className="mt-2.5 flex items-center justify-between">
                    <span className="text-xs font-black text-amber-300">{shop.price}</span>

                    {/* 유선 연결 버튼 (z-20으로 카드 링크와 분리) */}
                    <a
                      href={`tel:${shop.phone.replace(/-/g, "")}`}
                      className="bg-gradient-to-r from-amber-500 to-yellow-400 hover:from-amber-400 hover:to-yellow-300 text-black font-black text-xs px-3.5 py-1.5 rounded-xl shadow transition-all relative z-20"
                    >
                      전화연결
                    </a>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </section>
    </div>
  );
}