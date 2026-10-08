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

// 🎯 40가지 순환형 SEO 패턴 (수식어 분리 타이틀 + 동이름 밀착 결합 디스크립션)
const SEO_PATTERNS = [
  { title: "출장 웰니스 마사지 & 프리미엄 힐링 케어", desc: (d: string) => `${d}출장마사지 안심 가이드. 나만의 편안한 공간에서 경험하는 1:1 맞춤 바디 테라피 코스와 정찰제 요금을 케어존마사지에서 확인하세요.` },
  { title: "출장 스웨디시 마사지 감성 바디 릴렉스", desc: (d: string) => `${d}출장마사지 추천 코스 안내. 섬세한 터치와 부드러운 오일 이완 프로그램으로 지친 피로를 풀어드립니다.` },
  { title: "출장 아로마 마사지 오일 테라피 안내", desc: (d: string) => `${d}출장마사지 힐링 케어. 천연 에센셜 오일로 누적된 일상 스트레스를 부드럽게 비워내는 솔루션입니다.` },
  { title: "출장 타이 마사지 정통 바디 스트레칭", desc: (d: string) => `${d}출장마사지 전문 안내. 숙련된 테라피스트의 전신 스트레칭과 시원한 압 조절로 굳은 몸을 개운하게 풀어드립니다.` },
  { title: "출장 릴렉스 마사지 집중 피로 회복", desc: (d: string) => `${d}출장마사지 큐레이션. 집이나 편안한 숙소에서 언제든 프라이빗하게 누리는 맞춤형 힐링 플랫폼입니다.` },
  { title: "출장 딥티슈 마사지 속근육 집중 케어", desc: (d: string) => `${d}출장마사지 프로그램. 만성적인 목 어깨 결림과 등, 허리의 뭉친 피로를 집중적으로 완화해 드립니다.` },
  { title: "출장 림프 순환 마사지 바디 솔루션", desc: (d: string) => `${d}출장마사지 정찰제 안내. 정체된 신체 림프 순환을 돕고 붓기 관리에 집중한 편안한 웰니스 케어입니다.` },
  { title: "출장 감성 테라피 마사지 제휴 안내", desc: (d: string) => `${d}출장마사지 실시간 연결. 편안한 휴식을 제공하는 검증된 파트너 샵 정보를 한눈에 비교해 보세요.` },
  { title: "출장 밸런스 힐링 마사지 가이드", desc: (d: string) => `${d}출장마사지 추천. 균형 잡힌 바디 컨디션과 활력 회복을 돕는 1:1 방문 맞춤 테라피를 만나보세요.` },
  { title: "출장 프리미엄 바디 마사지 힐링 안내", desc: (d: string) => `${d}출장마사지 VIP 안내. 고급 천연 오일과 세심한 케어가 어우러진 최고급 릴렉싱 프로그램을 안내합니다.` },
  { title: "출장 건식 스트레칭 마사지 포인트 케어", desc: (d: string) => `${d}출장마사지 코스 비교. 끈적임 없이 산뜻하게 굳은 근육의 긴장을 해소하는 수기 스트레칭 케어입니다.` },
  { title: "출장 에스테틱 힐링 마사지 바디 웰빙", desc: (d: string) => `${d}출장마사지 안내. 피부 보습과 뭉친 피로 회복을 함께 챙기는 복합 바디 웰니스 트리트먼트를 경험하세요.` },
  { title: "출장 로열 바디케어 마사지 1:1 안내", desc: (d: string) => `${d}출장마사지 매칭 플랫폼. 독립된 프라이빗 공간에서 온전한 휴식을 누리는 스마트 힐링 가이드라인을 제공합니다.` },
  { title: "출장 소프트 아로마 마사지 포근한 이완", desc: (d: string) => `${d}출장마사지 가이드. 자극 없는 편안한 손길로 일상의 피로와 스트레스를 부드럽게 녹여드립니다.` },
  { title: "출장 호텔식 럭셔리 마사지 프라이빗 케어", desc: (d: string) => `${d}출장마사지 웰니스 솔루션. 정갈한 서비스와 수준 높은 테라피 프로그램을 투명한 정찰제로 이용하세요.` }
];

// 🌿 동(Dong)마다 문장 구조와 내용이 통째로 바뀌는 1,800자 분량의 동적 정보성 글 생성기
function getDynamicDongInsight(districtName: string, dongName: string, seed: number) {
  const dongInsightGroups = [
    // [세트 A] 동네 생활권 직장인 피로 / 거북목·승모근 / 타이 vs 스웨디시 / 홈케어의 가치
    {
      subtitle: `${dongName} 거주자 및 직장인을 위한 1:1 맞춤 바디 테라피 인사이트`,
      sec1Title: `1. ${dongName} 일대 직장인들의 좌식 업무와 승모근 긴장 완화`,
      sec1Text: [
        `${districtName} ${dongName}은 활발한 상업 공간과 주거 단지가 조화를 이루는 곳으로, 일상 업무나 컴퓨터 작업 등으로 인한 상체 근육의 긴장도가 높게 나타나는 지역입니다. 장시간 키보드와 마우스를 조작하다 보면 어깨가 안으로 말리는 라운드 숄더와 거북목 자세가 유발되기 쉽습니다. 이는 목덜미 후두하근과 상부 승모근에 지속적인 부하를 주어 혈액 순환을 저해하고, 만성적인 어깨 뻐근함과 두중감(머리가 무거운 증상)을 일으킵니다.`,
        `이러한 국소 근막 긴장을 효과적으로 완화하기 위해서는 체온을 안정적으로 유지하면서 단축된 근섬유를 결을 따라 부드럽게 늘려주는 수기 요법이 필요합니다. 굳어있던 혈관이 확장되면서 림프액과 혈액 순환이 촉진되고, 근육 내부에 쌓인 피로 부산물이 빠르게 배출되어 가벼운 어깨 컨디션을 회복할 수 있습니다.`
      ],
      sec2Title: "2. 컨디션에 따른 건식 타이와 스웨디시 오일 케어 비교",
      sec2Text: [
        `테라피를 선택할 때는 당일의 피로도와 신체 통증 양상을 파악하는 것이 중요합니다. 건식 기법의 대표인 타이는 별도의 오일 없이 진행되며, 관절의 가동 범위를 넓혀주는 수동적 전신 스트레칭을 핵심으로 합니다. 평소 운동량이 적어 관절 마디가 굳었거나 허리 및 하체의 묵직함을 개운하게 해소하고 싶을 때 알맞습니다.`,
        `반면 프리미엄 스웨디시는 식물성 오일을 도포하여 심장 방향으로 부드럽고 리드미컬하게 밀어 올리는 림프 순환 중심 테크닉입니다. 피부 표면의 자극 없이 정서적 안정과 깊은 신체 이완을 유도하므로, 스트레스로 인해 불면증을 겪거나 은은한 휴식을 원하는 분들에게 만족스러운 결과를 제공합니다.`
      ],
      sec3Title: `3. ${dongName} 프라이빗 룸에서 누리는 힐링의 환경적 장점`,
      sec3Text: [
        `테라피의 생리학적 효과를 온전히 누리기 위해서는 심리적 안정감이 필수적입니다. 외부 매장으로 직접 이동할 때 소모되는 교통 체증, 주차 스트레스, 대중교통 이용은 무의식중에 코르티솔 분비를 촉진할 수 있습니다.`,
        `반면 내가 가장 익숙한 독립된 공간에서 진행되는 홈케어는 외부 자극이 원천 차단되어 부교감 신경계가 빠르게 활성화됩니다. 세션이 끝난 후 환복이나 추가 이동 없이 바로 아늑한 수면으로 이어질 수 있어 힐링의 잔여 효과가 다음 날 아침까지 편안하게 지속됩니다.`
      ],
      sec4Title: "4. 안전하고 투명한 정찰제 이용 수칙",
      sec4Text: [
        `${dongName}출장마사지 서비스를 이용하실 때는 건전성과 투명성을 갖춘 공식 플랫폼을 확인하시는 것이 안전합니다. 정상적인 제휴 파트너는 예약 명목의 불법 선입금을 요구하지 않으며, 사전 공시된 정찰제 요금 기준을 엄격히 준수합니다.`,
        `허리 디스크 등 특정 질환이 있거나 임신 중인 경우 세션 시작 전 담당 힐러에게 미리 전달하시면 세심한 맞춤 압 조절을 통해 가장 안전한 웰니스 케어를 경험하실 수 있습니다.`
      ]
    },

    // [세트 B] 스트레스 호르몬 조절 / 림프 순환과 부종 / 아로마 시너지 / 숙면 유도
    {
      subtitle: `${dongName} 웰니스 라이프를 위한 전신 림프 순환 & 디톡스 솔루션`,
      sec1Title: `1. 만성 피로와 교감신경 흥분이 신체에 미치는 생리적 영향`,
      sec1Text: [
        `현대인의 불규칙한 생활 습관과 과중한 스트레스는 체내 자율신경계의 밸런스를 무너뜨리는 주된 요인입니다. 교감신경이 지속적으로 긴장하면 말초 혈관이 수축하여 손발이 차가워지고, 근육이 무의식중에 수축 상태를 유지하게 됩니다. 이러한 긴장 상태가 지속되면 체내 노폐물 배출이 지연되고 아침에 기상할 때 몸이 무거운 만성 피로 증후군으로 발전합니다.`,
        `정성 어린 감성 터치와 균일한 리듬의 이완 요법은 감각 신경을 안정시키고 옥시토신과 세로토닌의 분비를 촉진합니다. 이를 통해 긴장되어 있던 신체가 회복 모드로 전환되며, 전신에 온기가 돌면서 자연스러운 활력을 되찾게 됩니다.`
      ],
      sec2Title: "2. 부종 완화와 혈액 순환을 위한 림프 배농 테라피",
      sec2Text: [
        `림프계는 신체의 자가 정화 시스템 역할을 수행하지만 혈관과 달리 심장과 같은 자체 박동 펌프가 없습니다. 장시간 앉아 있거나 서 있는 생활로 서혜부(사타구니)와 액와부(겨드랑이) 주변 림프절이 뭉치면 림프액 흐름이 정체되어 하체 부종과 신체 피로도가 급격히 상승합니다.`,
        `림프 순환 케어는 강한 지압을 피하고 림프의 자연스러운 흐름 방향에 맞추어 피부층을 섬세하게 밀어주는 기법을 사용합니다. 이를 통해 축적된 잉여 수분과 대사 폐기물이 림프관으로 원활히 흡수되어 둔탁했던 다리와 전신이 한결 가벼워지는 것을 체감할 수 있습니다.`
      ],
      sec3Title: "3. 식물성 에센셜 아로마 오일의 릴렉싱 메커니즘",
      sec3Text: [
        `아로마 오일 테라피는 천연 식물 추출물의 유효 성분과 후각적 자극을 동시에 활용하는 복합 힐링 기법입니다. 실내를 은은하게 채우는 에센셜 향기는 대뇌 변연계에 직접 작용하여 불안과 긴장을 완화하는 신경 전달 물질을 유도합니다.`,
        `동시에 호호바, 스위트 아몬드 등 고급 베이스 오일이 피부 장벽에 수분막을 형성하여 건조한 환절기 피부를 윤택하게 가꾸어 줍니다. 몸의 긴장 완화와 피부 케어를 동시에 완성하는 이유입니다.`
      ],
      sec4Title: `4. ${dongName} 제휴 매장 신뢰 이용 팁`,
      sec4Text: [
        `케어존마사지는 ${dongName} 전역의 고객 여러분께서 안심하고 힐링을 누리실 수 있도록 엄격한 위생 점검과 검증 절차를 통과한 파트너만을 선별합니다.`,
        `세션 후에는 미온수를 충분히 마셔 체내로 방출된 노폐물이 땀과 소변으로 원활히 배출되도록 돕고, 관리 당일은 과음을 피하고 충분한 수면을 취하는 것이 릴렉싱 효과를 극대화하는 비결입니다.`
      ]
    },

    // [세트 C] 보행 습관과 골반 지지근 / 딥티슈 속근육 / 시간 절약 방문 가치 / 에티켓
    {
      subtitle: `${dongName} 바디 컨디셔닝을 위한 체계적 근골격계 릴렉싱 가이드`,
      sec1Title: `1. 보행 패턴과 골반 주변 근육의 긴장 메커니즘`,
      sec1Text: [
        `${districtName} ${dongName} 일대를 중심으로 대중교통 이용과 잦은 도보 이동을 반복하는 경우, 척추를 받쳐주는 골반 지지근(중둔근, 이상근, 장요근)에 불균형한 하중이 가해집니다. 특히 짝다리를 짚거나 다리를 꼬는 습관은 골반의 미세한 뒤틀림을 유발하여 허리 하부와 허벅지 뒤쪽 햄스트링에 연쇄적인 뻐근함을 초래합니다.`,
        `체계적인 바디 컨디셔닝 요법은 단순히 겉 근육만을 문지르는 것이 아니라 골반과 척추 주변의 심부 지지근을 정교하게 짚어냅니다. 틀어진 좌우 밸런스를 정돈함으로써 보행 시 하체 피로도를 낮추고 안정적인 신체 정렬을 완성합니다.`
      ],
      sec2Title: "2. 뭉친 속근육을 풀어내는 딥티슈 테크닉의 이해",
      sec2Text: [
        `오랜 기간 묵혀둔 만성 피로는 표층 근육 아래 위치한 심부 근막에 단단한 매듭 형태의 트리거 포인트가 형성되어 발생합니다. 가벼운 터치만으로는 도달하기 힘든 이 부위는 전문적인 딥티슈 기법을 통해 다루어야 합니다.`,
        `체중을 실은 일정한 지속 압력을 심부 조직에 전달함으로써 굳어있던 근막을 분리하고 정상적인 탄력을 회복시킵니다. 세션 직후 뻐근했던 허리와 등줄기가 개운하게 열리는 상쾌함을 경험하실 수 있습니다.`
      ],
      sec3Title: "3. 방문형 케어가 제공하는 프라이빗 시간의 효율성",
      sec3Text: [
        `바쁜 현대인에게 이동 시간을 절약하는 것은 가장 현명한 컨디션 관리 전략입니다. 주차 공간을 찾거나 대기 시간을 기다리는 피로를 덜어내고, 내가 지정한 시간에 프라이빗한 관리를 누릴 수 있습니다.`,
        `누구의 방해도 받지 않는 아늑한 공간에서 진행되는 세션은 정신적 휴식과 신체적 재생을 동시에 도모할 수 있는 최적의 환경을 선사합니다.`
      ],
      sec4Title: "4. 매너 있는 이용과 정찰제 서비스 신뢰",
      sec4Text: [
        `${dongName} 공식 제휴 샵들은 사전에 명시된 투명한 코스별 정찰제 요금을 적용하여 이용자에게 혼선을 주지 않습니다.`,
        `위생 어메니티와 소독을 철저히 마친 전문 관리사와의 신뢰 관계를 통해 ${dongName} 일대 어디서나 격조 높은 프라이빗 테라피를 편안하게 누려보시기 바랍니다.`
      ]
    }
  ];

  return dongInsightGroups[seed % dongInsightGroups.length];
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { region, district, dong } = await params;
  const districtName = safeDecode(district);
  const dongName = safeDecode(dong);

  const displayLocation = `${districtName} ${dongName}`;
  const charSum = (displayLocation + region).split("").reduce((acc, c) => acc + c.charCodeAt(0), 0);
  const pattern = SEO_PATTERNS[Math.abs(charSum) % SEO_PATTERNS.length];

  const finalTitle = `${displayLocation} ${pattern.title} | 케어존마사지`;
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
      `${displayLocation} 출장 웰니스 마사지`,
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

  // 동의 고유 해시값으로 매핑되는 맞춤형 1,800자 칼럼 데이터 추출
  const article = getDynamicDongInsight(districtName, dongName, Math.abs(charSum));

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

      {/* 네이버 Yeti 크롤러 수집용 SSR 시맨틱 블록 */}
      <div className="sr-only" aria-hidden="true">
       <h1>{displayLocation} {pattern.title}</h1>
        <p>{pattern.desc(dongName)}</p>
      </div>

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

      <main className="max-w-4xl mx-auto px-4 py-8 w-full flex-1 space-y-12">
        {/* 상단 동별 대표 배너 (분리형 타이틀 사용) */}
        <section className="relative rounded-3xl overflow-hidden border border-amber-500/30 shadow-[0_0_40px_rgba(245,158,11,0.12)] bg-[#141418]">
          <div className="p-6 md:p-10 space-y-2">
            <span className="text-amber-400 text-xs font-black tracking-widest uppercase mb-1 block">
              {regionFullName.toUpperCase()} · {districtName.toUpperCase()} · {dongName.toUpperCase()}
            </span>
            <h1 className="text-2xl md:text-4xl font-black text-white drop-shadow-md">
  {displayLocation} {pattern.title}
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

        {/* 📚 [동마다 완전히 다른 문단이 출력되는 약 1,800자 정보성 웰니스 섹션] */}
        <section className="bg-[#0e0e12] p-6 sm:p-10 rounded-3xl border border-white/10 space-y-8 text-gray-300 leading-relaxed text-xs sm:text-sm">
          <div className="border-b border-white/10 pb-4">
            <span className="text-amber-400 font-extrabold text-xs tracking-widest block uppercase mb-1">
              LOCAL WELLNESS & CARE GUIDE
            </span>
            <h2 className="text-xl sm:text-2xl font-black text-white">
              {article.subtitle}
            </h2>
            <p className="text-gray-400 text-xs mt-1">
              {displayLocation} 고객님을 위한 신체 피로 회복 원리와 프라이빗 테라피 이용 가이드
            </p>
          </div>

          {/* 단락 1 */}
          <div className="space-y-3">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <span className="text-amber-400">●</span> {article.sec1Title}
            </h3>
            {article.sec1Text.map((p, idx) => (
              <p key={idx}>{p}</p>
            ))}
          </div>

          {/* 단락 2 */}
          <div className="space-y-3">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <span className="text-amber-400">●</span> {article.sec2Title}
            </h3>
            {article.sec2Text.map((p, idx) => (
              <p key={idx}>{p}</p>
            ))}
          </div>

          {/* 단락 3 */}
          <div className="space-y-3">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <span className="text-amber-400">●</span> {article.sec3Title}
            </h3>
            {article.sec3Text.map((p, idx) => (
              <p key={idx}>{p}</p>
            ))}
          </div>

          {/* 단락 4 */}
          <div className="space-y-3">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <span className="text-amber-400">●</span> {article.sec4Title}
            </h3>
            {article.sec4Text.map((p, idx) => (
              <p key={idx}>{p}</p>
            ))}
          </div>

          <div className="pt-4 border-t border-white/5 text-[11px] text-gray-500">
            * 본 콘텐츠는 {dongName}출장마사지 이용 고객 여러분의 건강한 라이프스타일과 안전한 힐링 테라피 정보 제공을 목적으로 작성되었습니다.
          </div>
        </section>

        {/* 이용 가이드 4단계 */}
        <section className="bg-[#0f0f13] p-6 md:p-8 rounded-3xl border border-amber-500/20 space-y-6">
          <div className="text-center">
            <span className="text-amber-400 text-xs font-bold tracking-widest uppercase">SERVICE PROCESS</span>
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
                <span className="text-amber-400 font-bold">A.</span> 네, 대다수 제휴 샵에서 당일 예약이 가능하며, 원활한 일정 조율을 위해 1~2시간 전 사전 연락을 권장합니다.
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