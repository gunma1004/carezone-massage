import { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "프리미엄 웰니스 바디케어 프로그램 안내 | 케어존마사지",
  description:
    "케어존마사지 맞춤형 바디 테라피 프로그램 안내. 타이 건식 릴렉스, 최고급 천연 아로마 오일 케어, 감성 스웨디시 등 체계적인 웰니스 서비스 코스를 확인하세요.",
  keywords: [
    "케어존마사지",
    "마사지프로그램",
    "타이마사지코스",
    "아로마오일케어",
    "스웨디시테라피",
    "바디릴렉싱",
    "수도권마사지안내",
  ],
  alternates: {
    canonical: "https://carezone-massage.netlify.app/services",
  },
  openGraph: {
    title: "프리미엄 웰니스 바디 테라피 코스 안내 | 케어존마사지",
    description: "개인 맞춤형 릴렉싱 케어와 안락한 프라이빗 바디 테라피 상세 가이드.",
    url: "https://carezone-massage.netlify.app/services",
    siteName: "케어존마사지",
    locale: "ko_KR",
    type: "website",
  },
};

const programs = [
  {
    step: "01",
    name: "건식 / 타이 릴렉스",
    desc: "전신의 뭉친 근육과 일상 긴장으로 굳은 관절을 부드럽게 풀어주는 스트레칭 중심의 전통 바디 케어 코스입니다.",
  },
  {
    step: "02",
    name: "아로마 오일 케어",
    desc: "엄선된 식물성 에센셜 오일을 사용하여 피부 자극 없이 부드럽게 체내 순환과 피로 해소를 돕는 릴렉싱 코스입니다.",
  },
  {
    step: "03",
    name: "VIP 감성 스웨디시",
    desc: "섬세한 터칭 기법으로 림프 순환을 촉진하고 지친 몸과 마음에 깊은 평온을 선사하는 시그니처 감성 케어입니다.",
  },
];

export default function ServicesPage() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    itemListElement: programs.map((prog, idx) => ({
      "@type": "Service",
      position: idx + 1,
      name: prog.name,
      description: prog.desc,
      provider: {
        "@type": "Organization",
        name: "케어존마사지",
        url: "https://carezone-massage.netlify.app",
      },
    })),
  };

  return (
    <div className="bg-[#070709] text-gray-100 min-h-screen py-10 px-4 font-sans selection:bg-amber-500 selection:text-black">
      {/* 검색엔진 구조화 데이터 */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <div className="max-w-4xl mx-auto space-y-10">
        {/* 상단 타이틀 */}
        <div className="text-center space-y-2">
          <span className="text-amber-400 text-xs font-bold tracking-widest uppercase">
            PREMIUM CARE SERVICE
          </span>
          <h1 className="text-2xl md:text-3xl font-black text-white">
            케어존마사지 코스별 프로그램 안내
          </h1>
          <p className="text-xs md:text-sm text-gray-400">
            고객님의 컨디션과 취향에 맞춘 최상의 프라이빗 힐링 솔루션
          </p>
        </div>

        {/* 3대 핵심 프로그램 카드 */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {programs.map((prog) => (
            <div
              key={prog.step}
              className="bg-[#111114] border border-amber-500/20 hover:border-amber-500/50 p-6 rounded-3xl space-y-3 transition-all shadow-md flex flex-col justify-between"
            >
              <div className="space-y-2">
                <div className="text-amber-400 text-2xl font-black">{prog.step}</div>
                <h2 className="font-bold text-lg text-white">{prog.name}</h2>
                <p className="text-xs text-gray-400 leading-relaxed">{prog.desc}</p>
              </div>
            </div>
          ))}
        </div>

        {/* 안심 정찰제 안내 박스 */}
        <div className="bg-[#0e0e12] border border-white/10 p-6 rounded-3xl text-center space-y-2">
          <p className="text-xs md:text-sm text-gray-300 font-semibold">
            ✨ 모든 프로그램은 검증된 정찰제 가이드라인에 따라 투명하게 진행됩니다.
          </p>
          <p className="text-[11px] text-gray-500">
            숙련된 전문 테라피스트의 정성 어린 1:1 맞춤형 케어로 일상의 활력을 되찾아보세요.
          </p>
          <div className="pt-2">
            <Link
              href="/prices"
              className="text-xs text-amber-400 hover:text-amber-300 font-bold underline underline-offset-4"
            >
              코스별 이용 요금표 확인하기 →
            </Link>
          </div>
        </div>

        {/* 하단 CTA 버튼 */}
        <div className="flex flex-col sm:flex-row justify-center items-center gap-3 pt-2">
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
            📞 프로그램 맞춤 상담
          </a>
        </div>
      </div>
    </div>
  );
}