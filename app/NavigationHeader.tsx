"use client";

import { useState } from "react";
import Link from "next/link";

export default function NavigationHeader() {
  const [isRegionOpen, setIsRegionOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 bg-[#070709]/95 backdrop-blur-xl border-b border-amber-500/20 px-4 py-3 shadow-[0_4px_20px_rgba(245,158,11,0.08)]">
      <div className="max-w-5xl mx-auto flex items-center justify-between">
        {/* 로고 영역 */}
        <Link href="/" className="flex items-center gap-2.5 group">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-amber-400 to-amber-600 flex items-center justify-center font-black text-black text-lg shadow-[0_0_12px_rgba(245,158,11,0.4)] group-hover:scale-105 transition-transform flex-shrink-0">
            C
          </div>
          <div className="flex flex-col">
            <span className="text-lg font-black tracking-wider bg-gradient-to-r from-amber-300 via-amber-400 to-yellow-500 bg-clip-text text-transparent">
              케어존마사지
            </span>
            <span className="text-[9px] text-gray-400 tracking-tighter hidden sm:block">
              CAREZONE MASSAGE
            </span>
          </div>
        </Link>

        {/* 데스크톱 카테고리 메뉴 목록 */}
        <nav className="hidden md:flex items-center gap-6 text-xs font-bold text-gray-300">
          {/* 1. 프로그램 안내 */}
          <Link
            href="/services"
            className="hover:text-amber-400 transition-colors flex items-center gap-1"
          >
            프로그램
          </Link>

          {/* 2. 코스비용 */}
          <Link
            href="/prices"
            className="hover:text-amber-400 transition-colors flex items-center gap-1"
          >
            코스비용
          </Link>

          {/* 3. 지역여행 */}
          <Link
            href="/travel"
            className="hover:text-amber-400 transition-colors flex items-center gap-1"
          >
            지역여행
          </Link>

          {/* 4. 맛집·숙소 */}
          <Link
            href="/places"
            className="hover:text-amber-400 transition-colors flex items-center gap-1"
          >
            맛집·숙소
          </Link>

          {/* 5. 지역안내 (드롭다운) */}
          <div
            className="relative cursor-pointer py-2"
            onMouseEnter={() => setIsRegionOpen(true)}
            onMouseLeave={() => setIsRegionOpen(false)}
          >
            <button
              type="button"
              className="hover:text-amber-400 transition-colors flex items-center gap-1 text-xs font-bold text-gray-300 outline-none"
            >
              지역안내
              <span className="text-[10px] text-amber-400">▼</span>
            </button>

            {isRegionOpen && (
              <div className="absolute top-full left-0 w-36 bg-[#121215] border border-amber-500/30 rounded-2xl shadow-2xl py-2 space-y-1 text-xs z-50">
                <Link
                  href="/seoul/서울특별시"
                  className="block px-4 py-2 hover:bg-amber-500/10 hover:text-amber-400 transition-colors"
                >
                  📍 서울 권역
                </Link>
                <Link
                  href="/gyeonggi/경기도"
                  className="block px-4 py-2 hover:bg-amber-500/10 hover:text-amber-400 transition-colors"
                >
                  📍 경기 권역
                </Link>
                <Link
                  href="/incheon/인천광역시"
                  className="block px-4 py-2 hover:bg-amber-500/10 hover:text-amber-400 transition-colors"
                >
                  📍 인천 권역
                </Link>
              </div>
            )}
          </div>

          {/* 6. 이용후기 */}
          <Link
            href="/reviews"
            className="text-amber-400 font-extrabold hover:text-yellow-300 transition-colors flex items-center gap-1 bg-amber-500/10 px-3 py-1.5 rounded-xl border border-amber-500/30"
          >
            <span>💬</span> 이용후기
          </Link>
        </nav>

        {/* 우측 빠른 문의 CTA 및 모바일 햄버거 버튼 */}
        <div className="flex items-center gap-2">
          <a
            href="tel:0507-1280-3344"
            className="bg-gradient-to-r from-amber-500 to-yellow-400 text-black font-extrabold text-xs px-3.5 py-2 rounded-xl shadow transition-all active:scale-95 hover:brightness-105"
          >
            📞 빠른 문의
          </a>

          {/* 모바일 햄버거 토글 버튼 */}
          <button
            type="button"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="md:hidden p-2 text-gray-300 hover:text-amber-400 rounded-lg border border-white/10"
            aria-label="메뉴 열기"
          >
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              {isMobileMenuOpen ? (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              ) : (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16M4 18h16"
                />
              )}
            </svg>
          </button>
        </div>
      </div>

      {/* 모바일 슬라이드/드롭 메뉴 (검색엔진 크롤링 지원) */}
      {isMobileMenuOpen && (
        <div className="md:hidden border-t border-white/10 mt-3 pt-3 space-y-2 text-xs font-bold text-gray-300">
          <Link
            href="/services"
            onClick={() => setIsMobileMenuOpen(false)}
            className="block px-3 py-2 rounded-lg hover:bg-neutral-900 hover:text-amber-400"
          >
            프로그램
          </Link>
          <Link
            href="/prices"
            onClick={() => setIsMobileMenuOpen(false)}
            className="block px-3 py-2 rounded-lg hover:bg-neutral-900 hover:text-amber-400"
          >
            코스비용
          </Link>
          <Link
            href="/travel"
            onClick={() => setIsMobileMenuOpen(false)}
            className="block px-3 py-2 rounded-lg hover:bg-neutral-900 hover:text-amber-400"
          >
            지역여행
          </Link>
          <Link
            href="/places"
            onClick={() => setIsMobileMenuOpen(false)}
            className="block px-3 py-2 rounded-lg hover:bg-neutral-900 hover:text-amber-400"
          >
            맛집·숙소
          </Link>
          <div className="px-3 py-2 bg-neutral-900/60 rounded-xl space-y-1">
            <span className="text-[11px] text-amber-400 block font-bold">
              지역별 마사지
            </span>
            <div className="flex gap-2 pt-1">
              <Link
                href="/seoul/서울특별시"
                onClick={() => setIsMobileMenuOpen(false)}
                className="text-[11px] bg-black/50 px-2.5 py-1 rounded-md text-gray-300"
              >
                서울
              </Link>
              <Link
                href="/gyeonggi/경기도"
                onClick={() => setIsMobileMenuOpen(false)}
                className="text-[11px] bg-black/50 px-2.5 py-1 rounded-md text-gray-300"
              >
                경기
              </Link>
              <Link
                href="/incheon/인천광역시"
                onClick={() => setIsMobileMenuOpen(false)}
                className="text-[11px] bg-black/50 px-2.5 py-1 rounded-md text-gray-300"
              >
                인천
              </Link>
            </div>
          </div>
          <Link
            href="/reviews"
            onClick={() => setIsMobileMenuOpen(false)}
            className="block px-3 py-2 rounded-lg text-amber-400 hover:bg-amber-500/10"
          >
            💬 이용후기
          </Link>
        </div>
      )}
    </header>
  );
}