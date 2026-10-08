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

const DISTRICT_DONGS_MAP: Record<string, string[]> = {
  강서구: ["화곡동", "가양동", "등촌동", "발산동", "방화동", "염창동", "공항동", "마곡동"],
  강남구: ["역삼동", "논현동", "신사동", "삼성동", "대치동", "청담동", "도곡동", "개포동"],
  서초구: ["서초동", "잠원동", "반포동", "방배동", "양재동", "내곡동"],
  송파구: ["잠실동", "신천동", "풍납동", "송파동", "석촌동", "삼전동", "가락동", "문정동", "방이동"],
  마포구: ["공덕동", "아현동", "도화동", "용강동", "대흥동", "염리동", "서교동", "합정동", "망원동", "상암동"],
  영등포구: ["영등포동", "여의도동", "당산동", "도림동", "문래동", "양평동", "신길동", "대림동"],
};

const SEO_PATTERNS = [
  { title: "출장 웰니스 마사지 & 프리미엄 케어", desc: (r: string) => `${r}출장마사지 안심 가이드. 나만의 편안한 공간에서 경험하는 1:1 맞춤 바디 테라피 코스와 정찰제 요금을 케어존마사지에서 확인하세요.` },
  { title: "출장 스웨디시 마사지 감성 바디 릴렉스", desc: (r: string) => `${r}출장마사지 추천 코스 안내. 섬세한 터치와 부드러운 오일 이완 프로그램으로 지친 피로를 풀어드립니다.` },
  { title: "출장 아로마 마사지 오일 테라피 안내", desc: (r: string) => `${r}출장마사지 힐링 케어. 천연 에센셜 오일로 누적된 일상 스트레스를 부드럽게 비워내는 솔루션입니다.` },
  { title: "출장 타이 마사지 정통 바디 스트레칭", desc: (r: string) => `${r}출장마사지 전문 안내. 숙련된 테라피스트의 전신 스트레칭과 시원한 압 조절로 굳은 몸을 개운하게 풀어드립니다.` },
  { title: "출장 릴렉스 마사지 집중 피로 회복", desc: (r: string) => `${r}출장마사지 큐레이션. 집이나 편안한 숙소에서 언제든 프라이빗하게 누리는 맞춤형 힐링 플랫폼입니다.` },
  { title: "출장 딥티슈 마사지 속근육 집중 케어", desc: (r: string) => `${r}출장마사지 프로그램. 만성적인 목 어깨 결림과 등, 허리의 뭉친 피로를 집중적으로 완화해 드립니다.` },
  { title: "출장 림프 순환 마사지 바디 솔루션", desc: (r: string) => `${r}출장마사지 정찰제 안내. 정체된 신체 림프 순환을 돕고 붓기 관리에 집중한 편안한 웰니스 케어입니다.` },
  { title: "출장 감성 테라피 마사지 제휴 안내", desc: (r: string) => `${r}출장마사지 실시간 연결. 편안한 휴식을 제공하는 검증된 파트너 샵 정보를 한눈에 비교해 보세요.` },
  { title: "출장 밸런스 힐링 마사지 가이드", desc: (r: string) => `${r}출장마사지 추천. 균형 잡힌 바디 컨디션과 활력 회복을 돕는 1:1 방문 맞춤 테라피를 만나보세요.` },
  { title: "출장 프리미엄 바디 마사지 힐링 안내", desc: (r: string) => `${r}출장마사지 VIP 안내. 고급 천연 오일과 세심한 케어가 어우러진 최고급 릴렉싱 프로그램을 안내합니다.` },
  { title: "출장 건식 스트레칭 마사지 포인트 케어", desc: (r: string) => `${r}출장마사지 코스 비교. 끈적임 없이 산뜻하게 굳은 근육의 긴장을 해소하는 수기 스트레칭 케어입니다.` },
  { title: "출장 에스테틱 힐링 마사지 바디 웰빙", desc: (r: string) => `${r}출장마사지 안내. 피부 보습과 뭉친 피로 회복을 함께 챙기는 복합 바디 웰니스 트리트먼트를 경험하세요.` },
  { title: "출장 로열 바디케어 마사지 1:1 안내", desc: (r: string) => `${r}출장마사지 매칭 플랫폼. 독립된 프라이빗 공간에서 온전한 휴식을 누리는 스마트 힐링 가이드라인을 제공합니다.` },
  { title: "출장 소프트 아로마 마사지 포근한 이완", desc: (r: string) => `${r}출장마사지 가이드. 자극 없는 편안한 손길로 일상의 피로와 스트레스를 부드럽게 녹여드립니다.` },
  { title: "출장 호텔식 럭셔리 마사지 프라이빗 케어", desc: (r: string) => `${r}출장마사지 웰니스 솔루션. 정갈한 서비스와 수준 높은 테라피 프로그램을 투명한 정찰제로 이용하세요.` }
];

function getDynamicDistrictInsight(districtName: string, seed: number) {
  const sectionsGroup = [
    {
      subtitle: `${districtName} 직장인 및 현대인을 위한 바디 밸런스 회복 가이드`,
      sec1Title: "1. 좌식 생활과 경추·승모근의 만성 긴장 메커니즘",
      sec1Text: [
        `${districtName} 일대에서 사무 업무나 이동이 잦은 직장인들은 장시간 고정된 자세로 인해 상체 근골격계에 피로가 쉽게 누적됩니다. 특히 모니터를 향해 목을 앞으로 빼는 거북목 형태의 자세는 경추 굴곡근을 약화시키고 상부 승모근과 견갑거근에 지속적인 장력을 가하게 됩니다. 이로 인해 어깨 윗선이 묵직해지고 혈류 순환이 제한되면서 뻐근한 두통이나 피로감이 동반됩니다.`,
        `이러한 국소 부위의 근막 유착을 풀어내기 위해서는 경직된 근섬유의 온도를 서서히 올리고, 수기 테크닉을 통해 근육 결을 따라 부드럽게 이완시키는 과정이 요구됩니다. 굳어있던 혈관이 확장되면서 산소와 영양소가 원활히 공급되고, 축적된 피로 물질이 배출되어 신체 본래의 유연성과 가동 범위를 회복할 수 있습니다.`
      ],
      sec2Title: "2. 신체 상태에 따른 건식 스트레칭과 오일 테라피의 차이",
      sec2Text: [
        `바디 케어는 압의 깊이와 전달 방식에 따라 기대 효과가 달라집니다. 본인의 당일 신체 상태와 관절 상태에 맞춰 적절한 기법을 고르는 것이 안전한 힐링의 핵심입니다.`,
        `오일을 사용하지 않는 건식 타이 케어는 관절의 가동성을 넓히고 뭉친 근육을 길게 늘려주는 수동적 스트레칭에 중점을 둡니다. 평소 활동량이 적어 몸이 굳어있거나 하체 부종이 심한 경우 큰 개운함을 줍니다. 반면 스웨디시 및 아로마 테라피는 식물성 오일을 매개로 마찰을 줄이며 림프절을 자극하는 기법으로, 속근육의 통증 없이 심신의 깊은 이완과 감정적 스트레스 해소를 원하는 분들에게 알맞습니다.`
      ],
      sec3Title: "3. 독립된 1인 공간에서 누리는 심리적 안정 효과",
      sec3Text: [
        `테라피의 생리학적 효과를 극대화하는 중요한 요소는 바로 심리적 안정감입니다. 외부 매장을 방문할 때 겪는 번거로운 이동, 대중교통 이용, 타인과의 접촉은 무의식중에 스트레스 호르몬 분비를 촉진할 수 있습니다.`,
        `반면 자택이나 숙소 등 독립된 공간에서 진행되는 프라이빗 케어는 외부의 시선과 소음이 완전히 차단되어 부교감 신경계를 빠르게 활성화합니다. 관리가 끝난 직후에도 환복이나 귀가 이동 없이 곧바로 편안한 수면으로 이어질 수 있어 힐링의 지속 시간이 훨씬 길어집니다.`
      ],
      sec4Title: "4. 안전하고 투명한 웰니스 이용 수칙",
      sec4Text: [
        `건전하고 투명한 이용 환경을 위해 ${districtName} 고객님께서는 다음 사항을 사전에 확인하시는 것이 좋습니다. 신뢰할 수 있는 공식 등록 파트너는 예약 명목의 불법 선입금을 일절 요구하지 않으며 정찰제 요금 기준을 엄격히 준수합니다.`,
        `또한 최근 디스크 시술을 받았거나 임신, 급성 염증 질환이 있는 경우에는 관리 시작 전 담당 힐러에게 컨디션을 명확히 전달하여 안전한 맞춤 압 조절을 진행하시길 권장합니다.`
      ]
    },
    {
      subtitle: `${districtName} 거주자 및 방문객을 위한 일상 스트레스 리셋 솔루션`,
      sec1Title: "1. 만성 스트레스와 자율신경계 불균형이 신체에 미치는 영향",
      sec1Text: [
        `${districtName} 도심 속에서 바쁜 스케줄을 소화하다 보면 교감 신경이 장기간 흥분 상태를 유지하게 됩니다. 자율신경계의 균형이 깨지면 혈관이 수축하고 전신의 모세혈관 순환이 정체되며, 이는 불면증과 만성 피로, 소화 불량 등 다양한 신체화 증상으로 발현됩니다.`,
        `신체 표면을 섬세하고 일정한 리듬으로 터치하는 이완 요법은 감각 수용기를 자극하여 옥시토신과 엔도르핀 분비를 유도합니다. 이를 통해 긴장되어 있던 중추 신경계가 안정 국면으로 전환되며, 뇌파가 안정 상태(알파파)로 접어들어 깊은 숙면을 유도하는 토대가 형성됩니다.`
      ],
      sec2Title: "2. 부종 완화와 디톡스를 위한 림프 순환 케어의 원리",
      sec2Text: [
        `림프계는 혈액순환과 달리 자체적인 펌프 기능이 없어 근육의 수축과 이완, 또는 외부의 부드러운 수기 압력에 의존해 흐름을 유지합니다. 림프절이 집중된 쇄골 하부, 겨드랑이 액와부, 서혜부 주변이 경직되면 체내 잉여 수분과 노폐물이 정체되어 부종과 피부 톤 저하를 일으킵니다.`,
        `림프 테라피는 강한 지압 대신 피부 층을 미세하게 당기고 밀어내는 유러피언 림프 드레니쥐 기법을 활용합니다. 무겁고 둔탁했던 팔다리가 한결 가벼워지고, 신진대사가 활발해져 전신 순환 컨디션이 눈에 띄게 개선되는 경험을 누리실 수 있습니다.`
      ],
      sec3Title: "3. 따뜻한 온도 환경과 아로마 블렌딩의 시너지",
      sec3Text: [
        `테라피를 받으실 때 실내 온도는 23~25도 내외로 아늑하게 유지되는 것이 중요합니다. 체온이 따뜻하게 유지될 때 모공이 열리고 모세혈관 확장이 촉진되어 유효 성분의 흡수율이 높아지기 때문입니다.`,
        `라벤더, 유칼립투스, 베르가못 등 천연 식물에서 추출한 순수 에센셜 오일의 향기는 후각 신경을 통해 대뇌 변연계에 즉각 도달하여 감정적 불안과 긴장을 차분히 가라앉혀 줍니다. 피부 결 케어와 정신적 안정감을 동시에 완성하는 이유입니다.`
      ],
      sec4Title: "4. 올바른 테라피 이용 및 사후 관리 팁",
      sec4Text: [
        `관리를 마친 후에는 체내 노폐물 배출이 활발해지므로 미온수를 충분히 섭취해 주는 것이 바람직합니다. 관리 당일에는 무리한 고강도 운동이나 과도한 음주를 삼가고 따뜻한 휴식을 취해야 근육의 미세 이완 효과가 오래 보존됩니다.`,
        `${districtName} 케어존마사지는 고객 여러분께서 믿고 선택하실 수 있도록 위생 수칙과 에티켓을 준수하는 검증된 매장 정보만을 엄선하여 실시간 제공합니다.`
      ]
    },
    {
      subtitle: `${districtName} 바디 컨디셔닝을 위한 체계적 근막 릴렉싱 분석`,
      sec1Title: "1. 보행 패턴과 골반 주변 근육의 긴장 패턴 해소",
      sec1Text: [
        `장시간 서 있거나 잦은 도보 이동을 하는 ${districtName} 고객님들의 경우, 골반 주변의 중둔근과 이상근, 요방형근에 비대칭적인 하중이 실리기 쉽습니다. 골반 지지근이 뻣뻣해지면 허리 하부와 허벅지 뒤쪽 햄스트링까지 연쇄적인 긴장이 발생합니다.`,
        `체계적인 바디 컨디셔닝은 단순한 피부 마찰을 넘어 근육의 기시부와 정지부를 정밀하게 짚어주는 수기 요법을 적용합니다. 흐트러진 좌우 골반 밸런스를 바로잡아 보행 시 피로도를 현저히 낮추고 하체 부근의 답답함을 시원하게 덜어냅니다.`
      ],
      sec2Title: "2. 표층근과 심부근을 동시에 다루는 딥티슈 테라피의 이해",
      sec2Text: [
        `일반적인 릴렉싱 관리로 해소되지 않는 만성 통증은 대개 피부 깊숙한 속근육(심부근막)에 트리거 포인트(통증 유발점)가 형성되어 있기 때문입니다.`,
        `딥티슈 프로그램은 팔꿈치와 손꿈치를 활용하여 일정한 지속 압력을 심부 조직까지 서서히 전달합니다. 굳어있던 매듭 부위가 점진적으로 풀리면서 만성적으로 무겁던 등과 어깨, 허리의 운동 반경이 부드럽게 복원되는 효과를 체감하실 수 있습니다.`
      ],
      sec3Title: "3. 시간 절약과 에너지 보존을 위한 방문형 케어의 가치",
      sec3Text: [
        `바쁜 현대 사회에서 이동 시간을 줄이는 것은 가장 스마트한 자기 관리 방식 중 하나입니다. 번화가 매장을 직접 찾아가는 과정에서 소모되는 주차 스트레스와 대기 시간을 덜어낼 수 있습니다.`,
        `내가 가장 편안함을 느끼는 개인 공간에서 조용하게 진행되는 1:1 맞춤 세션은 물리적 에너지 소모 없이 온전히 관리 자체에만 집중할 수 있는 최적의 환경을 선사합니다.`
      ],
      sec4Title: "4. 투명한 가격 정책과 매너 있는 웰니스 문화",
      sec4Text: [
        `케어존마사지는 사전 공시된 정찰제 요금제 원칙을 엄격하게 적용하여 부당한 추가 요금 요구를 사전에 방지합니다. 누구나 투명하고 명확한 기준 아래에서 안심하고 코스를 선택하실 수 있습니다.`,
        `철저한 소독과 위생 어메니티를 갖춘 전문 관리사와의 신뢰 관계를 통해 ${districtName} 전역 어디서든 수준 높은 휴식의 가치를 누려보시기 바랍니다.`
      ]
    }
  ];

  return sectionsGroup[seed % sectionsGroup.length];
}

export async function generateMetadata({ params, searchParams }: PageProps): Promise<Metadata> {
  const resolvedParams = await params;
  const resolvedSearchParams = searchParams ? await searchParams : {};

  const { region, district } = resolvedParams;
  const dongName = resolvedSearchParams?.dong ? safeDecode(resolvedSearchParams.dong) : "";
  const districtName = safeDecode(district);
  const regionFullName = getRegionFullName(region);

  const displayLocation = dongName ? `${districtName}${dongName}` : districtName;
  const charSum = (displayLocation + region).split("").reduce((acc, c) => acc + c.charCodeAt(0), 0);
  const pattern = SEO_PATTERNS[Math.abs(charSum) % SEO_PATTERNS.length];

  const finalTitle = `${displayLocation}${pattern.title} | 케어존마사지`;
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

  const displayLocation = dongName ? `${districtName}${dongName}` : districtName;
  const charSum = (displayLocation + region).split("").reduce((acc, c) => acc + c.charCodeAt(0), 0);
  const pattern = SEO_PATTERNS[Math.abs(charSum) % SEO_PATTERNS.length];

  const article = getDynamicDistrictInsight(districtName, Math.abs(charSum));

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

      <div className="sr-only" aria-hidden="true">
        <h1>{displayLocation} {pattern.title}</h1>
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

      <main className="max-w-4xl mx-auto px-4 py-8 w-full flex-1 space-y-12">
        <section className="relative rounded-3xl overflow-hidden border border-amber-500/30 shadow-[0_0_40px_rgba(245,158,11,0.12)] bg-[#141418]">
          <div className="p-6 md:p-10 space-y-2">
            <span className="text-amber-400 text-xs font-black tracking-widest uppercase mb-1 block">
              {regionFullName.toUpperCase()} · DISTRICT WELLNESS HUB
            </span>
            <h1 className="text-2xl md:text-4xl font-black text-white drop-shadow-md">
              {displayLocation} {pattern.title}
            </h1>
            <p className="text-xs md:text-sm text-gray-300 mt-2 max-w-xl leading-relaxed">
              {pattern.desc(districtName)}
            </p>
          </div>
        </section>

        <section className="space-y-4">
          <div className="flex items-center justify-between border-b border-white/10 pb-3">
            <h2 className="text-lg font-black text-white flex items-center gap-2">
              <span className="w-2 h-4 bg-amber-400 rounded-full inline-block"></span>
              📍 {districtName} 동별 안내 바로가기
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

        <ClientTextMixer region={region} district={districtName} dongName={dongName} />

        <section className="bg-[#0e0e12] p-6 sm:p-10 rounded-3xl border border-white/10 space-y-8 text-gray-300 leading-relaxed text-xs sm:text-sm">
          <div className="border-b border-white/10 pb-4">
            <span className="text-amber-400 font-extrabold text-xs tracking-widest block uppercase mb-1">
              WELLNESS & BODY CARE INSIGHT
            </span>
            <h2 className="text-xl sm:text-2xl font-black text-white">
              {article.subtitle}
            </h2>
            <p className="text-gray-400 text-xs mt-1">
              {districtName} 고객님을 위한 신체 불균형 개선 원리와 테라피 선택 가이드
            </p>
          </div>

          <div className="space-y-3">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <span className="text-amber-400">●</span> {article.sec1Title}
            </h3>
            {article.sec1Text.map((p, idx) => (
              <p key={idx}>{p}</p>
            ))}
          </div>

          <div className="space-y-3">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <span className="text-amber-400">●</span> {article.sec2Title}
            </h3>
            {article.sec2Text.map((p, idx) => (
              <p key={idx}>{p}</p>
            ))}
          </div>

          <div className="space-y-3">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <span className="text-amber-400">●</span> {article.sec3Title}
            </h3>
            {article.sec3Text.map((p, idx) => (
              <p key={idx}>{p}</p>
            ))}
          </div>

          <div className="space-y-3">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <span className="text-amber-400">●</span> {article.sec4Title}
            </h3>
            {article.sec4Text.map((p, idx) => (
              <p key={idx}>{p}</p>
            ))}
          </div>

          <div className="pt-4 border-t border-white/5 text-[11px] text-gray-500">
            * 본 가이드는 {districtName} 지역 거주자 및 방문객 여러분의 올바른 신체 건강 상식과 투명한 테라피 서비스 이용을 돕기 위해 작성된 정보성 칼럼입니다.
          </div>
        </section>

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