import { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "수도권 힐링 여행지 & 드라이브 코스 가이드 | 케어존마사지",
  description:
    "서울, 경기, 인천 도심 근교 힐링 여행지와 야경 드라이브 코스 가이드. 맑은 공기와 자연 속에서 일상의 스트레스를 비워내는 추천 명소를 케어존마사지에서 확인하세요.",
  keywords: [
    "케어존마사지",
    "수도권 힐링 여행",
    "서울 드라이브 코스",
    "경기 근교 나들이",
    "인천 해안 드라이브",
    "힐링 명소",
    "야경 산책로"
  ],
  alternates: {
    canonical: "https://carezone-massage.netlify.app/travel",
  },
  openGraph: {
    title: "수도권 힐링 여행지 & 휴식 명소 가이드 | 케어존마사지",
    description: "서울·경기·인천 추천 산책로, 드라이브 코스 및 도심 근교 웰니스 쉼터 안내.",
    url: "https://carezone-massage.netlify.app/travel",
    siteName: "케어존마사지",
    locale: "ko_KR",
    type: "website",
  },
};

interface TravelSpot {
  region: string;
  regionLink: string;
  title: string;
  desc: string;
  tag: string;
}

const travelSpots: TravelSpot[] = [
  {
    region: "서울 코스",
    regionLink: "/seoul/서울특별시",
    title: "남산 둘레길 & 한강 야경 드라이브",
    desc: "도심 속 탁 트인 전망대와 시원한 강바람을 맞으며 하루의 긴장을 부드럽게 비워낼 수 있는 야경 코스입니다.",
    tag: "#도심야경 #산책로 #기분전환",
  },
  {
    region: "경기 코스",
    regionLink: "/gyeonggi/경기도",
    title: "가평 수목원 & 양평 두물머리 드라이브",
    desc: "울창한 숲길 산림욕과 잔잔한 강변 풍경을 바라보며 깊은 휴식을 누릴 수 있는 자연 친화적 코스입니다.",
    tag: "#자연속휴식 #산림욕 #물멍드라이브",
  },
  {
    region: "인천 코스",
    regionLink: "/incheon/인천광역시",
    title: "송도 센트럴파크 & 영종도 오션로드",
    desc: "이국적인 도심 수변 공원 산책과 서해 낙조를 감상하며 차분히 마음을 정리하기 좋은 해안 힐링 코스입니다.",
    tag: "#오션뷰 #일몰명소 #여유로운산책",
  },
  {
    region: "수도권 근교",
    regionLink: "/gyeonggi/경기도",
    title: "파주 마장호수 출렁다리 & 숲길 산책",
    desc: "넓은 호수를 따라 조성된 수변 데크길을 천천히 걸으며 신선한 공기를 마실 수 있는 쾌적한 쉼터입니다.",
    tag: "#호수산책 #주말나들이 #힐링로드",
  },
];

export default function TravelPage() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    itemListElement: travelSpots.map((spot, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: spot.title,
      description: spot.desc,
    })),
  };

  return (
    <div className="bg-[#070709] text-gray-100 min-h-screen py-10 px-4 font-sans selection:bg-amber-500 selection:text-black">
      {/* 구조화 데이터 */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <div className="max-w-4xl mx-auto space-y-10">
        
        {/* 상단 타이틀 */}
        <div className="text-center space-y-2">
          <span className="text-amber-400 text-xs font-bold tracking-widest uppercase">
            LOCAL WELLNESS TRAVEL
          </span>
          <h1 className="text-2xl md:text-3xl font-black text-white">
            수도권 힐링 여행지 안내
          </h1>
          <p className="text-xs md:text-sm text-gray-400">
            피로와 긴장을 비워내기 좋은 서울·경기·인천 추천 명소
          </p>
        </div>

        {/* 상단 소개 카드 */}
        <div className="bg-[#111114] border border-amber-500/20 p-6 rounded-3xl text-center space-y-2 shadow-lg">
          <p className="text-xs md:text-sm text-gray-300 font-semibold">
            🌿 바쁜 일상 속, 몸과 마음에 잠시 쉬어갈 틈을 선물해 보세요.
          </p>
          <p className="text-[11px] text-gray-500">
            접근성이 뛰어난 수도권 내 힐링 명소에서 편안한 재충전의 시간을 가져보시기 바랍니다.
          </p>
        </div>

        {/* 여행지 카드 리스트 */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {travelSpots.map((spot, idx) => (
            <div
              key={idx}
              className="bg-[#111114] border border-white/10 hover:border-amber-500/40 p-6 rounded-2xl space-y-3 transition-all shadow-md group flex flex-col justify-between"
            >
              <div className="space-y-3">
                <div className="flex justify-between items-center text-xs">
                  <Link
                    href={spot.regionLink}
                    className="text-amber-400 font-black bg-amber-500/10 px-2.5 py-1 rounded-lg border border-amber-500/20 hover:bg-amber-500/20 transition-colors"
                  >
                    {spot.region} 샵 보기 →
                  </Link>
                  <span className="text-gray-500 text-[11px]">{spot.tag}</span>
                </div>
                <h2 className="text-base font-extrabold text-white group-hover:text-amber-300 transition-colors">
                  {spot.title}
                </h2>
                <p className="text-xs text-gray-400 leading-relaxed">
                  {spot.desc}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* 하단 이동 버튼 */}
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
            📞 제휴 및 상담 문의
          </a>
        </div>

      </div>
    </div>
  );
}