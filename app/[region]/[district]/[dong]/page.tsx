// app/[region]/[district]/[dong]/page.tsx
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

// 네이버 로봇이 읽어갈 동별 고유 메타데이터 동적 생성
export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { region, district, dong } = await params;
  const regionFullName = getRegionFullName(region);
  const districtName = safeDecode(district);
  const dongName = safeDecode(dong);

  const title = `${dongName} 출장 홈 마사지·스웨디시 추천 제휴점 안내 | 케어존마사지`;
  const description = `${regionFullName} ${districtName} ${dongName} 출장 홈 마사지, 스웨디시, 타이, 천연 아로마 케어 추천 제휴 샵 정보 및 정찰제 요금 안내. 케어존마사지에서 맞춤형 힐링 테라피를 확인하세요.`;
  const canonicalUrl = `https://carezone-massage.netlify.app/${region}/${encodeURIComponent(districtName)}/${encodeURIComponent(dongName)}`;

  return {
    title,
    description,
    keywords: [
      `${dongName}출장 홈 마사지`,
      `${dongName}스웨디시`,
      `${districtName}마사지`,
      `${dongName}타이마사지`,
      `${dongName}아로마테라피`,
      "케어존마사지",
    ],
    alternates: {
      canonical: canonicalUrl,
    },
    openGraph: {
      title,
      description,
      url: canonicalUrl,
      siteName: "케어존마사지",
      locale: "ko_KR",
      type: "website",
    },
  };
}

export default async function Page({ params }: PageProps) {
  const resolved = await params;
  const regionFullName = getRegionFullName(resolved.region);
  const districtName = safeDecode(resolved.district);
  const dongName = safeDecode(resolved.dong);

  // 구조화 데이터 (JSON-LD Breadcrumb & LocalBusiness Guide)
  const jsonLd = {
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
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <DongDetailClient
        region={resolved.region}
        districtName={districtName}
        dongName={dongName}
        regionFullName={regionFullName}
      />
    </>
  );
}