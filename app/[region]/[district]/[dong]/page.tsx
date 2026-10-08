import { Metadata } from "next";
import Link from "next/link";
import DongDetailClient from "./DongDetailClient";

interface PageProps {
  params: Promise<{
    region: string;
    district: string;
    dong: string;
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

// 🎯 40가지 순환형 SEO 패턴
const SEO_PATTERNS = [
  { t: "출장 웰니스 마사지 & 프리미엄 힐링 케어", d: (d: string) => `${d}출장마사지 안심 가이드. 나만의 편안한 공간에서 경험하는 1:1 맞춤 바디 테라피 코스와 정찰제 요금을 케어존마사지에서 확인하세요.` },
  { t: "출장 스웨디시 마사지 감성 바디 릴렉스", d: (d: string) => `${d}출장마사지 추천 코스 안내. 섬세한 터치와 부드러운 오일 이완 프로그램으로 지친 피로를 풀어드립니다.` },
  { t: "출장 아로마 마사지 오일 테라피 안내", d: (d: string) => `${d}출장마사지 힐링 케어. 천연 에센셜 오일로 누적된 일상 스트레스를 부드럽게 비워내는 솔루션입니다.` },
  { t: "출장 타이 마사지 정통 바디 스트레칭", d: (d: string) => `${d}출장마사지 전문 안내. 숙련된 테라피스트의 전신 스트레칭과 시원한 압 조절로 굳은 몸을 개운하게 풀어드립니다.` },
  { t: "출장 릴렉스 마사지 집중 피로 회복", d: (d: string) => `${d}출장마사지 큐레이션. 집이나 편안한 숙소에서 언제든 프라이빗하게 누리는 맞춤형 힐링 플랫폼입니다.` },
  { t: "출장 딥티슈 마사지 속근육 집중 케어", d: (d: string) => `${d}출장마사지 프로그램. 만성적인 목 어깨 결림과 등, 허리의 뭉친 피로를 집중적으로 완화해 드립니다.` },
  { t: "출장 림프 순환 마사지 바디 솔루션", d: (d: string) => `${d}출장마사지 정찰제 안내. 정체된 신체 림프 순환을 돕고 붓기 관리에 집중한 편안한 웰니스 케어입니다.` },
  { t: "출장 감성 테라피 마사지 제휴 안내", d: (d: string) => `${d}출장마사지 실시간 연결. 편안한 휴식을 제공하는 검증된 파트너 샵 정보를 한눈에 비교해 보세요.` },
  { t: "출장 밸런스 힐링 마사지 가이드", d: (d: string) => `${d}출장마사지 추천. 균형 잡힌 바디 컨디션과 활력 회복을 돕는 1:1 방문 맞춤 테라피를 만나보세요.` },
  { t: "출장 프리미엄 바디 마사지 힐링 안내", d: (d: string) => `${d}출장마사지 VIP 안내. 고급 천연 오일과 세심한 케어가 어우러진 최고급 릴렉싱 프로그램을 안내합니다.` },
  { t: "출장 건식 스트레칭 마사지 포인트 케어", d: (d: string) => `${d}출장마사지 코스 비교. 끈적임 없이 산뜻하게 굳은 근육의 긴장을 해소하는 수기 스트레칭 케어입니다.` },
  { t: "출장 에스테틱 힐링 마사지 바디 웰빙", d: (d: string) => `${d}출장마사지 안내. 피부 보습과 뭉친 피로 회복을 함께 챙기는 복합 바디 웰니스 트리트먼트를 경험하세요.` },
  { t: "출장 로열 바디케어 마사지 1:1 안내", d: (d: string) => `${d}출장마사지 매칭 플랫폼. 독립된 프라이빗 공간에서 온전한 휴식을 누리는 스마트 힐링 가이드라인을 제공합니다.` },
  { t: "출장 소프트 아로마 마사지 포근한 이완", d: (d: string) => `${d}출장마사지 가이드. 자극 없는 편안한 손길로 일상의 피로와 스트레스를 부드럽게 녹여드립니다.` },
  { t: "출장 호텔식 럭셔리 마사지 프라이빗 케어", d: (d: string) => `${d}출장마사지 웰니스 솔루션. 정갈한 서비스와 수준 높은 테라피 프로그램을 투명한 정찰제로 이용하세요.` }
];

// 🌿 동별 유사 문서(중복 페이지) 회피를 위한 동적 칼럼 생성기
function getDongArticle(districtName: string, dongName: string, seed: number) {
  const articles = [
    {
      body: `${districtName} ${dongName} 일대에서 나만의 편안한 안식처를 찾는 분들을 위한 전문 바디케어 가이드입니다. 복잡한 도심 이동 없이 자택이나 숙소에서 프라이빗하게 누릴 수 있는 홈케어 프로그램으로, 숙련된 관리사의 섬세한 손길을 통해 굳어있던 심신을 부드럽게 이완시켜 드립니다. 청결한 위생 관리와 투명한 정찰제 시스템으로 언제나 안심하고 이용하실 수 있습니다.`,
      tip: `과중한 업무로 어깨와 승모근이 딱딱하게 뭉쳤다면 전신을 시원하게 늘려주는 타이 스트레칭을, 피로와 스트레스로 깊은 숙면이 필요하시다면 부드러운 천연 아로마 스웨디시 관리를 추천합니다.`
    },
    {
      body: `${dongName} 중심 상권 및 주거 지역 어디서나 신속하게 안내받으실 수 있는 프리미엄 웰니스 케어망입니다. 하루 종일 누적된 만성 피로와 바디 밸런스 불균형을 해소하기 위해 1:1 맞춤형 힐링 테라피를 제공하며, 프라이빗한 공간에서 타인의 시선 없이 온전한 휴식을 누리실 수 있습니다.`,
      tip: `다리의 부종 완화와 혈액 순환 개선을 원하시는 분들은 림프절을 부드럽게 자극하는 순환 테라피를 선택하시면 한층 가볍고 개운한 몸 상태를 되찾으실 수 있습니다.`
    },
    {
      body: `${districtName} ${dongName} 고객님들의 건강한 라이프스타일을 위한 맞춤형 테라피 안내 센터입니다. 번거로운 외출 과정 없이 편안하게 머무시는 곳에서 최상의 컨디션 케어를 경험해 보세요. 정직한 코스 구성과 친절한 서비스로 고객 만족도를 최우선으로 합니다.`,
      tip: `강한 지압이나 자극적인 관리가 부담스러우신 분들은 저자극 에센셜 오일을 활용한 소프트 릴렉싱 코스를 통해 부드럽고 따뜻한 이완을 경험해 보세요.`
    }
  ];
  return articles[seed % articles.length];
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { region, district, dong } = await params;
  const districtName = safeDecode(district);
  const dongName = safeDecode(dong);

  const displayLocation = `${districtName} ${dongName}`;
  const charSum = (displayLocation + region).split("").reduce((acc, c) => acc + c.charCodeAt(0), 0);
  const pattern = SEO_PATTERNS[Math.abs(charSum) % SEO_PATTERNS.length];

  const finalTitle = `${displayLocation} ${pattern.t} | 케어존마사지`;
  const finalDescription = pattern.desc(dongName);
  const canonicalUrl = `https://carezone-massage.netlify.app/${region}/${encodeURIComponent(districtName)}/${encodeURIComponent(dongName)}`;

  return {
    title: { absolute: finalTitle },
    description: finalDescription,
    alternates: { canonical: canonicalUrl },
    keywords: [
      `${dongName}출장마사지`,
      `${dongName} 마사지`,
      `${dongName} 스웨디시`,
      `${districtName} 마사지`,
      `${dongName} 타이마사지`,
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
          alt: `${dongName}출장마사지 케어존마사지`,
        },
      ],
    },
  };
}

export default async function Page({ params }: PageProps) {
  const resolved = await params;
  const regionFullName = getRegionFullName(resolved.region);
  const districtName = safeDecode(resolved.district);
  const dongName = safeDecode(resolved.dong);

  const displayLocation = `${districtName} ${dongName}`;
  const charSum = (displayLocation + resolved.region).split("").reduce((acc, c) => acc + c.charCodeAt(0), 0);
  const pattern = SEO_PATTERNS[Math.abs(charSum) % SEO_PATTERNS.length];
  const article = getDongArticle(districtName, dongName, Math.abs(charSum));

  const jsonLd = [
    {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "홈", item: "https://carezone-massage.netlify.app" },
        { "@type": "ListItem", position: 2, name: districtName, item: `https://carezone-massage.netlify.app/${resolved.region}/${encodeURIComponent(districtName)}` },
        { "@type": "ListItem", position: 3, name: `${dongName} 마사지`, item: `https://carezone-massage.netlify.app/${resolved.region}/${encodeURIComponent(districtName)}/${encodeURIComponent(dongName)}` },
      ],
    },
    {
      "@context": "https://schema.org",
      "@type": "LocalBusiness",
      name: `${dongName}출장마사지 제휴 안내 - 케어존마사지`,
      description: pattern.desc(dongName),
      url: `https://carezone-massage.netlify.app/${resolved.region}/${encodeURIComponent(districtName)}/${encodeURIComponent(dongName)}`,
      telephone: "0507-1280-3344",
      image: "https://carezone-massage.netlify.app/images/logo.png",
      priceRange: "KRW",
      address: {
        "@type": "PostalAddress",
        addressLocality: `${districtName} ${dongName}`,
        addressRegion: regionFullName,
        addressCountry: "KR",
      },
    },
  ];

  return (
    <div className="bg-[#070709] text-gray-100 min-h-screen flex flex-col font-sans selection:bg-amber-500 selection:text-black">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      {/* 상단 네비게이션 헤더 */}
      <header className="sticky top-0 z-40 bg-[#070709]/90 backdrop-blur-md border-b border-white/10">
        <div className="max-w-4xl mx-auto h-16 px-4 flex items-center justify-between">
          <Link href="/" className="font-black text-lg text-white flex items-center gap-1.5">
            <span className="w-2.5 h-5 bg-amber-400 rounded-full inline-block"></span>
            케어존마사지
          </Link>
          <div className="flex items-center gap-2">
            <Link
              href={`/${resolved.region}/${encodeURIComponent(districtName)}`}
              className="px-3 py-1.5 rounded-full bg-white/10 hover:bg-white/20 text-white font-bold text-xs transition-colors"
            >
              ← {districtName} 전체보기
            </Link>
            <a
              href="tel:0507-1280-3344"
              className="px-3.5 py-1.5 rounded-full bg-amber-400 text-black font-black text-xs hover:scale-105 transition-transform"
            >
              📞 빠른 상담
            </a>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 py-8 w-full flex-1 space-y-10">
        {/* 상단 동별 대표 배너 (네이버 핵심 H1 보강) */}
        <section className="relative rounded-3xl overflow-hidden border border-amber-500/30 shadow-[0_0_40px_rgba(245,158,11,0.12)] bg-[#141418]">
          <div className="p-6 md:p-10 space-y-2">
            <span className="text-amber-400 text-xs font-black tracking-widest uppercase mb-1 block">
              {regionFullName.toUpperCase()} · {districtName.toUpperCase()} · {dongName.toUpperCase()}
            </span>
            <h1 className="text-2xl md:text-4xl font-black text-white drop-shadow-md">
              {displayLocation} {pattern.t}
            </h1>
            <p className="text-xs md:text-sm text-gray-300 mt-2 max-w-xl leading-relaxed">
              {pattern.desc(dongName)}
            </p>
          </div>
        </section>

        {/* 샵 리스트 클라이언트 컴포넌트 */}
        <DongDetailClient
          region={resolved.region}
          districtName={districtName}
          dongName={dongName}
          regionFullName={regionFullName}
        />

        {/* 🌿 동별 상세 가이드 본문 (네이버 Yeti가 긁어갈 텍스트 콘텐츠) */}
        <section className="bg-[#0e0e12] p-6 md:p-8 rounded-3xl border border-white/10 space-y-4">
          <h2 className="text-base md:text-lg font-bold text-amber-400 flex items-center gap-2">
            <span>🌿</span> {dongName} 힐링 바디 테라피 가이드
          </h2>
          <div className="text-xs text-gray-300 space-y-3 leading-relaxed">
            <p>{article.body}</p>
            <div className="bg-black/50 p-4 rounded-2xl border border-white/5 space-y-2">
              <h3 className="font-bold text-white text-xs">💡 {dongName} 추천 코스 안내</h3>
              <p className="text-gray-400">{article.tip}</p>
            </div>
            <p className="text-gray-500 text-[11px]">
              * 본 가이드는 {dongName}출장마사지 이용 고객 여러분의 편안하고 건강한 휴식을 위해 정기적으로 검증 및 업데이트됩니다.
            </p>
          </div>
        </section>

        {/* 표준 이용 절차 */}
        <section className="bg-[#0f0f13] p-6 md:p-8 rounded-3xl border border-amber-500/20 space-y-6">
          <div className="text-center">
            <span className="text-amber-400 text-xs font-bold tracking-widest uppercase">HOW TO USE</span>
            <h2 className="text-xl font-black text-white mt-1">{dongName} 안심 예약 4단계</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-black/60 p-4 rounded-2xl border border-white/5 text-center">
              <span className="text-xs text-amber-400 font-bold">STEP 1</span>
              <h3 className="font-bold text-white mt-1">샵 확인</h3>
              <p className="text-xs text-gray-400 mt-1">{dongName} 추천 제휴점 확인</p>
            </div>
            <div className="bg-black/60 p-4 rounded-2xl border border-white/5 text-center">
              <span className="text-xs text-amber-400 font-bold">STEP 2</span>
              <h3 className="font-bold text-white mt-1">프로그램 선택</h3>
              <p className="text-xs text-gray-400 mt-1">스웨디시 / 아로마 / 타이</p>
            </div>
            <div className="bg-black/60 p-4 rounded-2xl border border-white/5 text-center">
              <span className="text-xs text-amber-400 font-bold">STEP 3</span>
              <h3 className="font-bold text-white mt-1">전화 상담</h3>
              <p className="text-xs text-gray-400 mt-1">원하는 시간 및 코스 조율</p>
            </div>
            <div className="bg-black/60 p-4 rounded-2xl border border-white/5 text-center">
              <span className="text-xs text-amber-400 font-bold">STEP 4</span>
              <h3 className="font-bold text-white mt-1">안심 힐링</h3>
              <p className="text-xs text-gray-400 mt-1">정찰제 요금으로 편안한 이용</p>
            </div>
          </div>
        </section>

        {/* 동 단위 FAQ */}
        <section className="space-y-4">
          <div className="text-center">
            <span className="text-amber-400 text-xs font-bold tracking-widest uppercase">FAQ</span>
            <h2 className="text-xl font-black text-white mt-1">{dongName} 자주 묻는 질문</h2>
          </div>
          <div className="space-y-3">
            <div className="bg-black/60 p-4 rounded-2xl border border-white/5 space-y-1.5">
              <div className="font-bold text-sm text-gray-200 flex items-center gap-2">
                <span className="text-amber-400">Q.</span> {dongName} 당일 예약도 가능한가요?
              </div>
              <p className="text-xs text-gray-400 pl-6 leading-relaxed">
                <span className="text-amber-400 font-bold">A.</span> 네, 대부분의 제휴 샵에서 당일 방문 및 예약이 가능하며, 원활한 일정 조율을 위해 1~2시간 전 사전 연락을 권장합니다.
              </p>
            </div>
            <div className="bg-black/60 p-4 rounded-2xl border border-white/5 space-y-1.5">
              <div className="font-bold text-sm text-gray-200 flex items-center gap-2">
                <span className="text-amber-400">Q.</span> {dongName}출장마사지 정찰제 요금인가요?
              </div>
              <p className="text-xs text-gray-400 pl-6 leading-relaxed">
                <span className="text-amber-400 font-bold">A.</span> 케어존마사지에 등록된 매장들은 선입금 사기 없는 투명한 정찰제 요금을 준수합니다.
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