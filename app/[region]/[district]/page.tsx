import { Metadata } from "next";
import Link from "next/link";
import ClientTextMixer from "./ClientTextMixer";

interface PageProps {
  params: Promise<{
    region: string;
    district: string;
  }>;
  searchParams: Promise<{
    dong?: string;
  }>;
}

// 🛠️️ 이중 URL 인코딩까지 안전하게 풀어내는 디코더
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

// -------------------------------------------------------------
// 🎯 40가지 출장 세부 키워드 SEO 패턴
// 타이틀: "출장 웰니스 마사지", "출장 타이 마사지" 등 분리 형태
// 메타디스크립션: "{지역} 출장 홈 마사지" 형태 배치
// -------------------------------------------------------------
const SEO_PATTERNS = [
  /* 0 */ {
    title: (r: string) => `${r} 출장 웰니스 마사지 & 프리미엄 힐링 케어 | 케어존마사지`,
    desc: (r: string) => `${r} 출장 홈 마사지 안내. 나만의 편안한 공간에서 경험하는 1:1 맞춤 바디 테라피 코스와 정찰제 요금을 케어존마사지에서 확인하세요.`
  },
  /* 1 */ {
    title: (r: string) => `${r} 출장 스웨디시 마사지 감성 바디 릴렉스 가이드 | 케어존마사지`,
    desc: (r: string) => `${r} 출장 홈 마사지 추천 코스. 섬세한 터치와 부드러운 압으로 뭉친 긴장을 이완시키는 스웨디시 전문 프로그램을 제공합니다.`
  },
  /* 2 */ {
    title: (r: string) => `${r} 출장 아로마 마사지 오일 테라피 코스 안내 | 케어존마사지`,
    desc: (r: string) => `${r} 출장 홈 마사지 케어. 천연 에센셜 아로마 오일로 누적된 일상 피로와 스트레스를 부드럽게 비워내는 힐링 솔루션입니다.`
  },
  /* 3 */ {
    title: (r: string) => `${r} 출장 타이 마사지 정통 바디 스트레칭 프로그램 | 케어존마사지`,
    desc: (r: string) => `${r} 출장 홈 마사지 안내. 숙련된 테라피스트의 정성 어린 전신 스트레칭과 시원한 압 조절로 굳은 몸을 개운하게 풀어드립니다.`
  },
  /* 4 */ {
    title: (r: string) => `${r} 출장 프라이빗 마사지 웰니스 테라피 큐레이션 | 케어존마사지`,
    desc: (r: string) => `${r} 출장 홈 마사지 전문 큐레이션. 집이나 편안한 숙소에서 언제든 프라이빗하게 누릴 수 있는 맞춤형 바디 관리 플랫폼입니다.`
  },
  /* 5 */ {
    title: (r: string) => `${r} 출장 딥티슈 마사지 집중 릴렉스 케어 추천 | 케어존마사지`,
    desc: (r: string) => `${r} 출장 홈 마사지 프로그램. 만성적인 어깨 결림과 등, 허리의 속근육 피로를 집중적으로 완화해 드리는 테라피 코스입니다.`
  },
  /* 6 */ {
    title: (r: string) => `${r} 출장 림프케어 마사지 & 바디 순환 솔루션 | 케어존마사지`,
    desc: (r: string) => `${r} 출장 홈 마사지 정찰제 안내. 정체된 신체 림프 순환을 돕고 붓기 관리에 집중한 편안한 웰니스 힐링 프로그램입니다.`
  },
  /* 7 */ {
    title: (r: string) => `${r} 출장 안심 힐링 마사지 제휴 안내 | 케어존마사지`,
    desc: (r: string) => `${r} 출장 홈 마사지 실시간 연결. 지친 하루의 피로를 편안하게 해소할 수 있는 검증된 파트너 정보를 한눈에 비교해 보세요.`
  },
  /* 8 */ {
    title: (r: string) => `${r} 출장 밸런스 힐링 마사지 트리트먼트 가이드 | 케어존마사지`,
    desc: (r: string) => `${r} 출장 홈 마사지 추천. 균형 잡힌 신체 밸런스와 활력 회복을 돕는 전문 테라피스트의 1:1 방문 맞춤 케어를 만나보세요.`
  },
  /* 9 */ {
    title: (r: string) => `${r} 출장 VIP 감성 마사지 최상급 바디 솔루션 | 케어존마사지`,
    desc: (r: string) => `${r} 출장 홈 마사지 VIP 가이드. 고급 천연 오일과 세심한 케어가 어우러진 최고급 릴렉싱 프로그램을 정직한 가격에 안내합니다.`
  },
  /* 10 */ {
    title: (r: string) => `${r} 출장 건식 릴렉스 마사지 & 포인트 스트레칭 | 케어존마사지`,
    desc: (r: string) => `${r} 출장 홈 마사지 코스 비교. 오일 없이 쾌적하게 굳은 근육의 긴장을 해소할 수 있는 산뜻한 건식 스트레칭 케어입니다.`
  },
  /* 11 */ {
    title: (r: string) => `${r} 출장 에스테틱 힐링 마사지 & 바디 웰니스 | 케어존마사지`,
    desc: (r: string) => `${r} 출장 홈 마사지 안내. 피부 보습과 뭉친 피로 회복을 함께 챙길 수 있는 복합 바디 웰니스 트리트먼트를 경험하세요.`
  },
  /* 12 */ {
    title: (r: string) => `${r} 출장 직장인 피로회복 마사지 추천 코스 | 케어존마사지`,
    desc: (r: string) => `${r} 출장 홈 마사지 솔루션. 컴퓨터 업무와 잦은 스마트폰 사용으로 지친 목과 승모근을 집중적으로 케어해 드립니다.`
  },
  /* 13 */ {
    title: (r: string) => `${r} 출장 1:1 방문 마사지 프라이빗 케어 가이드 | 케어존마사지`,
    desc: (r: string) => `${r} 출장 홈 마사지 매칭 플랫폼. 이동할 필요 없이 내 방에서 온전한 휴식을 누리는 스마트 힐링 가이드라인을 제공합니다.`
  },
  /* 14 */ {
    title: (r: string) => `${r} 출장 로미로미 감성 마사지 리드미컬 힐링 | 케어존마사지`,
    desc: (r: string) => `${r} 출장 홈 마사지 인기 코스. 물 흐르듯 부드러운 리듬감으로 깊은 심신 안정을 선사하는 프리미엄 로미로미 테라피입니다.`
  },
  /* 15 */ {
    title: (r: string) => `${r} 출장 천연오일 순환 마사지 프로그램 | 케어존마사지`,
    desc: (r: string) => `${r} 출장 홈 마사지 상세 안내. 엄선된 식물성 에센셜 블렌딩 오일로 몸과 마음의 긴장을 부드럽게 녹여내는 힐링 코스입니다.`
  },
  /* 16 */ {
    title: (r: string) => `${r} 출장 나이트 릴렉싱 마사지 숙면 유도 케어 | 케어존마사지`,
    desc: (r: string) => `${r} 출장 홈 마사지 쉼터. 하루 일과 후 편안한 숙면을 돕는 부드러운 이완 프로그램을 원하는 시간대에 이용해 보세요.`
  },
  /* 17 */ {
    title: (r: string) => `${r} 출장 프리미엄 타이 마사지 전신 릴렉스 안내 | 케어존마사지`,
    desc: (r: string) => `${r} 출장 홈 마사지 안심 서비스. 철저한 매너와 숙련된 실력을 갖춘 전문 관리사의 방문 테라피로 활력을 되찾으세요.`
  },
  /* 18 */ {
    title: (r: string) => `${r} 출장 활력 리프레시 마사지 에너지 부스팅 | 케어존마사지`,
    desc: (r: string) => `${r} 출장 홈 마사지 프로그램 안내. 찌뿌둥하고 무거운 몸을 가볍고 상쾌하게 리셋해 드리는 리프레시 테라피입니다.`
  },
  /* 19 */ {
    title: (r: string) => `${r} 출장 신속 방문 마사지 수도권 네트워크 | 케어존마사지`,
    desc: (r: string) => `${r} 출장 홈 마사지 위치별 제휴 안내. 가까운 곳에서 빠르게 안내받을 수 있는 검증된 테라피 샵을 바로 만나보세요.`
  },
  /* 20 */ {
    title: (r: string) => `${r} 출장 소프트 릴렉스 마사지 포근한 이완 케어 | 케어존마사지`,
    desc: (r: string) => `${r} 출장 홈 마사지 가이드. 자극적인 압 없이 포근하게 감싸주는 부드러운 터칭 프로그램으로 일상의 스트레스를 날려드립니다.`
  },
  /* 21 */ {
    title: (r: string) => `${r} 출장 에센셜 아로마 마사지 프리미엄 안내 | 케어존마사지`,
    desc: (r: string) => `${r} 출장 홈 마사지 코스 안내. 고품격 에센셜 오일을 사용하여 건조한 피부를 정돈하고 깊은 안정감을 드리는 릴렉싱입니다.`
  },
  /* 22 */ {
    title: (r: string) => `${r} 출장 호텔식 럭셔리 마사지 프라이빗 케어 | 케어존마사지`,
    desc: (r: string) => `${r} 출장 홈 마사지 웰니스 솔루션. 호텔 스파급의 정갈한 서비스와 케어를 합리적인 가격대로 누려보세요.`
  },
  /* 23 */ {
    title: (r: string) => `${r} 출장 1:1 맞춤형 힐링 마사지 컨디션 케어 | 케어존마사지`,
    desc: (r: string) => `${r} 출장 홈 마사지 전문 프로그램. 개인별 피로 부위와 당일 컨디션에 맞추어 세심하게 조절하는 1:1 맞춤 테라피입니다.`
  },
  /* 24 */ {
    title: (r: string) => `${r} 출장 청결 안심 마사지 위생 케어 가이드 | 케어존마사지`,
    desc: (r: string) => `${r} 출장 홈 마사지 신뢰 플랫폼. 철저한 청결 관리와 투명한 정찰제 가이드라인을 준수하는 제휴 파트너만을 안내합니다.`
  },
  /* 25 */ {
    title: (r: string) => `${r} 출장 데일리 릴렉싱 마사지 가벼운 피로회복 | 케어존마사지`,
    desc: (r: string) => `${r} 출장 홈 마사지 표준 요금표. 매일 받아도 부담 없는 표준 코스별 안내를 통해 편리한 예약을 도와드립니다.`
  },
  /* 26 */ {
    title: (r: string) => `${r} 출장 전신 밸런스 마사지 유연성 케어 안내 | 케어존마사지`,
    desc: (r: string) => `${r} 출장 홈 마사지 테라피 추천. 오랜 좌식 생활로 굳은 몸에 활력을 불어넣는 체계적인 전신 스트레칭 코스입니다.`
  },
  /* 27 */ {
    title: (r: string) => `${r} 출장 스웨디시 아로마 마사지 복합 프로그램 | 케어존마사지`,
    desc: (r: string) => `${r} 출장 홈 마사지 베스트 코스. 타이의 시원함과 아로마 스웨디시의 부드러움을 동시에 누릴 수 있는 인기 프로그램입니다.`
  },
  /* 28 */ {
    title: (r: string) => `${r} 출장 프라이빗 쉼터 마사지 온전한 휴식 | 케어존마사지`,
    desc: (r: string) => `${r} 출장 홈 마사지 큐레이션. 번거로운 이동 없이 가장 아늑한 내 공간에서 온전한 쉼을 경험하실 수 있습니다.`
  },
  /* 29 */ {
    title: (r: string) => `${r} 출장 스트레스 완화 마사지 심신 안정 코스 | 케어존마사지`,
    desc: (r: string) => `${r} 출장 홈 마사지 안내. 복잡하고 바쁜 일상에서 벗어나 몸과 마음에 진정한 휴식을 선물해 보세요.`
  },
  /* 30 */ {
    title: (r: string) => `${r} 출장 딥 릴렉싱 마사지 전신 순환 가이드 | 케어존마사지`,
    desc: (r: string) => `${r} 출장 홈 마사지 집중 코스. 깊은 이완 상태로 유도하여 숙면과 전신 순환을 원활하게 돕는 맞춤형 케어입니다.`
  },
  /* 31 */ {
    title: (r: string) => `${r} 출장 타이 스웨디시 마사지 제휴 요금 비교 | 케어존마사지`,
    desc: (r: string) => `${r} 출장 홈 마사지 정찰제 비교. 투명하게 공시된 코스별 이용 요금을 비교하고 부담 없이 소통해 보세요.`
  },
  /* 32 */ {
    title: (r: string) => `${r} 출장 감성 릴렉스 마사지 섬세한 바디 케어 | 케어존마사지`,
    desc: (r: string) => `${r} 출장 홈 마사지 테라피. 정성 가득한 테라피스트의 손길로 차분하고 아늑한 분위기 속에서 피로를 해소하세요.`
  },
  /* 33 */ {
    title: (r: string) => `${r} 출장 집중 힐링 마사지 목 어깨 결림 완화 | 케어존마사지`,
    desc: (r: string) => `${r} 출장 홈 마사지 집중 릴렉스. 뻐근한 등과 뭉친 목 근육을 시원하게 케어하는 전문 맞춤 바디 솔루션입니다.`
  },
  /* 34 */ {
    title: (r: string) => `${r} 출장 온열 아로마 마사지 포근한 힐링 테라피 | 케어존마사지`,
    desc: (r: string) => `${r} 출장 홈 마사지 웰니스 코스. 따뜻한 온기와 천연 오일이 어우러져 깊은 곳의 피로까지 부드럽게 녹여드립니다.`
  },
  /* 35 */ {
    title: (r: string) => `${r} 출장 웰빙 라이프 마사지 건강한 힐링 가이드 | 케어존마사지`,
    desc: (r: string) => `${r} 출장 홈 마사지 플랫폼. 활력 넘치는 건강한 내일을 위해 엄선된 수도권 웰니스 프로그램을 지금 확인하세요.`
  },
  /* 36 */ {
    title: (r: string) => `${r} 출장 1인 맞춤 마사지 프라이빗 바디 테라피 | 케어존마사지`,
    desc: (r: string) => `${r} 출장 홈 마사지 1:1 방문. 누구에게도 방해받지 않는 독립된 공간에서 최고의 릴렉싱을 누리실 수 있습니다.`
  },
  /* 37 */ {
    title: (r: string) => `${r} 출장 럭셔리 스웨디시 마사지 정성 어린 터치 | 케어존마사지`,
    desc: (r: string) => `${r} 출장 홈 마사지 VIP 프로그램. 엄선된 에센셜 오일과 정성 가득한 관리사의 방문 테라피로 특별한 하루를 완성하세요.`
  },
  /* 38 */ {
    title: (r: string) => `${r} 출장 근육 이완 마사지 운동 후 피로 리셋 | 케어존마사지`,
    desc: (r: string) => `${r} 출장 홈 마사지 스포츠 릴렉스. 운동이나 야외 활동 후 경직된 전신 근육을 개운하게 풀어주는 맞춤 코스입니다.`
  },
  /* 39 */ {
    title: (r: string) => `${r} 출장 전신 활력 마사지 수도권 추천 안내 | 케어존마사지`,
    desc: (r: string) => `${r} 출장 홈 마사지 엄선 네트워크. 믿을 수 있는 전문 파트너 샵 정보와 정찰제 요금을 지금 바로 확인하세요.`
  }
];

export async function generateMetadata({ params, searchParams }: PageProps): Promise<Metadata> {
  const resolvedParams = await params;
  const resolvedSearchParams = await searchParams;

  const { region, district } = resolvedParams;
  const dongName = resolvedSearchParams.dong ? safeDecode(resolvedSearchParams.dong) : "";
  const districtName = safeDecode(district);
  const regionName = region === "seoul" ? "서울" : region === "incheon" ? "인천" : "경기";

  const locationKeyword = `${regionName} ${districtName} ${dongName}`.trim();
  const simpleLocation = dongName ? `${districtName} ${dongName}` : districtName;

  const charSum = (locationKeyword + dongName + districtName)
    .split("")
    .reduce((acc, char) => acc + char.charCodeAt(0), 0);
  const variantIndex = Math.abs(charSum) % 40;

  const pattern = SEO_PATTERNS[variantIndex] || SEO_PATTERNS[0];
  const finalTitle = pattern.title(simpleLocation);
  const finalDescription = pattern.desc(simpleLocation);

  const canonicalUrl = `https://carezone-massage.netlify.app/${region}/${encodeURIComponent(districtName)}${
    dongName ? `?dong=${encodeURIComponent(dongName)}` : ""
  }`;

  return {
    title: {
      absolute: finalTitle,
    },
    description: finalDescription,
    alternates: {
      canonical: canonicalUrl,
    },
    keywords: [
      `${simpleLocation} 출장 웰니스 마사지`,
      `${simpleLocation} 출장 타이 마사지`,
      `${simpleLocation} 출장 아로마 마사지`,
      `${simpleLocation} 출장 스웨디시 마사지`,
      `${simpleLocation} 출장 홈 마사지`,
      "케어존마사지"
    ],
    openGraph: {
      title: finalTitle,
      description: finalDescription,
      url: canonicalUrl,
      siteName: "케어존마사지",
      locale: "ko_KR",
      type: "website",
    },
  };
}

export default async function RegionalDetailPage({ params, searchParams }: PageProps) {
  const resolvedParams = await params;
  const resolvedSearchParams = await searchParams;

  const { region, district } = resolvedParams;
  const dongName = resolvedSearchParams.dong ? safeDecode(resolvedSearchParams.dong) : "";
  const districtName = safeDecode(district);
  const regionName = region === "seoul" ? "서울특별시" : region === "incheon" ? "인천광역시" : "경기도";

  const fullTitle = dongName 
    ? `${regionName} ${districtName} (${dongName})` 
    : `${regionName} ${districtName}`;
  const simpleTitle = dongName ? `${districtName} ${dongName}` : districtName;

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    "name": `${simpleTitle} 출장 웰니스 마사지 제휴 안내 - 케어존마사지`,
    "description": `${simpleTitle} 출장 홈 마사지 정보. 타이, 아로마, 스웨디시 힐링 바디 테라피 제휴 안내`,
    "url": `https://carezone-massage.netlify.app/${region}/${encodeURIComponent(districtName)}`,
    "telephone": "0507-1280-3344",
    "address": {
      "@type": "PostalAddress",
      "addressLocality": districtName,
      "addressRegion": regionName,
      "addressCountry": "KR"
    }
  };

  return (
    <div className="bg-[#070709] text-gray-100 min-h-screen flex flex-col font-sans selection:bg-amber-500 selection:text-black">
      
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <main className="max-w-4xl mx-auto px-4 py-8 w-full flex-1 space-y-10">
        
        {/* 상단 지역 대표 배너 */}
        <section className="relative rounded-3xl overflow-hidden border border-amber-500/30 shadow-[0_0_40px_rgba(245,158,11,0.12)] bg-[#141418]">
          <div className="p-6 md:p-10 space-y-2">
            <span className="text-amber-400 text-xs font-black tracking-widest uppercase mb-1 block">
              {regionName.toUpperCase()} · LOCAL WELLNESS GUIDE
            </span>
            <h1 className="text-2xl md:text-4xl font-black text-white drop-shadow-md">
              {simpleTitle} 출장 웰니스 마사지 안내
            </h1>
            <p className="text-xs md:text-sm text-gray-300 mt-2 max-w-xl leading-relaxed">
              {simpleTitle} 출장 홈 마사지 고객님을 위한 케어존마사지 프리미엄 가이드입니다. 타이, 아로마, 스웨디시 제휴 샵 코스와 상세 프로그램 정보를 확인해 보세요.
            </p>
          </div>
        </section>

        {/* 샵 리스트는 ClientTextMixer 컴포넌트로 렌더링 */}
        <ClientTextMixer region={region} district={districtName} dongName={dongName} />

        {/* 건강 웰니스 칼럼 섹션 */}
        <section className="bg-[#0e0e12] p-6 md:p-8 rounded-3xl border border-white/10 space-y-4">
          <h3 className="text-base md:text-lg font-bold text-amber-400 flex items-center gap-2">
            <span>🌿</span> {simpleTitle} 일상 피로회복 & 릴렉싱 웰니스 팁
          </h3>
          <div className="text-xs text-gray-300 space-y-3 leading-relaxed">
            <p>
              현대 직장인들이 장시간 앉아서 근무하거나 전자기기를 지속적으로 이용할 경우, 목 주변 근육과 어깨 승모근이 경직되어 만성 피로와 결림을 유발하기 쉽습니다. 이동 없이 편안한 공간에서 받는 출장 타이 마사지 및 아로마 테라피는 전신 순환을 촉진하고 심신 안정에 큰 도움을 줍니다.
            </p>
            <div className="bg-black/50 p-4 rounded-2xl border border-white/5 space-y-2">
              <h4 className="font-bold text-white text-xs">💡 나에게 맞는 출장 프로그램 선택 가이드</h4>
              <ul className="list-disc list-inside space-y-1.5 text-gray-400">
                <li><strong className="text-gray-200">출장 타이 마사지:</strong> 견갑골과 하체의 경직된 부위를 시원하게 풀어주는 스트레칭 중심의 전통 케어.</li>
                <li><strong className="text-gray-200">출장 아로마 마사지:</strong> 은은한 에센셜 오일의 부드러운 압을 이용해 림프 순환과 심신 이완을 돕는 코스.</li>
                <li><strong className="text-gray-200">출장 스웨디시 마사지:</strong> 섬세한 오일 터칭으로 깊은 안정감과 활력을 충전해 주는 인기 프로그램.</li>
              </ul>
            </div>
            <p className="text-gray-500 text-[11px]">
              * 본 콘텐츠는 {simpleTitle} 출장 홈 마사지를 이용하시는 고객 여러분의 건강한 휴식과 올바른 웰니스 정보 제공을 목적으로 작성되었습니다.
            </p>
          </div>
        </section>

        {/* 이용 가이드 4단계 */}
        <section className="bg-[#0f0f13] p-6 md:p-8 rounded-3xl border border-amber-500/20 space-y-6">
          <div className="text-center">
            <span className="text-amber-400 text-xs font-bold tracking-widest uppercase">SERVICE PROCESS</span>
            <h3 className="text-xl font-black text-white mt-1">{simpleTitle} 안심 이용 순서</h3>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-black/60 p-4 rounded-2xl border border-white/5 text-center">
              <span className="text-xs text-amber-400 font-bold">STEP 1</span>
              <h4 className="font-bold text-white mt-1">지역 확인</h4>
              <p className="text-xs text-gray-400 mt-1">{simpleTitle} 제휴 샵 목록을 확인합니다.</p>
            </div>
            <div className="bg-black/60 p-4 rounded-2xl border border-white/5 text-center">
              <span className="text-xs text-amber-400 font-bold">STEP 2</span>
              <h4 className="font-bold text-white mt-1">코스 비교</h4>
              <p className="text-xs text-gray-400 mt-1">타이, 아로마, 스웨디시 프로그램을 비교합니다.</p>
            </div>
            <div className="bg-black/60 p-4 rounded-2xl border border-white/5 text-center">
              <span className="text-xs text-amber-400 font-bold">STEP 3</span>
              <h4 className="font-bold text-white mt-1">직접 소통</h4>
              <p className="text-xs text-gray-400 mt-1">전화 버튼을 통해 샵과 직접 일정을 상담합니다.</p>
            </div>
            <div className="bg-black/60 p-4 rounded-2xl border border-white/5 text-center">
              <span className="text-xs text-amber-400 font-bold">STEP 4</span>
              <h4 className="font-bold text-white mt-1">맞춤 힐링</h4>
              <p className="text-xs text-gray-400 mt-1">전문 힐러의 정성 어린 케어를 경험합니다.</p>
            </div>
          </div>
        </section>

        {/* 자주 묻는 질문 (FAQ) */}
        <section className="space-y-4">
          <div className="text-center">
            <span className="text-amber-400 text-xs font-bold tracking-widest uppercase">FAQ</span>
            <h3 className="text-xl font-black text-white mt-1">{simpleTitle} 자주 묻는 질문</h3>
          </div>
          <div className="space-y-3">
            <div className="bg-black/60 p-4 rounded-2xl border border-white/5 space-y-1.5">
              <div className="font-bold text-sm text-gray-200 flex items-center gap-2">
                <span className="text-amber-400">Q.</span> {simpleTitle} 출장 홈 마사지 제휴 샵 예약은 어떻게 하나요?
              </div>
              <p className="text-xs text-gray-400 pl-6 leading-relaxed">
                <span className="text-amber-400 font-bold">A.</span> 원하시는 샵 카드의 전화연결 버튼을 누르시면 해당 업체 매니저와 직접 프로그램 및 시간을 조율하실 수 있습니다.
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

      {/* 푸터 영역 */}
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