// app/[region]/[district]/[dong]/DongDetailClient.tsx
"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

interface DongDetailClientProps {
  region: string;
  districtName: string;
  dongName: string;
  regionFullName: string;
}

const initialShops = [
  {
    id: 1,
    name: "한국미녀테라피",
    desc: "지친 일상에 맞춤형 활력 충전! 전문 테라피스트의 정성 어린 감성 바디 테라피",
    phone: "0507-1280-3140",
    price: "110,000원부터~",
    image: "/shop1.jpg",
  },
  {
    id: 2,
    name: "오늘밤테라피",
    desc: "최고급 천연 아로마 오일을 활용한 전신 이완 및 림프 순환 케어 전문 프로그램",
    phone: "0507-1280-3199",
    price: "60,000원부터~",
    image: "/shop2.jpg",
  },
  {
    id: 3,
    name: "주주홈타이",
    desc: "재방문율 높은 안심 케어! 철저한 위생 관리와 품격 있는 정통 타이 & 릴렉싱",
    phone: "0507-1280-3197",
    price: "60,000원부터~",
    image: "/shop3.jpg",
  },
  {
    id: 4,
    name: "한국골든테라피",
    desc: "전문 힐러진의 맞춤형 바디 관리, 시간대별 편안한 VIP 피로회복 솔루션",
    phone: "0507-1280-3360",
    price: "60,000원부터~",
    image: "/shop4.jpg",
  },
  {
    id: 5,
    name: "퀸즈홈테라피",
    desc: "수도권 전지역 엄선된 파트너! 정직한 안내와 함께하는 프라이빗 힐링 테라피",
    phone: "0507-1280-3296",
    price: "60,000원부터~",
    image: "/shop5.jpg",
  },
];

export default function DongDetailClient({
  region,
  districtName,
  dongName,
  regionFullName,
}: DongDetailClientProps) {
  const [shops, setShops] = useState(initialShops);

  useEffect(() => {
    // Fisher-Yates 알고리즘으로 샵 순서 랜덤 변경
    const shuffled = [...initialShops];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    setShops(shuffled);
  }, []);

  const fullLocation = `${regionFullName} ${districtName} ${dongName}`;
  const shortLocation = `${districtName} ${dongName}`;

  return (
    <div className="bg-[#070709] text-gray-100 min-h-screen flex flex-col font-sans selection:bg-amber-500 selection:text-black pb-24">
      {/* 상단 헤더 */}
      <header className="sticky top-0 z-50 bg-[#050505]/90 backdrop-blur-xl border-b border-amber-500/20 px-4 py-3.5 shadow-[0_4px_20px_rgba(245,158,11,0.1)]">
        <div className="max-w-4xl mx-auto flex justify-between items-center">
          <Link href="/" className="flex items-center gap-2.5 group">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-amber-400 to-amber-600 flex items-center justify-center font-black text-black text-lg shadow-[0_0_12px_rgba(245,158,11,0.4)]">
              C
            </div>
            <div className="flex flex-col">
              <span className="text-lg font-black tracking-wider bg-gradient-to-r from-amber-300 via-amber-400 to-yellow-500 bg-clip-text text-transparent">
                케어존마사지
              </span>
              <span className="text-[9px] text-gray-400 tracking-tighter">
                CAREZONE DONG GUIDE
              </span>
            </div>
          </Link>
          <Link
            href={`/${region}/${encodeURIComponent(districtName)}`}
            className="text-xs font-bold text-amber-400 bg-amber-500/10 px-3 py-1.5 rounded-xl border border-amber-500/30 hover:bg-amber-500 hover:text-black transition-all"
          >
            ← {districtName} 전체보기
          </Link>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 py-8 w-full flex-1 space-y-8">
        {/* 타이틀 배너 */}
        <section className="bg-[#141418] border border-amber-500/30 rounded-3xl p-6 md:p-8 shadow-lg">
          <span className="text-amber-400 text-xs font-black tracking-widest uppercase mb-1 block">
            {districtName} · {dongName} WELLNESS DIRECTORY
          </span>
          <h1 className="text-2xl md:text-3xl font-black text-white">
            📍 {shortLocation} 마사지 안내
          </h1>
          <p className="text-xs md:text-sm text-gray-300 mt-2">
            {fullLocation} 고객님을 위한 힐링 바디케어 디렉토리입니다. 정직한 정찰제 요금표와 코스를 확인하세요.
          </p>
        </section>

        {/* 샵 리스트 */}
        <section className="space-y-4">
          <h2 className="text-sm font-black text-amber-400 tracking-wider uppercase">
            🏆 {shortLocation} 추천 제휴점
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {shops.map((shop) => (
              <div
                key={shop.id}
                className="bg-[#111114] border border-amber-500/20 hover:border-amber-500/60 rounded-2xl p-4 flex gap-4 items-center shadow-lg transition-all group relative"
              >
                <img
                  src={shop.image}
                  alt={`${shop.name} ${dongName}`}
                  className="w-20 h-20 md:w-24 md:h-24 rounded-xl object-cover border border-white/10 flex-shrink-0"
                />

                <div className="flex-1 min-w-0">
                  <h3 className="font-extrabold text-sm md:text-base text-white truncate group-hover:text-amber-400 transition-colors">
                    {shop.name} <span className="text-xs font-normal text-gray-400">({dongName})</span>
                  </h3>
                  <p className="text-[11px] text-gray-400 mt-1 line-clamp-2">
                    {shop.desc}
                  </p>
                  <div className="mt-2.5 flex items-center justify-between">
                    <span className="text-xs font-black text-amber-400">
                      {shop.price}
                    </span>
                    <a
                      href={`tel:${shop.phone.replace(/-/g, "")}`}
                      className="bg-gradient-to-r from-amber-500 to-yellow-400 text-black font-black text-xs px-3.5 py-1.5 rounded-xl shadow relative z-20 hover:brightness-105 active:scale-95 transition-all"
                    >
                      전화연결
                    </a>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* 하단 네비게이션 복귀 링크 */}
        <div className="pt-4 flex justify-center gap-3">
          <Link
            href="/"
            className="text-xs bg-neutral-900 border border-white/10 px-4 py-2 rounded-xl text-gray-400 hover:text-amber-400"
          >
            🏠 홈으로 돌아가기
          </Link>
          <Link
            href={`/${region}/${encodeURIComponent(districtName)}`}
            className="text-xs bg-neutral-900 border border-white/10 px-4 py-2 rounded-xl text-amber-400 hover:text-yellow-300"
          >
            📍 {districtName} 다른 동 보기
          </Link>
        </div>
      </main>
    </div>
  );
}