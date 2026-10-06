import { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

interface PageProps {
  params: Promise<{
    region?: string;
    district?: string;
    dong?: string;
    id?: string;
    shopId?: string;
  }>;
}

// 🌐 영문 시/도 코드를 한글명으로 변환
function getRegionFullName(region?: string): string {
  switch (region?.toLowerCase()) {
    case "seoul": return "서울";
    case "gyeonggi": return "경기";
    case "incheon": return "인천";
    default: return region || "";
  }
}

// 🛠️ 이중 디코딩 방어 함수
function safeDecode(str?: string): string {
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

// 🌟 구 + 동 이름을 합쳐서 완벽한 동 단위 키워드 생성
function parseLocationText(region?: string, district?: string, dong?: string): string {
  const regionName = getRegionFullName(region);
  const decodedDistrict = safeDecode(district);
  const decodedDong = safeDecode(dong);
  return `${regionName} ${decodedDistrict} ${decodedDong}`.replace(/\s+/g, " ").trim();
}

const shopData: Record<string, {
  name: string;
  cleanName: string;
  phone: string;
  badge: string;
  image: string;
  desc: string;
  courses: { name: string; time: string; price: string; desc: string }[];
  features: string[];
}> = {
  "1": {
    name: "🔥 한국미녀테라피",
    cleanName: "한국미녀테라피",
    phone: "0507-1280-3140",
    badge: "실시간 만족도 1위",
    image: "/shop1.jpg",
    desc: "전지역 25분 신속 방문! 출장 타이 마사지, 출장 아로마 마사지, 출장 릴렉스 마사지 전문 제휴처입니다. 숙련된 테라피스트가 계신 곳으로 직접 찾아가 굳은 근육과 묵은 피로를 시원하게 풀어드립니다.",
    courses: [
      { name: "출장 릴렉스 마사지 (기본)", time: "60분", price: "110,000원", desc: "뭉친 어깨와 등 근육을 부드럽게 이완시키는 맞춤형 출장 릴렉스 마사지 코스" },
      { name: "출장 아로마 마사지 (순환)", time: "90분", price: "130,000원", desc: "천연 에센셜 오일을 사용하여 전신 혈액순환과 피로 해소를 돕는 프리미엄 출장 아로마 마사지" },
      { name: "출장 스웨디시 릴렉스 마사지", time: "60분", price: "140,000원", desc: "감성적인 터치로 심신을 포근하게 녹여주는 최고급 스웨디시 출장 릴렉스 마사지" },
      { name: "VIP 출장 타이 & 아로마 풀코스", time: "90분", price: "180,000원", desc: "시원한 타이 스트레칭과 부드러운 아로마 관리를 결합한 전신 올인원 출장 마사지" }
    ],
    features: ["100% 후불제 안심결제", "24시간 365일 연중무휴", "세부 동 전지역 25분 칼도착", "철저한 위생 및 방역 관리"]
  },
  "2": {
    name: "✨ 오늘밤테라피",
    cleanName: "오늘밤테라피",
    phone: "0507-1280-3199",
    badge: "재방문율 최우수",
    image: "/shop2.jpg",
    desc: "지친 하루의 피로를 말끔히 풀어드리는 1:1 방문 홈케어! 출장 타이 마사지부터 출장 아로마 마사지까지 원하는 장소에서 편안하게 정통 힐링을 누려보세요.",
    courses: [
      { name: "출장 타이 마사지 (베이직)", time: "60분", price: "60,000원", desc: "전신 근육을 시원하게 스트레칭하여 가볍고 개운한 몸을 만드는 출장 타이 마사지" },
      { name: "출장 아로마 마사지 (소프트)", time: "60분", price: "80,000원", desc: "향기로운 천연 오일과 부드러운 압으로 신체 긴장을 완화하는 출장 아로마 마사지" },
      { name: "출장 릴렉스 마사지 (감성힐링)", time: "60분", price: "90,000원", desc: "지친 심신에 온전한 안식과 숙면을 유도하는 감성 충만 출장 릴렉스 마사지" },
      { name: "VVIP 스페셜 출장 마사지", time: "60분", price: "100,000원", desc: "타이와 아로마의 장점을 결합하여 전신 피로를 완벽하게 날려주는 코스" },
      { name: "한국인 전문 힐러 출장 릴렉스 마사지", time: "60분", price: "140,000원", desc: "베테랑 한국인 관리사의 디테일하고 품격 있는 1:1 맞춤 출장 릴렉스 마사지" }
    ],
    features: ["선입금 없는 100% 후불제", "친절 마인드 전문 힐러 상주", "간편 결제 지원"]
  },
  "3": {
    name: "💎 주주홈타이",
    cleanName: "주주홈타이",
    phone: "0507-1280-3197",
    badge: "24시 상시 할인",
    image: "/shop3.jpg",
    desc: "재방문율 1위 만족도! 정통 출장 타이 마사지와 림프 순환을 돕는 출장 아로마 마사지로 굳어있던 몸을 유연하고 활력 넘치게 회복시켜 드립니다.",
    courses: [
      { name: "스탠다드 정통 출장 타이 마사지", time: "60분", price: "60,000원", desc: "머리부터 발끝까지 뭉친 근육을 시원하게 풀어주는 정통 출장 타이 마사지" },
      { name: "프리미엄 딥티슈 출장 아로마 마사지", time: "90분", price: "90,000원", desc: "근육 결을 따라 부드럽게 속근육 깊은 곳까지 풀어주는 출장 아로마 마사지" },
      { name: "VIP 시그니처 롱타임 출장 마사지", time: "120분", price: "120,000원", desc: "2시간 동안 출장 타이 마사지와 출장 아로마 마사지를 여유롭게 누리는 풀코스" }
    ],
    features: ["선입금 0원 100% 후불제", "평균 25분 방문 보장", "개인정보 완벽 보호"]
  },
  "4": {
    name: "🌟 한국골든테라피",
    cleanName: "한국골든테라피",
    phone: "0507-1280-3360",
    badge: "젊은 감성 베테랑",
    image: "/shop4.jpg",
    desc: "베테랑 테라피스트들의 1:1 방문 케어! 출장 릴렉스 마사지와 전신 출장 아로마 마사지로 전지역 어디서나 품격 있는 힐링을 선사합니다.",
    courses: [
      { name: "출장 릴렉스 마사지 (건식)", time: "60분", price: "60,000원", desc: "원하는 피로 부위를 집중적으로 시원하게 풀어주는 맞춤형 출장 릴렉스 마사지" },
      { name: "천연 순환 출장 아로마 마사지", time: "60분", price: "70,000원", desc: "천연 아로마 오일로 전신 혈액순환과 피부 보습을 돕는 출장 아로마 마사지" },
      { name: "VIP 감성 출장 릴렉스 마사지", time: "60분", price: "100,000원", desc: "부드러운 림프 순환 케어로 몸을 가볍게 만들어주는 스웨디시 출장 릴렉스 마사지" },
      { name: "한국인 전문 관리사 VIP 풀코스", time: "60분", price: "150,000원", desc: "최상의 휴식과 컨디션 회복을 선사하는 고품격 시그니처 출장 마사지" }
    ],
    features: ["젊고 세련된 감성 테라피", "100% 후불 결제", "24시간 상시 대기"]
  },
  "5": {
    name: "👑 퀸즈홈테라피",
    cleanName: "퀸즈홈테라피",
    phone: "0507-1280-3296",
    badge: "인기도 TOP 5",
    image: "/shop5.jpg",
    desc: "평균 25분 도착! 출장 타이 마사지, 출장 아로마 마사지, 출장 릴렉스 마사지를 정직한 정찰제 가격으로 편안하게 받아보세요.",
    courses: [
      { name: "컨디션 케어 출장 타이 마사지", time: "60분", price: "60,000원", desc: "지친 몸의 피로를 시원한 스트레칭으로 해소하는 정통 출장 타이 마사지" },
      { name: "스페셜 릴렉스 출장 아로마 마사지", time: "60분", price: "70,000원", desc: "향긋한 아로마 오일과 부드러운 손길로 진행되는 전신 출장 아로마 마사지" },
      { name: "콤비네이션 출장 릴렉스 마사지", time: "90분", price: "120,000원", desc: "출장 타이 마사지와 출장 아로마 마사지를 한 번에 경험하는 밸런스 힐링 코스" },
      { name: "👑 한국인 전담 관리사 스페셜 코스", time: "60분", price: "140,000원", desc: "전문 관리사의 섬세한 1:1 맞춤 피로 회복 전신 출장 마사지" }
    ],
    features: ["100% 후불제", "빠른 도착 보장", "고객 만족도 최상"]
  }
};

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const resolvedParams = await params;
  const targetId = resolvedParams.id || resolvedParams.shopId || "1";
  const shop = shopData[targetId] || shopData["1"];

  const currentRegion = parseLocationText(resolvedParams.region, resolvedParams.district, resolvedParams.dong);

  // 🌟 고유 해시 기반 인덱스 추출 (1,000여 가지 순환 조합 유도)
  const charSumTitle = (currentRegion + shop.cleanName + targetId + "title_salt_no_direct").split("").reduce((acc, char) => acc + char.charCodeAt(0), 0);
  const charSumDesc = (currentRegion + shop.cleanName + targetId + "desc_salt_no_direct").split("").reduce((acc, char) => acc + char.charCodeAt(0), 0);

  // 1. 타이틀 풀 ("출장"과 "마사지" 사이에 다른 단어들이 들어가 절대 직접 붙지 않도록 구성)
  const titleVariants = [
    `${currentRegion} 출장 전문 타이 및 아로마 마사지 예약 - ${shop.cleanName}`,
    `${currentRegion} 출장 홈케어 서비스 스포츠 마사지 안내 · ${shop.cleanName}`,
    `${currentRegion} 출장 방문 케어 전신 릴렉스 마사지 | ${shop.cleanName}`,
    `${currentRegion} 출장 힐링 테라피 스웨디시 마사지 제휴샵 - ${shop.cleanName}`,
    `${currentRegion} 출장 안심 방문 아로마 바디 마사지 예약 · ${shop.cleanName}`,
    `${currentRegion} 출장 맞춤형 홈케어 감성 마사지 센터 | ${shop.cleanName}`,
    `${currentRegion} 출장 24시 신속 방문 타이 마사지 안내 - ${shop.cleanName}`,
    `${currentRegion} 출장 피로회복 전문 딥티슈 마사지 · ${shop.cleanName}`,
    `${currentRegion} 출장 바디 웰니스 홈케어 마사지 예약 | ${shop.cleanName}`,
    `${currentRegion} 출장 프라이빗 1인 방문 마사지 센터 - ${shop.cleanName}`,
    `${currentRegion} 출장 오일 순환 케어 아로마 마사지 · ${shop.cleanName}`,
    `${currentRegion} 출장 후불제 안심 방문 스포츠 마사지 | ${shop.cleanName}`,
    `${currentRegion} 출장 근육 이완 홈케어 릴렉스 마사지 - ${shop.cleanName}`,
    `${currentRegion} 출장 베테랑 관리사 방문 안마 마사지 · ${shop.cleanName}`,
    `${currentRegion} 출장 프리미엄 스페셜 홈케어 마사지 샵 | ${shop.cleanName}`,
    `${currentRegion} 출장 상쾌한 컨디션 회복 타이 마사지 - ${shop.cleanName}`,
    `${currentRegion} 출장 림프 순환 전문 방문 마사지 예약 · ${shop.cleanName}`,
    `${currentRegion} 출장 품격 있는 웰니스 아로마 마사지 | ${shop.cleanName}`,
    `${currentRegion} 출장 정확하고 빠른 홈케어 스포츠 마사지 - ${shop.cleanName}`,
    `${currentRegion} 출장 감성 충만 방문 힐링 마사지 센터 · ${shop.cleanName}`,
    `${currentRegion} 출장 연중무휴 24시 방문 바디 마사지 | ${shop.cleanName}`,
    `${currentRegion} 출장 신뢰할 수 있는 홈케어 타이 마사지 - ${shop.cleanName}`,
    `${currentRegion} 출장 VVIP 풀코스 방문 릴렉스 마사지 · ${shop.cleanName}`,
    `${currentRegion} 출장 편안한 휴식 지향 아로마 마사지 | ${shop.cleanName}`,
    `${currentRegion} 출장 1:1 맞춤형 방문 스포츠 마사지 - ${shop.cleanName}`,
    `${currentRegion} 출장 전문가의 손길 홈케어 안마 마사지 · ${shop.cleanName}`,
    `${currentRegion} 출장 정통 스트레칭 방문 타이 마사지 | ${shop.cleanName}`,
    `${currentRegion} 출장 쾌적한 환경 홈케어 힐링 마사지 - ${shop.cleanName}`,
    `${currentRegion} 출장 완벽한 피로 탈출 방문 마사지 예약 · ${shop.cleanName}`,
    `${currentRegion} 출장 시그니처 웰니스 홈케어 마사지 | ${shop.cleanName}`
  ];

  // 2. 메인 디스크립션 풀 (타이틀과 내용이 겹치지 않으며, "출장"과 "마사지"가 절대 붙지 않도록 서술)
  const descriptionVariants = [
    `일상에 여유를 더하는 지역 맞춤 관리, ${currentRegion} 제휴점 ${shop.cleanName}에서 24시 신속하게 방문하는 출장 서비스를 통해 피로를 풀어주는 타이 및 아로마 마사지를 경험해보세요. 선입금 없는 100% 후불제로 안전합니다.`,
    `뭉친 근육과 쌓인 피로를 말끔하게 해소해 드리는 ${currentRegion} 전문 홈케어 공간입니다. ${shop.cleanName}만의 차별화된 출장 방문 프로그램으로 언제 어디서나 편안한 릴렉스 마사지를 누려보세요.`,
    `${currentRegion} 전지역 평균 25분 이내 신속 방문! ${shop.cleanName}의 검증된 테라피스트가 직접 찾아가는 출장 서비스 및 맞춤형 스포츠 마사지 프로그램으로 최상의 상쾌함을 선사합니다.`,
    `정직한 정찰제 가격과 투명한 운영을 지향하는 ${currentRegion} 웰니스 힐링 센터입니다. ${shop.cleanName}에서 제공하는 프리미엄 홈케어 테라피와 전문 방문 안마 마사지를 지금 바로 만나보세요.`,
    `지친 몸에 활력을 불어넣어 주는 ${currentRegion} 바디 케어 솔루션. ${shop.cleanName}이 엄선한 출장 서비스와 힐링 마사지 프로그램을 통해 소중한 휴식 시간을 완성하세요.`,
    `${currentRegion} 어디서나 편리하게 이용 가능한 1:1 프라이빗 홈케어 서비스. ${shop.cleanName}의 전문 관리사가 선사하는 출장 방문 케어와 스웨디시 마사지로 일상의 스트레스를 날려버리세요.`,
    `엄격한 위생 관리와 친절한 마인드를 갖춘 ${currentRegion} 공식 제휴처 ${shop.cleanName}. 신뢰할 수 있는 후불제 시스템으로 안전하게 출장 서비스 및 바디 마사지를 이용하실 수 있습니다.`,
    `당신의 지친 하루 끝에 완벽한 휴식을 선물하는 ${currentRegion} 전문 가이드. ${shop.cleanName}의 숙련된 손길이 닿는 출장 방문 서비스와 전신 힐링 마사지를 경험하세요.`,
    `${currentRegion} 주민들을 위한 특별한 프리미엄 바디 웰니스 프로그램. ${shop.cleanName}에서 제공하는 체계적인 홈케어 테라피와 출장 기반의 스포츠 마사지로 평온을 되찾으세요.`,
    `예약부터 방문까지 철저한 프라이버시 보호가 보장되는 ${currentRegion} 힐링 공간. ${shop.cleanName}과 함께 언제든지 편안한 출장 서비스와 아로마 마사지를 누려보세요.`
  ];

  const tIndex = (charSumTitle + targetId.charCodeAt(0) * 19) % titleVariants.length;
  const dIndex = (charSumDesc + targetId.charCodeAt(0) * 29) % descriptionVariants.length;

  const pageTitle = titleVariants[tIndex];
  const pageDescription = descriptionVariants[dIndex];

  const canonicalUrl = `https://metroheal.netlify.app/${resolvedParams.region}/${encodeURIComponent(safeDecode(resolvedParams.district))}/${encodeURIComponent(safeDecode(resolvedParams.dong))}/shop/${targetId}`;

  return {
    title: {
      absolute: pageTitle,
    },
    description: pageDescription,
    alternates: {
      canonical: canonicalUrl,
    },
    openGraph: {
      title: pageTitle,
      description: pageDescription,
      url: canonicalUrl,
      locale: "ko_KR",
      type: "article",
    },
  };
}

export default async function DongShopDetailPage({ params }: PageProps) {
  const resolvedParams = await params;
  const targetId = resolvedParams.id || resolvedParams.shopId || "1";
  const shop = shopData[targetId] || shopData["1"];

  const currentRegion = parseLocationText(resolvedParams.region, resolvedParams.district, resolvedParams.dong);
  const districtName = safeDecode(resolvedParams.district);
  const dongName = safeDecode(resolvedParams.dong);

  return (
    <div className="bg-[#050505] text-gray-100 min-h-screen flex flex-col font-sans selection:bg-amber-500 selection:text-black pb-28">
      
      {/* 상단 헤더 */}
      <header className="sticky top-0 z-50 bg-[#050505]/85 backdrop-blur-xl border-b border-amber-500/20 px-4 py-3.5 shadow-[0_4px_20px_rgba(245,158,11,0.1)]">
        <div className="max-w-4xl mx-auto flex justify-between items-center">
          <Link href="/" className="flex items-center gap-2.5 group">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-amber-400 to-amber-600 flex items-center justify-center font-black text-black text-lg shadow-[0_0_12px_rgba(245,158,11,0.4)] group-hover:scale-105 transition-transform">
              M
            </div>
            <div className="flex flex-col">
              <span className="text-lg font-black tracking-wider bg-gradient-to-r from-amber-300 via-amber-400 to-yellow-500 bg-clip-text text-transparent">
                메트로힐
              </span>
              <span className="text-[9px] text-gray-400 tracking-tighter">METRO HEAL PARTNER</span>
            </div>
          </Link>
          
          <Link 
            href={`/${resolvedParams.region}/${encodeURIComponent(districtName)}/${encodeURIComponent(dongName)}`}
            className="text-xs font-bold text-amber-400 bg-amber-500/10 px-3 py-1.5 rounded-xl border border-amber-500/30 hover:bg-amber-500 hover:text-black transition-all"
          >
            ← {dongName} 목록
          </Link>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 py-8 w-full flex-1 space-y-8">
        
        {/* 대표 비주얼 카드 */}
        <section className="bg-[#121214] border border-amber-500/30 rounded-3xl overflow-hidden shadow-[0_10px_30px_rgba(0,0,0,0.8)]">
          <div className="relative h-64 md:h-80 w-full overflow-hidden bg-neutral-900">
            <img 
              src={shop.image} 
              alt={`${currentRegion} 출장 마사지 - ${shop.cleanName}`} 
              className="w-full h-full object-cover filter brightness-[0.7]" 
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#121214] via-transparent to-black/30"></div>
            <span className="absolute top-4 left-4 bg-amber-500 text-black text-xs font-black px-3.5 py-1.5 rounded-full shadow-lg">
              {shop.badge}
            </span>
          </div>

          <div className="p-6 md:p-8 space-y-4 -mt-8 relative z-10">
            <div className="inline-block bg-amber-500/10 border border-amber-500/30 px-3 py-1 rounded-xl text-amber-400 text-xs font-bold">
              📍 {currentRegion} 출장 타이·아로마·릴렉스 마사지 24시 신속 방문
            </div>

            <h1 className="text-2xl md:text-3xl font-black text-white">
              {currentRegion} 출장마사지 24시 안내 - <span className="text-amber-400">{shop.cleanName}</span>
            </h1>

            <p className="text-xs md:text-sm text-gray-300 leading-relaxed bg-black/50 p-4 rounded-2xl border border-white/5">
              {shop.desc}
            </p>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-2">
              {shop.features.map((feat, idx) => (
                <div key={idx} className="bg-black/60 border border-amber-500/20 px-3 py-2 rounded-xl text-center text-[11px] font-bold text-amber-300">
                  ✓ {feat}
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* 코스 및 요금 안내 */}
        <section className="bg-[#0d0d0f] border border-amber-500/20 p-6 md:p-8 rounded-3xl space-y-6">
          <div className="text-center">
            <span className="text-amber-400 text-xs font-bold tracking-widest uppercase">PROGRAM & PRICE</span>
            <h2 className="text-xl md:text-2xl font-black text-white mt-1">
              💎 {currentRegion} 출장 마사지 코스 및 요금 안내
            </h2>
          </div>

          <div className="space-y-4">
            {shop.courses.map((course, idx) => (
              <div key={idx} className="bg-black/60 border border-white/10 hover:border-amber-500/40 p-5 rounded-2xl flex flex-col md:flex-row justify-between md:items-center gap-3 transition-colors">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="bg-red-500/20 text-red-400 text-[10px] font-black px-2 py-0.5 rounded border border-red-500/30">
                      {course.time}
                    </span>
                    <h3 className="font-extrabold text-white text-base md:text-lg">{course.name}</h3>
                  </div>
                  <p className="text-xs text-gray-400">{course.desc}</p>
                </div>
                <div className="text-right">
                  <span className="text-lg font-black text-amber-400 bg-amber-500/10 px-4 py-2 rounded-xl border border-amber-500/20 inline-block">
                    {course.price}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* 안심 이용 안내 */}
        <section className="bg-black/80 p-5 rounded-2xl border border-white/10">
          <h3 className="text-amber-400 font-bold text-sm mb-2 flex items-center gap-1.5">
            <span>📌</span> {currentRegion} 마사지 안심 이용 안내
          </h3>
          <ul className="text-xs text-gray-300 space-y-1.5 list-disc list-inside">
            <li>모든 제휴 업체는 <strong>100% 현장 후불제</strong>로만 운영되며, 사전 선입금이나 예약금을 절대 요구하지 않습니다.</li>
            <li>원하시는 시간 20~30분 전에 문의해 주시면 출장 타이 마사지, 출장 아로마 마사지, 출장 릴렉스 마사지 전문 테라피스트가 신속하게 방문합니다.</li>
          </ul>
        </section>

      </main>

      {/* 하단 고정 전화 / 문자 바 */}
      <div className="fixed bottom-0 left-0 right-0 z-50 bg-[#08080a]/95 backdrop-blur-xl border-t border-amber-500/30 p-3 md:p-4 shadow-[0_-10px_25px_rgba(0,0,0,0.8)]">
        <div className="max-w-4xl mx-auto grid grid-cols-2 gap-3">
          <a 
            href={`tel:${shop.phone}`}
            className="flex items-center justify-center gap-2 bg-gradient-to-r from-amber-500 via-yellow-400 to-amber-500 hover:from-amber-400 hover:to-yellow-300 text-black font-black py-3.5 rounded-2xl text-xs md:text-sm shadow-[0_0_20px_rgba(245,158,11,0.3)] transition-transform active:scale-95"
          >
            <span className="text-lg">📞</span> 전화로 즉시예약
          </a>
          <a 
            href={`sms:${shop.phone}?body=${encodeURIComponent(`[${currentRegion}]${shop.cleanName} 출장마사지 예약 문의드립니다. (메트로힐 보고 연락드렸어요)`)}`}
            className="flex items-center justify-center gap-2 bg-neutral-900 hover:bg-neutral-800 text-white font-black py-3.5 rounded-2xl text-xs md:text-sm border border-white/10 hover:border-amber-500/40 transition-transform active:scale-95"
          >
            <span className="text-lg">💬</span> 간편 문자상담
          </a>
        </div>
      </div>

    </div>
  );
}