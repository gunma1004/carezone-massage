import { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "수도권 미식 & 힐링 쉼터 가이드 | 케어존마사지",
  description:
    "서울, 경기, 인천 주요 도심 내 엄선된 미식 명소와 안락한 휴식 공간 가이드. 하루의 피로를 풀고 여유를 더하는 웰니스 플레이스를 케어존마사지에서 확인하세요.",
  keywords: [
    "케어존마사지",
    "수도권힐링플레이스",
    "서울휴식공간",
    "경기힐링카페",
    "인천미식명소",
    "도심속쉼터",
    "웰니스플레이스",
  ],
  alternates: {
    canonical: "https://carezone-massage.netlify.app/places",
  },
  openGraph: {
    title: "수도권 힐링 플레이스 & 편안한 휴식 공간 가이드 | 케어존마사지",
    description: "서울·경기·인천 도심 속 쾌적한 쉼터와 프라이빗 미식 공간 정보 안내.",
    url: "https://carezone-massage.netlify.app/places",
    siteName: "케어존마사지",
    locale: "ko_KR",
    type: "website",
  },
};

interface PlaceItem {
  id: number;
  region: string;
  category: string;
  name: string;
  desc: string;
  tag: string;
}

const recommendedPlaces: PlaceItem[] = [
  {
    id: 1,
    region: "서울 강남권",
    category: "미식 & 다이닝",
    name: "도심 속 정갈한 프라이빗 한식 다이닝",
    desc: "바쁜 비즈니스 일정 후 조용하고 프라이빗한 룸에서 즐기는 건강한 제철 한정식 코스.",
    tag: "#프라이빗룸 #건강식 #조용한분위기",
  },
  {
    id: 2,
    region: "서울 마포·홍대권",
    category: "감성 카페 & 티 라운지",
    name: "숲길 뷰 릴렉싱 티 라운지",
    desc: "경의선 숲길을 조망하며 프리미엄 블렌딩 티와 디저트로 여유로운 오후를 보낼 수 있는 힐링 공간.",
    tag: "#티테라피 #힐링뷰 #도심속쉼터",
  },
  {
    id: 3,
    region: "경기 수원·판교권",
    category: "프리미엄 부티크 스테이",
    name: "비즈니스 부티크 호텔 라운지",
    desc: "쾌적한 객실 컨디션과 최고급 침구, 정갈한 조식 서비스로 비즈니스 피로를 말끔히 해소하는 공간.",
    tag: "#호캉스 #쾌적한룸 #완벽한휴식",
  },
  {
    id: 4,
    region: "인천 송도·청라권",
    category: "오션 라운지 & 다이닝",
    name: "센트럴파크 선셋 레스토랑",
    desc: "이국적인 송도 센트럴파크 야경과 함께 여유로운 식사를 즐길 수 있는 감성 미식 스팟.",
    tag: "#야경명소 #데이트코스 #여유로운저녁",
  },
];

export default function PlacesPage() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    itemListElement: recommendedPlaces.map((place, idx) => ({
      "@type": "ListItem",
      position: idx + 1,
      item: {
        "@type": "Place",
        name: place.name,
        description: place.desc,
        address: {
          "@type": "PostalAddress",
          addressRegion: place.region,
          addressCountry: "KR",
        },
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

      <div className="max-w-4xl mx-auto space-y-10">
        {/* 상단 타이틀 배너 */}
        <div className="text-center space-y-3">
          <span className="text-amber-400 text-xs font-bold tracking-widest uppercase">
            LOCAL WELLNESS PLACES & STAY
          </span>
          <h1 className="text-2xl md:text-3xl font-black text-white">
            내 주변 맛집 & 편안한 휴식 공간
          </h1>
          <p className="text-xs md:text-sm text-gray-400 max-w-lg mx-auto leading-relaxed">
            수도권 주요 도심 속에서 찾은 미식 명소와 일상의 긴장을 내려놓을 수 있는 안락한 쉼터 정보를 소개합니다.
          </p>
        </div>

        {/* 상단 소개 박스 */}
        <div className="bg-[#111114] border border-amber-500/20 p-6 rounded-3xl text-center space-y-2 shadow-lg">
          <p className="text-xs md:text-sm text-gray-300 font-medium">
            ✨ 서울, 경기, 인천 주요 거점의 쾌적한 휴식 공간과 프라이빗 핫플레이스를 엄선했습니다.
          </p>
          <p className="text-[11px] text-gray-500">
            복잡한 일상에서 벗어나 몸과 마음의 균형을 되찾는 여유로운 시간을 가져보세요.
          </p>
        </div>

        {/* 큐레이션 리스트 */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {recommendedPlaces.map((place) => (
            <div
              key={place.id}
              className="bg-[#111114] border border-white/10 hover:border-amber-500/40 p-5 rounded-2xl space-y-3 transition-all group flex flex-col justify-between"
            >
              <div className="space-y-2">
                <div className="flex justify-between items-center text-xs">
                  <span className="text-amber-400 font-bold bg-amber-500/10 px-2.5 py-1 rounded-lg border border-amber-500/20">
                    {place.region}
                  </span>
                  <span className="text-gray-400 text-[11px] font-semibold">
                    {place.category}
                  </span>
                </div>
                <div>
                  <h2 className="text-base font-black text-white group-hover:text-amber-300 transition-colors">
                    {place.name}
                  </h2>
                  <p className="text-xs text-gray-400 mt-1.5 leading-relaxed">
                    {place.desc}
                  </p>
                </div>
              </div>
              <div className="pt-2 border-t border-white/5 text-[11px] text-gray-500">
                {place.tag}
              </div>
            </div>
          ))}
        </div>

        {/* 하단 이동 & CTA 버튼 */}
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
            📞 제휴 및 입점 문의
          </a>
        </div>
      </div>
    </div>
  );
}