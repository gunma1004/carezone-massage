import { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "실제 이용 고객 생생 이용후기 | 케어존마사지",
  description:
    "케어존마사지 서울·경기·인천 실제 이용 고객님들의 솔직한 이용후기 모음. 전문 테라피스트의 수준 높은 바디 테라피와 힐링 케어 만족도를 직접 확인하세요.",
  keywords: [
    "케어존마사지후기",
    "마사지이용후기",
    "스웨디시후기",
    "타이마사지후기",
    "아로마테라피후기",
    "수도권마사지리뷰",
  ],
  alternates: {
    canonical: "https://carezone-massage.netlify.app/reviews",
  },
  openGraph: {
    title: "실제 이용 고객 솔직 후기 모음 | 케어존마사지",
    description:
      "수도권 실이용 고객들의 생생한 리뷰! 검증된 프리미엄 바디 웰니스 케어 만족도를 확인하세요.",
    url: "https://carezone-massage.netlify.app/reviews",
    siteName: "케어존마사지",
    locale: "ko_KR",
    type: "website",
  },
};

interface ReviewItem {
  name: string;
  ratingValue: number;
  rate: string;
  course: string;
  date: string;
  text: string;
}

const reviews: ReviewItem[] = [
  {
    name: "서울 강남구 직장인",
    ratingValue: 5,
    rate: "★★★★★ 5.0",
    course: "아로마 힐링 케어",
    date: "최근 이용",
    text: "바쁜 일정 후에 테라피를 받았는데 시간 맞춰 꼼꼼하게 진행해 주셨어요. 뭉쳐있던 승모근과 목 주변 피로가 시원하게 풀려서 아주 편안했습니다.",
  },
  {
    name: "경기 수원시 고객님",
    ratingValue: 5,
    rate: "★★★★★ 5.0",
    course: "타이 건식 릴렉스",
    date: "최근 이용",
    text: "안내받은 정찰제 코스 그대로 투명하게 진행되어 믿음이 갔습니다. 테라피스트 분의 친절한 매너와 숙련된 압 조절 기술도 인상 깊었습니다.",
  },
  {
    name: "인천 연수구 고객님",
    ratingValue: 5,
    rate: "★★★★★ 5.0",
    course: "VIP 감성 스웨디시",
    date: "최근 이용",
    text: "스웨디시 프로그램은 처음 접해봤는데 오일 향도 은은하고 전신 피로가 부드럽게 이완되네요. 정기적으로 컨디션 관리받으러 이용할 예정입니다.",
  },
  {
    name: "서울 마포구 고객님",
    ratingValue: 5,
    rate: "★★★★★ 5.0",
    course: "프라이빗 릴렉싱",
    date: "최근 이용",
    text: "번거롭게 멀리 이동할 필요 없이 가까운 샵에서 여유롭게 케어받을 수 있어 만족스럽습니다. 약속 시간도 정확히 지켜주셨어요.",
  },
  {
    name: "경기 성남 분당구 고객님",
    ratingValue: 5,
    rate: "★★★★★ 5.0",
    course: "VIP 시그니처 바디케어",
    date: "최근 이용",
    text: "공간 관리와 타월 위생 상태가 청결해서 안심하고 받았습니다. 세심한 1:1 맞춤 관리 덕분에 피로가 싹 가셨습니다.",
  },
];

export default function ReviewsPage() {
  // 네이버 및 구글 검색엔진용 후기/평점 구조화 데이터 (리치 스니펫)
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: "케어존마사지 웰니스 테라피 서비스",
    description: "서울, 경기, 인천 전지역 프리미엄 힐링 마사지 및 바디 테라피 제휴 안내",
    aggregateRating: {
      "@type": "AggregateRating",
      ratingValue: "4.9",
      reviewCount: reviews.length.toString(),
      bestRating: "5",
      worstRating: "1",
    },
    review: reviews.map((rev) => ({
      "@type": "Review",
      author: {
        "@type": "Person",
        name: rev.name,
      },
      reviewRating: {
        "@type": "Rating",
        ratingValue: rev.ratingValue,
        bestRating: "5",
      },
      reviewBody: rev.text,
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
        {/* 상단 타이틀 */}
        <div className="text-center space-y-2">
          <span className="text-amber-400 text-xs font-bold tracking-widest uppercase">
            REAL CUSTOMER REVIEWS
          </span>
          <h1 className="text-2xl md:text-3xl font-black text-white">
            실제 이용 고객 생생 이용후기
          </h1>
          <p className="text-xs md:text-sm text-gray-400">
            케어존마사지 제휴 샵을 경험한 고객님들의 진솔하고 투명한 평가입니다.
          </p>
        </div>

        {/* 평점 요약 배너 */}
        <div className="bg-[#111114] border border-amber-500/20 p-6 rounded-3xl flex flex-col sm:flex-row items-center justify-around gap-4 text-center shadow-lg">
          <div>
            <span className="text-3xl md:text-4xl font-black text-amber-400">
              4.9 / 5.0
            </span>
            <p className="text-xs text-gray-400 mt-1">고객 종합 만족도</p>
          </div>
          <div className="hidden sm:block w-px h-12 bg-white/10" />
          <div>
            <span className="text-xl md:text-2xl font-black text-white">
              정찰제 가이드
            </span>
            <p className="text-xs text-gray-400 mt-1">투명한 요금 체계</p>
          </div>
          <div className="hidden sm:block w-px h-12 bg-white/10" />
          <div>
            <span className="text-xl md:text-2xl font-black text-white">
              검증된 힐러
            </span>
            <p className="text-xs text-gray-400 mt-1">철저한 위생 및 매너</p>
          </div>
        </div>

        {/* 후기 카드 목록 */}
        <div className="space-y-4">
          {reviews.map((rev, idx) => (
            <div
              key={idx}
              className="bg-[#111114] border border-white/5 hover:border-amber-500/30 p-5 rounded-2xl space-y-2.5 transition-all shadow-md"
            >
              <div className="flex justify-between items-center text-xs">
                <div className="flex items-center gap-2">
                  <span className="text-amber-400 font-black">{rev.rate}</span>
                  <span className="bg-amber-500/10 text-amber-300 text-[10px] px-2 py-0.5 rounded-md border border-amber-500/20 font-semibold">
                    {rev.course}
                  </span>
                </div>
                <div className="flex items-center gap-2 text-gray-500 text-[11px]">
                  <span>{rev.name}</span>
                  <span>•</span>
                  <span>{rev.date}</span>
                </div>
              </div>
              <p className="text-xs md:text-sm text-gray-300 leading-relaxed font-medium">
                &quot;{rev.text}&quot;
              </p>
            </div>
          ))}
        </div>

        {/* 하단 링크 & CTA */}
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
            📞 빠른 코스 안내 받기
          </a>
        </div>
      </div>
    </div>
  );
}