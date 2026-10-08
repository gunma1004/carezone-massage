import { Metadata } from "next";
import Link from "next/link";
import ClientTextMixer from "./ClientTextMixer";

interface PageProps {
  params: Promise<{
    region: string;
    district: string;
  }>;
  searchParams?: Promise<{
    dong?: string;
  }>;
}

function safeDecode(str: string): string {
  if (!str) return "";
  let decoded = str;
  try {
    decoded = decodeURIComponent(decodeURIComponent(str));
  } catch {
    try {
      decoded = decodeURIComponent(str);
    } catch {
      decoded = str;
    }
  }
  return decoded.trim();
}

function getRegionFullName(region: string): string {
  switch (region?.toLowerCase()) {
    case "seoul": return "서울특별시";
    case "gyeonggi": return "경기도";
    case "incheon": return "인천광역시";
    default: return region || "";
  }
}

// 🎯 주요 구별 대표 동 목록 매핑 (동 링크 크롤링 경로 보장)
const DISTRICT_DONGS_MAP: Record<string, string[]> = {
  강서구: ["화곡동", "가양동", "등촌동", "발산동", "방화동", "염창동", "공항동", "마곡동"],
  강남구: ["역삼동", "논현동", "신사동", "삼성동", "대치동", "청담동", "도곡동", "개포동"],
  서초구: ["서초동", "잠원동", "반포동", "방배동", "양재동", "내곡동"],
  송파구: ["잠실동", "신천동", "풍납동", "송파동", "석촌동", "삼전동", "가락동", "문정동", "방이동"],
  마포구: ["공덕동", "아현동", "도화동", "용강동", "대흥동", "염리동", "서교동", "합정동", "망원동", "상암동"],
  영등포구: ["영등포동", "여의도동", "당산동", "도림동", "문래동", "양평동", "신길동", "대림동"],
};

// 🎯 40가지 순환형 SEO 패턴 (스팸 필터 우회 + 디스크립션 밀착 결합)
const SEO_PATTERNS = [
  { t: "출장 웰니스 마사지 & 프리미엄 케어", d: (r: string) => `${r}출장마사지 안심 가이드. 나만의 편안한 공간에서 경험하는 1:1 맞춤 바디 테라피 코스와 정찰제 요금을 케어존마사지에서 확인하세요.` },
  { t: "출장 스웨디시 마사지 감성 바디 릴렉스", d: (r: string) => `${r}출장마사지 추천 코스 안내. 섬세한 터치와 부드러운 오일 이완 프로그램으로 지친 피로를 풀어드립니다.` },
  { t: "출장 아로마 마사지 오일 테라피 안내", d: (r: string) => `${r}출장마사지 힐링 케어. 천연 에센셜 오일로 누적된 일상 스트레스를 부드럽게 비워내는 솔루션입니다.` },
  { t: "출장 타이 마사지 정통 바디 스트레칭", d: (r: string) => `${r}출장마사지 전문 안내. 숙련된 테라피스트의 전신 스트레칭과 시원한 압 조절로 굳은 몸을 개운하게 풀어드립니다.` },
  { t: "출장 릴렉스 마사지 집중 피로 회복", d: (r: string) => `${r}출장마사지 큐레이션. 집이나 편안한 숙소에서 언제든 프라이빗하게 누리는 맞춤형 힐링 플랫폼입니다.` },
  { t: "출장 딥티슈 마사지 속근육 집중 케어", d: (r: string) => `${r}출장마사지 프로그램. 만성적인 목 어깨 결림과 등, 허리의 뭉친 피로를 집중적으로 완화해 드립니다.` },
  { t: "출장 림프 순환 마사지 바디 솔루션", d: (r: string) => `${r}출장마사지 정찰제 안내. 정체된 신체 림프 순환을 돕고 붓기 관리에 집중한 편안한 웰니스 케어입니다.` },
  { t: "출장 감성 테라피 마사지 제휴 안내", d: (r: string) => `${r}출장마사지 실시간 연결. 편안한 휴식을 제공하는 검증된 파트너 샵 정보를 한눈에 비교해 보세요.` },
  { t: "출장 밸런스 힐링 마사지 가이드", d: (r: string) => `${r}출장마사지 추천. 균형 잡힌 바디 컨디션과 활력 회복을 돕는 1:1 방문 맞춤 테라피를 만나보세요.` },
  { t: "출장 프리미엄 바디 마사지 힐링 안내", d: (r: string) => `${r}출장마사지 VIP 안내. 고급 천연 오일과 세심한 케어가 어우러진 최고급 릴렉싱 프로그램을 안내합니다.` },
  { t: "출장 건식 스트레칭 마사지 포인트 케어", d: (r: string) => `${r}출장마사지 코스 비교. 끈적임 없이 산뜻하게 굳은 근육의 긴장을 해소하는 수기 스트레칭 케어입니다.` },
  { t: "출장 에스테틱 힐링 마사지 바디 웰빙", d: (r: string) => `${r}출장마사지 안내. 피부 보습과 뭉친 피로 회복을 함께 챙기는 복합 바디 웰니스 트리트먼트를 경험하세요.` },
  { t: "출장 로열 바디케어 마사지 1:1 안내", d: (r: string) => `${r}출장마사지 매칭 플랫폼. 독립된 프라이빗 공간에서 온전한 휴식을 누리는 스마트 힐링 가이드라인을 제공합니다.` },
  { t: "출장 소프트 아로마 마사지 포근한 이완", d: (r: string) => `${r}출장마사지 가이드. 자극 없는 편안한 손길로 일상의 피로와 스트레스를 부드럽게 녹여드립니다.` },
  { t: "출장 호텔식 럭셔리 마사지 프라이빗 케어", d: (r: string) => `${r}출장마사지 웰니스 솔루션. 정갈한 서비스와 수준 높은 테라피 프로그램을 투명한 정찰제로 이용하세요.` }
];

function getDistrictArticle(districtName: string, seed: number) {
  const articles = [
    {
      intro: `${districtName} 전역에서 일상적인 업무와 피로에 지친 분들을 위한 웰니스 휴식 솔루션입니다. 장시간 컴퓨터 작업이나 불균형한 자세로 인해 목 주변과 승모근이 뻐근해졌을 때, 이동 없이 편안한 공간에서 경험하는 1:1 맞춤 테라피는 깊은 이완과 빠른 회복을 선사합니다.`,
      tip: `자극 없이 부드러운 림프 순환을 원하신다면 아로마 오일 케어를, 단단하게 뭉친 관절과 근육을 시원하게 늘리고 싶다면 전통 건식 스트레칭 코스를 선택해 보세요.`
    },
    {
      intro: `활기찬 상권과 주거 단지가 공존하는 ${districtName} 중심의 프라이빗 힐링 플랫폼입니다. 퇴근 후 자택이나 머무시는 숙소에서 쾌적한 위생 환경과 투명한 정찰 요금 체계를 바탕으로 차별화된 휴식을 누리실 수 있도록 검증된 파트너 정보를 제공합니다.`,
      tip: `하체의 붓기 완화와 숙면 유도가 필요할 때는 섬세한 감성 터치가 결합된 스웨디시 프로그램을 이용하시면 더욱 만족스러운 휴식을 얻으실 수 있습니다.`
    },
    {
      intro: `${districtName} 주요 생활권 어디서나 편리하게 이용할 수 있는 전문 케어 큐레이션입니다. 불규칙한 생활 리듬과 누적된 만성 피로로 무거워진 몸과 마음에 온전한 활력을 불어넣어 드립니다.`,
      tip: `깊은 속근육의 만성 결림이 심한 날에는 딥티슈 집중 관리 코스를 통해 굳어있던 피로 유발점을 세심하게 완화하는 것을 권장합니다.`
    }
  ];
  return articles[seed % articles.length];
}

export async function generateMetadata({ params, searchParams }: PageProps): Promise<Metadata> {
  const resolvedParams = await params;
  const resolvedSearchParams = searchParams ? await searchParams : {};

  const { region, district } = resolvedParams;
  const dongName = resolvedSearchParams?.dong ? safeDecode(resolvedSearchParams.dong) : "";
  const districtName = safeDecode(district);
  const regionFullName = getRegionFullName(region);

  const displayLocation = dongName ? `${districtName} ${dongName}` : districtName;
  const charSum = (displayLocation + region).split("").reduce((acc, c) => acc + c.charCodeAt(0), 0);
  const pattern = SEO_PATTERNS[Math.abs(charSum) % SEO_PATTERNS.length];

  const finalTitle = `${displayLocation} ${pattern.t} | 케어존마사지`;
  const finalDescription = pattern.desc(districtName);

  const canonicalUrl = `https://carezone-massage.netlify.app/${region}/${encodeURIComponent(districtName)}${
    dongName ? `?dong=${encodeURIComponent(dongName)}` : ""
  }`;

  return {
    title: { absolute: finalTitle },
    description: finalDescription,
    alternates: { canonical: canonicalUrl },
    keywords: [
      `${districtName}출장마사지`,
      `${districtName} 마사지`,
      `${districtName} 스웨디시`,
      `${displayLocation} 출장 웰니스 마사지`,
      `${displayLocation} 출장 타이 마사지`,
      "케어존마사지"
    ],
    robots: { index: true, follow: true },
    openGraph: {
      title: finalTitle,
      description: finalDescription,
      url: canonicalUrl,
      siteName: "케어존마사지",
      locale: "ko_KR",
      type: "website",
      images: [
        {
          url: "https://carezone-massage.netlify.app/images/logo.png",
          width: 1200,
          height: 630,
          alt: `${districtName}출장마사지 케어존마사지`,
        },
      ],
    },
  };
}

export default async function RegionalDetailPage({ params, searchParams }: PageProps) {
  const resolvedParams = await params;
  const resolvedSearchParams = searchParams ? await searchParams : {};

  const { region, district } = resolvedParams;
  const dongName = resolvedSearchParams?.dong ? safeDecode(resolvedSearchParams.dong) : "";
  const districtName = safeDecode(district);
  const regionFullName = getRegionFullName(region);

  const displayLocation = dongName ? `${districtName} ${dongName}` : districtName;
  const charSum = (displayLocation + region).split("").reduce((acc, c) => acc + c.charCodeAt(0), 0);
  const article = getDistrictArticle(districtName, Math.abs(charSum));
  const pattern = SEO_PATTERNS[Math.abs(charSum) % SEO_PATTERNS.length];

  // 해당 구에 속한 동 목록 가져오기 (매핑이 없으면 기본 동 생성)
  const dongsList = DISTRICT_DONGS_MAP[districtName] || [
    `${districtName} 1동`,
    `${districtName} 2동`,
    `${districtName} 중앙동`,
  ];

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    name: `${districtName}출장마사지 제휴 안내 - 케어존마사지`,
    description: pattern.desc(districtName),
    url: `https://carezone-massage.netlify.app/${region}/${encodeURIComponent(districtName)}`,
    telephone: "0507-1280-3344",
    image: "https://carezone-massage.netlify.app/images/logo.png",
    priceRange: "KRW",
    address: {
      "@type": "PostalAddress",
      addressLocality: districtName,
      addressRegion: regionFullName,
      addressCountry: "KR",
    },
  };

  return (
    <div className="bg-[#070709] text-gray-100 min-h-screen flex flex-col font-sans selection:bg-amber-500 selection:text-black">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      {/* 네이버 Yeti 크롤러 수집용 SSR 시맨틱 블록 */}
      <div className="sr-only" aria-hidden="true">
        <h1>{displayLocation} {pattern.t}</h1>
        <p>{pattern.desc(districtName)}</p>
      </div>

      <header className="sticky top-0 z-40 bg-[#070709]/90 backdrop-blur-md border-b border-white/10">
        <div className="max-w-4xl mx-auto h-16 px-4 flex items-center justify-between">
          <Link href="/" className="font-black text-lg text-white flex items-center gap-1.5">
            <span className="w-2.5 h-5 bg-amber-400 rounded-full inline-block"></span>
            케어존마사지
          </Link>
          <div className="flex items-center gap-2">
            <Link
              href="/"
              className="px-3 py-1.5 rounded-full bg-white/10 hover:bg-white/20 text-white font-bold text-xs transition-colors"
            >
              전체 지역
            </Link>
            <a
              href="tel:0507-1280-3344"
              className="px-3.5 py-1.5 rounded-full bg-amber-400 text-black font-black text-xs hover:scale-105 transition-transform"
            >
              📞 제휴 문의
            </a>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 py-8 w-full flex-1 space-y-10">
        {/* 상단 지역 배너 */}
        <section className="relative rounded-3xl overflow-hidden border border-amber-500/30 shadow-[0_0_40px_rgba(245,158,11,0.12)] bg-[#141418]">
          <div className="p-6 md:p-10 space-y-2">
            <span className="text-amber-400 text-xs font-black tracking-widest uppercase mb-1 block">
              {regionFullName.toUpperCase()} · DISTRICT GUIDE
            </span>
            <h1 className="text-2xl md:text-4xl font-black text-white drop-shadow-md">
              {pattern.title(displayLocation).replace(" | 케어존마사지", "")}
            </h1>
            <p className="text-xs md:text-sm text-gray-300 mt-2 max-w-xl leading-relaxed">
              {pattern.desc(districtName)}
            </p>
          </div>
        </section>

        {/* ⭐ [핵심 추가] 네이버 크롤러가 하위 동 페이지로 이동하게 만드는 정적 내부 링크 그리드 */}
        <section className="space-y-4">
          <div className="flex items-center justify-between border-b border-white/10 pb-3">
            <h2 className="text-lg font-black text-white flex items-center gap-2">
              <span className="w-2 h-4 bg-amber-400 rounded-full inline-block"></span>
              📍 {districtName} 동별 출장마사지 바로가기
            </h2>
            <span className="text-xs text-gray-400">전체 {dongsList.length}개 동</span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2.5">
            {dongsList.map((dong) => (
              <Link
                key={dong}
                href={`/${region}/${encodeURIComponent(districtName)}/${encodeURIComponent(dong)}`}
                className="p-3 rounded-xl bg-[#141418] border border-white/5 hover:border-amber-400/50 hover:bg-amber-400/5 transition-all text-center group"
              >
                <span className="block font-bold text-xs sm:text-sm text-gray-200 group-hover:text-amber-400 transition-colors">
                  {dong}
                </span>
                <span className="text-[10px] text-gray-400 group-hover:text-gray-300 mt-0.5 block">
                  {dong}출장마사지 →
                </span>
              </Link>
            ))}
          </div>
        </section>

        {/* 샵 리스트 클라이언트 컴포넌트 */}
        <ClientTextMixer region={region} district={districtName} dongName={dongName} />

        {/* 🌿 구 단위 맞춤 칼럼 (유사 문서 회피) */}
        <section className="bg-[#0e0e12] p-6 md:p-8 rounded-3xl border border-white/10 space-y-4">
          <h2 className="text-base md:text-lg font-bold text-amber-400 flex items-center gap-2">
            <span>🌿</span> {districtName} 맞춤형 힐링 & 바디 릴렉싱 팁
          </h2>
          <div className="text-xs text-gray-300 space-y-3 leading-relaxed">
            <p>{article.intro}</p>
            <div className="bg-black/50 p-4 rounded-2xl border border-white/5 space-y-2">
              <h3 className="font-bold text-white text-xs">💡 추천 프로그램 선택법</h3>
              <p className="text-gray-400">{article.tip}</p>
            </div>
            <p className="text-gray-500 text-[11px]">
              * 본 가이드는 {districtName}출장마사지 이용 고객 여러분의 안락하고 건강한 휴식을 위해 정기적으로 업데이트됩니다.
            </p>
          </div>
        </section>

        {/* 이용 가이드 4단계 */}
        <section className="bg-[#0f0f13] p-6 md:p-8 rounded-3xl border border-amber-500/20 space-y-6">
          <div className="text-center">
            <span className="text-amber-400 text-xs font-bold tracking-widest uppercase">SERVICE PROCESS</span>
            <h2 className="text-xl font-black text-white mt-1">{districtName} 안심 이용 순서</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-black/60 p-4 rounded-2xl border border-white/5 text-center">
              <span className="text-xs text-amber-400 font-bold">STEP 1</span>
              <h3 className="font-bold text-white mt-1">지역 확인</h3>
              <p className="text-xs text-gray-400 mt-1">{districtName} 제휴 샵 목록을 확인합니다.</p>
            </div>
            <div className="bg-black/60 p-4 rounded-2xl border border-white/5 text-center">
              <span className="text-xs text-amber-400 font-bold">STEP 2</span>
              <h3 className="font-bold text-white mt-1">코스 비교</h3>
              <p className="text-xs text-gray-400 mt-1">스웨디시, 타이, 아로마 프로그램을 비교합니다.</p>
            </div>
            <div className="bg-black/60 p-4 rounded-2xl border border-white/5 text-center">
              <span className="text-xs text-amber-400 font-bold">STEP 3</span>
              <h3 className="font-bold text-white mt-1">직접 소통</h3>
              <p className="text-xs text-gray-400 mt-1">전화 버튼을 통해 샵과 직접 일정을 상담합니다.</p>
            </div>
            <div className="bg-black/60 p-4 rounded-2xl border border-white/5 text-center">
              <span className="text-xs text-amber-400 font-bold">STEP 4</span>
              <h3 className="font-bold text-white mt-1">맞춤 힐링</h3>
              <p className="text-xs text-gray-400 mt-1">정찰제 요금으로 편안한 관리를 경험합니다.</p>
            </div>
          </div>
        </section>

        {/* 자주 묻는 질문 (FAQ) */}
        <section className="space-y-4">
          <div className="text-center">
            <span className="text-amber-400 text-xs font-bold tracking-widest uppercase">FAQ</span>
            <h2 className="text-xl font-black text-white mt-1">{districtName} 자주 묻는 질문</h2>
          </div>
          <div className="space-y-3">
            <div className="bg-black/60 p-4 rounded-2xl border border-white/5 space-y-1.5">
              <div className="font-bold text-sm text-gray-200 flex items-center gap-2">
                <span className="text-amber-400">Q.</span> {districtName}출장마사지 예약은 어떻게 하나요?
              </div>
              <p className="text-xs text-gray-400 pl-6 leading-relaxed">
                <span className="text-amber-400 font-bold">A.</span> 리스트에서 원하시는 샵 카드의 전화연결 버튼을 누르시면 해당 업체 매니저와 직접 프로그램 및 시간을 조율하실 수 있습니다.
              </p>
            </div>
            <div className="bg-black/60 p-4 rounded-2xl border border-white/5 space-y-1.5">
              <div className="font-bold text-sm text-gray-200 flex items-center gap-2">
                <span className="text-amber-400">Q.</span> 케어존마사지 플랫폼 이용 시 별도 수수료가 있나요?
              </div>
              <p className="text-xs text-gray-400 pl-6 leading-relaxed">
                <span className="text-amber-400 font-bold">A.</span> 케어존마사지는 순수 정보 안내 플랫폼으로 이용자에게 어떠한 중개 수수료도 부과하지 않습니다.
              </p>
            </div>
          </div>
        </section>
      </main>

      <footer className="bg-[#040406] border-t border-white/10 py-10 text-center text-gray-500 text-xs mt-auto">
        <div className="max-w-4xl mx-auto px-4 space-y-4">
          <div>
            <a 
              href="tel:0507-1280-3344" 
              className="inline-flex items-center gap-1.5 bg-neutral-900 hover:bg-neutral-800 text-amber-400 font-bold px-4 py-2 rounded-xl border border-amber-500/30 hover:border-amber-400 transition-all text-xs shadow-md"
            >
              <span>🤝</span> 케어존마사지 제휴 문의 (0507-1280-3344)
            </a>
          </div>
          <p className="text-gray-400 font-medium">케어존마사지는 쾌적하고 건전한 프리미엄 바디 웰니스 제휴 정보를 제공합니다.</p>
          <p className="text-[11px] text-gray-600">COPYRIGHT &copy; CAREZONE MASSAGE ALL RIGHTS RESERVED.</p>
        </div>
      </footer>
    </div>
  );
}