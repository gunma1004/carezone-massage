import { Metadata } from "next";
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

// -------------------------------------------------------------
// 🎯 40가지 세부 키워드 SEO 패턴 (동 페이지 전용)
// 타이틀: "출장 [수식어] 마사지" 분리 형태 유지 (네이버 스팸 키워드 필터 회피)
// 디스크립션: "{동이름}출장마사지" 형태로 공백 없이 직접 결합 (검색 가중치 극대화)
// -------------------------------------------------------------
const SEO_PATTERNS = [
  /* 0 */ {
    title: (d: string) => `${d} 출장 웰니스 마사지 & 프리미엄 힐링 케어 | 케어존마사지`,
    desc: (d: string) => `${d}출장마사지 안내. 나만의 편안한 공간에서 경험하는 1:1 맞춤 바디 테라피 코스와 정찰제 요금을 케어존마사지에서 확인하세요.`
  },
  /* 1 */ {
    title: (d: string) => `${d} 출장 스웨디시 마사지 감성 바디 릴렉스 가이드 | 케어존마사지`,
    desc: (d: string) => `${d}출장마사지 추천 코스. 섬세한 터치와 부드러운 압으로 뭉친 긴장을 이완시키는 스웨디시 전문 프로그램을 제공합니다.`
  },
  /* 2 */ {
    title: (d: string) => `${d} 출장 아로마 마사지 오일 테라피 코스 안내 | 케어존마사지`,
    desc: (d: string) => `${d}출장마사지 케어. 천연 에센셜 아로마 오일로 누적된 일상 피로와 스트레스를 부드럽게 비워내는 힐링 솔루션입니다.`
  },
  /* 3 */ {
    title: (d: string) => `${d} 출장 타이 마사지 정통 바디 스트레칭 프로그램 | 케어존마사지`,
    desc: (d: string) => `${d}출장마사지 안내. 숙련된 테라피스트의 정성 어린 전신 스트레칭과 시원한 압 조절로 굳은 몸을 개운하게 풀어드립니다.`
  },
  /* 4 */ {
    title: (d: string) => `${d} 출장 프라이빗 마사지 웰니스 테라피 큐레이션 | 케어존마사지`,
    desc: (d: string) => `${d}출장마사지 전문 큐레이션. 집이나 편안한 숙소에서 언제든 프라이빗하게 누릴 수 있는 맞춤형 바디 관리 플랫폼입니다.`
  },
  /* 5 */ {
    title: (d: string) => `${d} 출장 딥티슈 마사지 집중 릴렉스 케어 추천 | 케어존마사지`,
    desc: (d: string) => `${d}출장마사지 프로그램. 만성적인 어깨 결림과 등, 허리의 속근육 피로를 집중적으로 완화해 드리는 테라피 코스입니다.`
  },
  /* 6 */ {
    title: (d: string) => `${d} 출장 림프케어 마사지 & 바디 순환 솔루션 | 케어존마사지`,
    desc: (d: string) => `${d}출장마사지 정찰제 안내. 정체된 신체 림프 순환을 돕고 붓기 관리에 집중한 편안한 웰니스 힐링 프로그램입니다.`
  },
  /* 7 */ {
    title: (d: string) => `${d} 출장 안심 힐링 마사지 제휴 안내 | 케어존마사지`,
    desc: (d: string) => `${d}출장마사지 실시간 연결. 지친 하루의 피로를 편안하게 해소할 수 있는 검증된 파트너 정보를 한눈에 비교해 보세요.`
  },
  /* 8 */ {
    title: (d: string) => `${d} 출장 밸런스 힐링 마사지 트리트먼트 가이드 | 케어존마사지`,
    desc: (d: string) => `${d}출장마사지 추천. 균형 잡힌 신체 밸런스와 활력 회복을 돕는 전문 테라피스트의 1:1 방문 맞춤 케어를 만나보세요.`
  },
  /* 9 */ {
    title: (d: string) => `${d} 출장 VIP 감성 마사지 최상급 바디 솔루션 | 케어존마사지`,
    desc: (d: string) => `${d}출장마사지 VIP 가이드. 고급 천연 오일과 세심한 케어가 어우러진 최고급 릴렉싱 프로그램을 정직한 가격에 안내합니다.`
  },
  /* 10 */ {
    title: (d: string) => `${d} 출장 건식 릴렉스 마사지 & 포인트 스트레칭 | 케어존마사지`,
    desc: (d: string) => `${d}출장마사지 코스 비교. 오일 없이 쾌적하게 굳은 근육의 긴장을 해소할 수 있는 산뜻한 건식 스트레칭 케어입니다.`
  },
  /* 11 */ {
    title: (d: string) => `${d} 출장 에스테틱 힐링 마사지 & 바디 웰니스 | 케어존마사지`,
    desc: (d: string) => `${d}출장마사지 안내. 피부 보습과 뭉친 피로 회복을 함께 챙길 수 있는 복합 바디 웰니스 트리트먼트를 경험하세요.`
  },
  /* 12 */ {
    title: (d: string) => `${d} 출장 직장인 피로회복 마사지 추천 코스 | 케어존마사지`,
    desc: (d: string) => `${d}출장마사지 솔루션. 컴퓨터 업무와 잦은 스마트폰 사용으로 지친 목과 승모근을 집중적으로 케어해 드립니다.`
  },
  /* 13 */ {
    title: (d: string) => `${d} 출장 1:1 방문 마사지 프라이빗 케어 가이드 | 케어존마사지`,
    desc: (d: string) => `${d}출장마사지 매칭 플랫폼. 이동할 필요 없이 내 방에서 온전한 휴식을 누리는 스마트 힐링 가이드라인을 제공합니다.`
  },
  /* 14 */ {
    title: (d: string) => `${d} 출장 로미로미 감성 마사지 리드미컬 힐링 | 케어존마사지`,
    desc: (d: string) => `${d}출장마사지 인기 코스. 물 흐르듯 부드러운 리듬감으로 깊은 심신 안정을 선사하는 프리미엄 로미로미 테라피입니다.`
  },
  /* 15 */ {
    title: (d: string) => `${d} 출장 천연오일 순환 마사지 프로그램 | 케어존마사지`,
    desc: (d: string) => `${d}출장마사지 상세 안내. 엄선된 식물성 에센셜 블렌딩 오일로 몸과 마음의 긴장을 부드럽게 녹여내는 힐링 코스입니다.`
  },
  /* 16 */ {
    title: (d: string) => `${d} 출장 나이트 릴렉싱 마사지 숙면 유도 케어 | 케어존마사지`,
    desc: (d: string) => `${d}출장마사지 쉼터. 하루 일과 후 편안한 숙면을 돕는 부드러운 이완 프로그램을 원하는 시간대에 이용해 보세요.`
  },
  /* 17 */ {
    title: (d: string) => `${d} 출장 프리미엄 타이 마사지 전신 릴렉스 안내 | 케어존마사지`,
    desc: (d: string) => `${d}출장마사지 안심 서비스. 철저한 매너와 숙련된 실력을 갖춘 전문 관리사의 방문 테라피로 활력을 되찾으세요.`
  },
  /* 18 */ {
    title: (d: string) => `${d} 출장 활력 리프레시 마사지 에너지 부스팅 | 케어존마사지`,
    desc: (d: string) => `${d}출장마사지 프로그램 안내. 찌뿌둥하고 무거운 몸을 가볍고 상쾌하게 리셋해 드리는 리프레시 테라피입니다.`
  },
  /* 19 */ {
    title: (d: string) => `${d} 출장 신속 방문 마사지 수도권 네트워크 | 케어존마사지`,
    desc: (d: string) => `${d}출장마사지 위치별 제휴 안내. 가까운 곳에서 빠르게 안내받을 수 있는 검증된 테라피 샵을 바로 만나보세요.`
  },
  /* 20 */ {
    title: (d: string) => `${d} 출장 소프트 릴렉스 마사지 포근한 이완 케어 | 케어존마사지`,
    desc: (d: string) => `${d}출장마사지 가이드. 자극적인 압 없이 포근하게 감싸주는 부드러운 터칭 프로그램으로 일상의 스트레스를 날려드립니다.`
  },
  /* 21 */ {
    title: (d: string) => `${d} 출장 에센셜 아로마 마사지 프리미엄 안내 | 케어존마사지`,
    desc: (d: string) => `${d}출장마사지 코스 안내. 고품격 에센셜 오일을 사용하여 건조한 피부를 정돈하고 깊은 안정감을 드리는 릴렉싱입니다.`
  },
  /* 22 */ {
    title: (d: string) => `${d} 출장 호텔식 럭셔리 마사지 프라이빗 케어 | 케어존마사지`,
    desc: (d: string) => `${d}출장마사지 웰니스 솔루션. 호텔 스파급의 정갈한 서비스와 케어를 합리적인 가격대로 누려보세요.`
  },
  /* 23 */ {
    title: (d: string) => `${d} 출장 1:1 맞춤형 힐링 마사지 컨디션 케어 | 케어존마사지`,
    desc: (d: string) => `${d}출장마사지 전문 프로그램. 개인별 피로 부위와 당일 컨디션에 맞추어 세심하게 조절하는 1:1 맞춤 테라피입니다.`
  },
  /* 24 */ {
    title: (d: string) => `${d} 출장 청결 안심 마사지 위생 케어 가이드 | 케어존마사지`,
    desc: (d: string) => `${d}출장마사지 신뢰 플랫폼. 철저한 청결 관리와 투명한 정찰제 가이드라인을 준수하는 제휴 파트너만을 안내합니다.`
  },
  /* 25 */ {
    title: (d: string) => `${d} 출장 데일리 릴렉싱 마사지 가벼운 피로회복 | 케어존마사지`,
    desc: (d: string) => `${d}출장마사지 표준 요금표. 매일 받아도 부담 없는 표준 코스별 안내를 통해 편리한 예약을 도와드립니다.`
  },
  /* 26 */ {
    title: (d: string) => `${d} 출장 전신 밸런스 마사지 유연성 케어 안내 | 케어존마사지`,
    desc: (d: string) => `${d}출장마사지 테라피 추천. 오랜 좌식 생활로 굳은 몸에 활력을 불어넣는 체계적인 전신 스트레칭 코스입니다.`
  },
  /* 27 */ {
    title: (d: string) => `${d} 출장 스웨디시 아로마 마사지 복합 프로그램 | 케어존마사지`,
    desc: (d: string) => `${d}출장마사지 베스트 코스. 타이의 시원함과 아로마 스웨디시의 부드러움을 동시에 누릴 수 있는 인기 프로그램입니다.`
  },
  /* 28 */ {
    title: (d: string) => `${d} 출장 프라이빗 쉼터 마사지 온전한 휴식 | 케어존마사지`,
    desc: (d: string) => `${d}출장마사지 큐레이션. 번거로운 이동 없이 가장 아늑한 내 공간에서 온전한 쉼을 경험하실 수 있습니다.`
  },
  /* 29 */ {
    title: (d: string) => `${d} 출장 스트레스 완화 마사지 심신 안정 코스 | 케어존마사지`,
    desc: (d: string) => `${d}출장마사지 안내. 복잡하고 바쁜 일상에서 벗어나 몸과 마음에 진정한 휴식을 선물해 보세요.`
  },
  /* 30 */ {
    title: (d: string) => `${d} 출장 딥 릴렉싱 마사지 전신 순환 가이드 | 케어존마사지`,
    desc: (d: string) => `${d}출장마사지 집중 코스. 깊은 이완 상태로 유도하여 숙면과 전신 순환을 원활하게 돕는 맞춤형 케어입니다.`
  },
  /* 31 */ {
    title: (d: string) => `${d} 출장 타이 스웨디시 마사지 제휴 요금 비교 | 케어존마사지`,
    desc: (d: string) => `${d}출장마사지 정찰제 비교. 투명하게 공시된 코스별 이용 요금을 비교하고 부담 없이 소통해 보세요.`
  },
  /* 32 */ {
    title: (d: string) => `${d} 출장 감성 릴렉스 마사지 섬세한 바디 케어 | 케어존마사지`,
    desc: (d: string) => `${d}출장마사지 테라피. 정성 가득한 테라피스트의 손길로 차분하고 아늑한 분위기 속에서 피로를 해소하세요.`
  },
  /* 33 */ {
    title: (d: string) => `${d} 출장 집중 힐링 마사지 목 어깨 결림 완화 | 케어존마사지`,
    desc: (d: string) => `${d}출장마사지 집중 릴렉스. 뻐근한 등과 뭉친 목 근육을 시원하게 케어하는 전문 맞춤 바디 솔루션입니다.`
  },
  /* 34 */ {
    title: (d: string) => `${d} 출장 온열 아로마 마사지 포근한 힐링 테라피 | 케어존마사지`,
    desc: (d: string) => `${d}출장마사지 웰니스 코스. 따뜻한 온기와 천연 오일이 어우러져 깊은 곳의 피로까지 부드럽게 녹여드립니다.`
  },
  /* 35 */ {
    title: (d: string) => `${d} 출장 웰빙 라이프 마사지 건강한 힐링 가이드 | 케어존마사지`,
    desc: (d: string) => `${d}출장마사지 플랫폼. 활력 넘치는 건강한 내일을 위해 엄선된 수도권 웰니스 프로그램을 지금 확인하세요.`
  },
  /* 36 */ {
    title: (d: string) => `${d} 출장 1인 맞춤 마사지 프라이빗 바디 테라피 | 케어존마사지`,
    desc: (d: string) => `${d}출장마사지 1:1 방문. 누구에게도 방해받지 않는 독립된 공간에서 최고의 릴렉싱을 누리실 수 있습니다.`
  },
  /* 37 */ {
    title: (d: string) => `${d} 출장 럭셔리 스웨디시 마사지 정성 어린 터치 | 케어존마사지`,
    desc: (d: string) => `${d}출장마사지 VIP 프로그램. 엄선된 에센셜 오일과 정성 가득한 관리사의 방문 테라피로 특별한 하루를 완성하세요.`
  },
  /* 38 */ {
    title: (d: string) => `${d} 출장 근육 이완 마사지 운동 후 피로 리셋 | 케어존마사지`,
    desc: (d: string) => `${d}출장마사지 스포츠 릴렉스. 운동이나 야외 활동 후 경직된 전신 근육을 개운하게 풀어주는 맞춤 코스입니다.`
  },
  /* 39 */ {
    title: (d: string) => `${d} 출장 전신 활력 마사지 수도권 추천 안내 | 케어존마사지`,
    desc: (d: string) => `${d}출장마사지 엄선 네트워크. 믿을 수 있는 전문 파트너 샵 정보와 정찰제 요금을 지금 바로 확인하세요.`
  }
];

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { region, district, dong } = await params;
  const districtName = safeDecode(district);
  const dongName = safeDecode(dong);

  const displayLocation = `${districtName} ${dongName}`;
  const charSum = (displayLocation + region).split("").reduce((acc, c) => acc + c.charCodeAt(0), 0);
  const pattern = SEO_PATTERNS[Math.abs(charSum) % SEO_PATTERNS.length];

  // 🏷️ 타이틀: [구이름 동이름] 출장 [수식어] 마사지 (분리형 구조 유지 - 스팸 회피)
  const finalTitle = pattern.title(displayLocation);

  // 📝 디스크립션: [동이름]출장마사지 (공백 없이 직접 결합)
  const finalDescription = pattern.desc(dongName);

  const canonicalUrl = `https://carezone-massage.netlify.app/${region}/${encodeURIComponent(districtName)}/${encodeURIComponent(dongName)}`;

  return {
    title: {
      absolute: finalTitle,
    },
    description: finalDescription,
    alternates: {
      canonical: canonicalUrl,
    },
    keywords: [
      `${dongName}출장마사지`,
      `${dongName} 마사지`,
      `${dongName} 스웨디시`,
      `${districtName} 마사지`,
      `${dongName} 타이마사지`,
      `${displayLocation} 출장 웰니스 마사지`,
      "케어존마사지"
    ],
    robots: {
      index: true,
      follow: true,
    },
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

  // Breadcrumb 및 LocalBusiness 스키마
  const jsonLd = [
    {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      itemListElement: [
        {
          "@type": "ListItem",
          position: 1,
          name: "홈",
          item: "https://carezone-massage.netlify.app",
        },
        {
          "@type": "ListItem",
          position: 2,
          name: districtName,
          item: `https://carezone-massage.netlify.app/${resolved.region}/${encodeURIComponent(districtName)}`,
        },
        {
          "@type": "ListItem",
          position: 3,
          name: `${dongName} 마사지`,
          item: `https://carezone-massage.netlify.app/${resolved.region}/${encodeURIComponent(districtName)}/${encodeURIComponent(dongName)}`,
        },
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
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      {/* 네이버 Yeti 크롤러 수집용 SSR 시맨틱 블록 */}
      <div className="sr-only" aria-hidden="true">
        <h1>{displayLocation} {pattern.title(dongName).replace(" | 케어존마사지", "")}</h1>
        <p>{pattern.desc(dongName)}</p>
      </div>

      <DongDetailClient
        region={resolved.region}
        districtName={districtName}
        dongName={dongName}
        regionFullName={regionFullName}
      />
    </>
  );
}