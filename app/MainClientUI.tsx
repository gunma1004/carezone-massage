// app/MainClientUI.tsx
"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

export const regionData: Record<
  string,
  { name: string; districts: Record<string, { name: string; dongs: string[] }> }
> = {
  seoul: {
    name: "서울특별시",
    districts: {
      jongno: { name: "종로구", dongs: ["청운동", "효자동", "사직동", "삼청동", "부암동", "평창동", "무악동", "교남동", "가회동", "종로1.2.3.4가동", "종로5.6가동", "이화동", "혜화동", "창신1동", "창신2동", "창신3동", "숭인1동", "숭인2동"] },
      jung: { name: "중구", dongs: ["소공동", "회현동", "명동", "필동", "장충동", "광희동", "을지로동", "신당동", "다산동", "약수동", "청구동", "동화동", "황학동", "중림동"] },
      yongsan: { name: "용산구", dongs: ["후암동", "용산2가동", "남영동", "청파동", "원효로1동", "원효로2동", "효창동", "용문동", "이촌1동", "이촌2동", "이태원1동", "이태원2동", "한남동", "서빙고동", "보광동"] },
      seongdong: { name: "성동구", dongs: ["왕십리2동", "왕십리도선동", "마장동", "사근동", "행당1동", "행당2동", "응봉동", "금호1가동", "금호2.3가동", "금호4가동", "옥수동", "성수1가1동", "성수1가2동", "성수2가1동", "성수2가3동", "송정동", "용답동"] },
      gwangjin: { name: "광진구", dongs: ["중곡1동", "중곡2동", "중곡3동", "중곡4동", "능동", "구의1동", "구의2동", "구의3동", "광장동", "자양1동", "자양2동", "자양3동", "자양4동", "화양동", "군자동"] },
      dongdaemun: { name: "동대문구", dongs: ["신설동", "용두동", "제기동", "전농1동", "전농2동", "답십리1동", "답십리2동", "장안1동", "장안2동", "청량리동", "회기동", "휘경1동", "휘경2동", "이문1동", "이문2동"] },
      jungnang: { name: "중랑구", dongs: ["면목본동", "면목2동", "면목3.4동", "면목5동", "면목7동", "상봉1동", "상봉2동", "중화1동", "중화2동", "묵1동", "묵2동", "망우본동", "망우3동", "신내1동", "신내2동"] },
      seongbuk: { name: "성북구", dongs: ["성북동", "삼선동", "동선동", "돈암1동", "돈암2동", "안암동", "보문동", "정릉1동", "정릉2동", "정릉3동", "정릉4동", "길음1동", "길음2동", "종암동", "월곡1동", "월곡2동", "장위1동", "장위2동", "장위3동", "석관동"] },
      gangbuk: { name: "강북구", dongs: ["삼양동", "미아동", "송중동", "송천동", "삼각산동", "번1동", "번2동", "번3동", "수유1동", "수유2동", "수유3동", "우이동", "인수동"] },
      dobong: { name: "도봉구", dongs: ["창1동", "창2동", "창3동", "창4동", "창5동", "도봉1동", "도봉2동", "쌍문1동", "쌍문2동", "쌍문3동", "쌍문4동", "방학1동", "방학2동", "방학3동"] },
      nowon: { name: "노원구", dongs: ["상계1동", "상계2동", "상계3.4동", "상계5동", "상계6.7동", "상계8동", "상계9동", "상계10동", "중계본동", "중계1동", "중계2.3동", "중계4동", "하계1동", "하계2동", "공릉1동", "공릉2동"] },
      eunpyeong: { name: "은평구", dongs: ["불광1동", "불광2동", "갈현1동", "갈현2동", "구산동", "대조동", "응암1동", "응암2동", "응암3동", "역촌동", "신사1동", "신사2동", "증산동", "수색동", "진관동"] },
      seodaemun: { name: "서대문구", dongs: ["천연동", "북아현동", "충현동", "신촌동", "연희동", "홍제1동", "홍제2동", "홍제3동", "홍은1동", "홍은2동", "남가좌1동", "남가좌2동", "북가좌1동", "북가좌2동"] },
      mapo: { name: "마포구", dongs: ["공덕동", "아현동", "도화동", "용강동", "대흥동", "염리동", "신수동", "서교동", "합정동", "망원1동", "망원2동", "연남동", "성산1동", "성산2동", "상암동"] },
      yangcheon: { name: "양천구", dongs: ["목1동", "목2동", "목3동", "목4동", "목5동", "신월1동", "신월2동", "신월3동", "신월4동", "신월5동", "신월6동", "신월7동", "신정1동", "신정2동", "신정3동", "신정4동", "신정6동", "신정7동"] },
      gangseo: { name: "강서구", dongs: ["등촌1동", "등촌2동", "등촌3동", "화곡본동", "화곡1동", "화곡2동", "화곡3동", "화곡4동", "화곡8동", "우장산동", "가양1동", "가양2동", "가양3동", "발산1동", "공항동", "방화1동", "방화2동", "방화3동"] },
      guro: { name: "구로구", dongs: ["신도림동", "구로1동", "구로2동", "구로3동", "구로4동", "구로5동", "가리봉동", "고척1동", "고척2동", "개봉1동", "개봉2동", "개봉3동", "오류1동", "오류2동", "수궁동"] },
      geumcheon: { name: "금천구", dongs: ["가산동", "독산1동", "독산2동", "독산3동", "독산4동", "시흥1동", "시흥2동", "시흥3동", "시흥4동", "시흥5동"] },
      yeongdeungpo: { name: "영등포구", dongs: ["영등포본동", "영등포동", "여의동", "당산1동", "당산2동", "도림동", "문래동", "양평1동", "양평2동", "신길1동", "신길3동", "신길4동", "신길5동", "신길6동", "신길7동", "대림1동", "대림2동", "대림3동"] },
      dongjak: { name: "동작구", dongs: ["노량진1동", "노량진2동", "상도1동", "상도2동", "상도3동", "상도4동", "흑석동", "사당1동", "사당2동", "사당3동", "사당4동", "사당5동", "대방동", "신대방1동", "신대방2동"] },
      gwanak: { name: "관악구", dongs: ["보라매동", "청림동", "성현동", "행운동", "낙성대동", "청룡동", "은천동", "상현동", "서원동", "신원동", "서림동", "신사동", "난향동", "조원동", "대학동", "난곡동", "삼성동", "미성동"] },
      seocho: { name: "서초구", dongs: ["서초1동", "서초2동", "서초3동", "서초4동", "잠원동", "반포본동", "반포1동", "반포2동", "반포3동", "반포4동", "방배본동", "방배1동", "방배2동", "방배3동", "방배4동", "양재1동", "양재2동", "내곡동"] },
      gangnam: { name: "강남구", dongs: ["역삼1동", "역삼2동", "개포1동", "개포2동", "개포4동", "청담동", "삼성1동", "삼성2동", "대치1동", "대치2동", "대치4동", "신사동", "논현1동", "논현2동", "압구정동", "세곡동", "자곡동", "일원동", "수서동", "도곡1동", "도곡2동"] },
      songpa: { name: "송파구", dongs: ["잠실본동", "잠실2동", "잠실3동", "잠실4동", "잠실6동", "잠실7동", "풍납1동", "풍납2동", "거여1동", "거여2동", "마천1동", "마천2동", "방이1동", "방이2동", "오륜동", "오금동", "송파1동", "송파2동", "석촌동", "삼전동", "가락본동", "가락1동", "가락2동", "문정1동", "문정2동", "장지동", "위례동", "잠실동"] },
      gangdong: { name: "강동구", dongs: ["강일동", "상일1동", "상일2동", "명일1동", "명일2동", "고덕1동", "고덕2동", "암사1동", "암사2동", "암사3동", "천호1동", "천호2동", "천호3동", "성내1동", "성내2동", "성내3동", "둔촌1동", "둔촌2동"] },
    },
  },
  gyeonggi: {
    name: "경기도",
    districts: {
      suwon_jangan: { name: "수원시 장안구", dongs: ["파장동", "정자1동", "정자2동", "정자3동", "영화동", "송죽동", "조원1동", "조원2동", "율천동"] },
      suwon_gwonseon: { name: "수원시 권선구", dongs: ["세류1동", "세류2동", "세류3동", "권선1동", "권선2동", "곡선동", "평동", "호매실동", "서둔동", "금곡동"] },
      suwon_paldal: { name: "수원시 팔달구", dongs: ["매교동", "매산동", "고등동", "화서1동", "화서2동", "지동", "우만1동", "우만2동", "인계동"] },
      suwon_yeongtong: { name: "수원시 영통구", dongs: ["매탄1동", "매탄2동", "매탄3동", "매탄4동", "원천동", "영통1동", "영통2동", "영통3동", "망포1동", "망포2동", "광교1동", "광교2동"] },
      seongnam_sujeong: { name: "성남시 수정구", dongs: ["신흥동", "태평동", "수진동", "단대동", "산성동", "양지동", "복정동", "위례동", "신촌동", "고등동", "창곡동"] },
      seongnam_jungwon: { name: "성남시 중원구", dongs: ["성남동", "중앙동", "금광동", "은행동", "상대원동", "하대원동", "도촌동"] },
      seongnam_bundang: { name: "성남시 분당구", dongs: ["분당동", "수내동", "정자동", "서현동", "이매동", "야탑동", "금곡동", "구미동", "판교동", "삼평동", "백현동", "운중동"] },
      goyang_deogyang: { name: "고양시 덕양구", dongs: ["주교동", "원신동", "흥도동", "성사동", "효자동", "신도동", "창릉동", "능곡동", "행주동", "행신동", "화정동", "대덕동"] },
      goyang_ilsandong: { name: "고양시 일산동구", dongs: ["식사동", "중산동", "정발산동", "풍산동", "백석동", "마두동", "장항동", "고봉동"] },
      goyang_ilsanseo: { name: "고양시 일산서구", dongs: ["일산동", "탄현동", "주엽동", "대화동", "송포동", "덕이동", "가좌동"] },
      yongin_cheoin: { name: "용인시 처인구", dongs: ["포곡읍", "모현읍", "남사읍", "이동읍", "원삼면", "백암면", "양지면", "중앙동", "역북동", "삼가동", "유림동", "동부동"] },
      yongin_giheung: { name: "용인시 기흥구", dongs: ["신갈동", "영덕동", "구갈동", "상갈동", "보라동", "기흥동", "서농동", "구성동", "마북동", "동백동", "상하동", "보정동"] },
      yongin_suji: { name: "용인시 수지구", dongs: ["풍덕천동", "신봉동", "죽전동", "동천동", "상현동", "성복동"] },
      bucheon_wonmi: { name: "부천시 원미구", dongs: ["심곡동", "원미동", "소사동", "역곡동", "중동", "상동", "약대동"] },
      bucheon_sosa: { name: "부천시 소사구", dongs: ["소사본동", "심곡본동", "범박동", "괴안동", "송내동", "옥길동", "계수동"] },
      bucheon_ojeong: { name: "부천시 오정구", dongs: ["오정동", "원종동", "고강동", "삼정동", "내동", "여월동", "작동"] },
      anyang_manan: { name: "안양시 만안구", dongs: ["안양동", "석수동", "박달동"] },
      anyang_dongan: { name: "안양시 동안구", dongs: ["비산동", "관양동", "평촌동", "호계동", "범계동", "달안동", "부흥동", "귀인동"] },
      ansan_sangnok: { name: "안산시 상록구", dongs: ["일동", "이동", "사동", "본오동", "팔곡동", "양상동", "부곡동", "성포동", "월피동", "건건동", "사사동", "수암동", "장상동", "반월동"] },
      ansan_danwon: { name: "안산시 단원구", dongs: ["고잔동", "와동", "신길동", "성곡동", "원시동", "목내동", "초지동", "원곡동", "선부동", "대부동"] },
      gwangmyeong: { name: "광명시", dongs: ["광명동", "철산동", "하안동", "소하동", "노온사동", "일직동", "가학동", "옥길동"] },
      pyeongtaek: { name: "평택시", dongs: ["팽성읍", "안중읍", "포승읍", "청북읍", "진위면", "서탄면", "고덕동", "중앙동", "서정동", "송탄동", "지산동", "송북동", "신장동", "신평동", "원평동", "통복동", "비전동", "세교동", "용이동", "동삭동"] },
      dongducheon: { name: "동두천시", dongs: ["생연동", "중앙동", "보산동", "불현동", "송내동", "소요동", "상패동", "광암동"] },
      gwacheon: { name: "과천시", dongs: ["중앙동", "갈현동", "별양동", "부림동", "원문동", "문원동", "과천동", "주암동"] },
      guri: { name: "구리시", dongs: ["갈매동", "사노동", "인창동", "교문동", "수택동", "아천동", "토평동", "동구동"] },
      namyangju: { name: "남양주시", dongs: ["호평동", "평내동", "금곡동", "일패동", "이패동", "삼패동", "수석동", "다산동", "와부읍", "진접읍", "화도읍", "진건읍", "오남읍", "퇴계원읍", "별내동"] },
      osan: { name: "오산시", dongs: ["오산동", "부산동", "원동", "궐동", "청학동", "가장동", "금암동", "수청동", "은계동", "세교동", "지곶동", "서랑동", "양산동", "세마동", "초평동"] },
      siheung: { name: "시흥시", dongs: ["대야동", "신천동", "방산동", "포동", "미산동", "은행동", "안현동", "매화동", "도창동", "금이동", "과림동", "계수동", "화정동", "능곡동", "하중동", "하상동", "광석동", "물왕동", "산현동", "조남동", "논곡동", "목감동", "거모동", "군자동", "장현동", "장곡동", "월곶동", "정왕동", "배곧동"] },
      gunpo: { name: "군포시", dongs: ["당동", "당정동", "부곡동", "산본동", "금정동", "둔대동", "속달동", "대야미동", "도마교동", "재궁동", "오금동", "수리동", "궁내동", "광정동"] },
      uiwang: { name: "의왕시", dongs: ["고천동", "이동", "삼동", "왕곡동", "오전동", "학의동", "내손동", "청계동", "포일동", "월암동", "초평동"] },
      hanam: { name: "하남시", dongs: ["천현동", "하산곡동", "창우동", "배알미동", "상산곡동", "신장동", "당정동", "덕풍동", "망월동", "풍산동", "미사동", "선동", "감북동", "감일동", "감이동", "학암동", "교산동", "춘궁동", "하사창동", "상사창동", "항동", "초일동", "초이동", "광암동"] },
      paju: { name: "파주시", dongs: ["문산읍", "조리읍", "법원읍", "파주읍", "광탄면", "탄현면", "월롱면", "적성면", "파평면", "교하동", "운정동", "금촌동"] },
      icheon: { name: "이천시", dongs: ["장호원읍", "부발읍", "신둔면", "백사면", "호법면", "마장면", "대월면", "모가면", "설성면", "율면", "창전동", "증일동", "율현동", "진리동", "중리동", "관고동", "안흥동", "갈산동", "증포동", "송정동"] },
      anseong: { name: "안성시", dongs: ["공도읍", "보개면", "금광면", "서운면", "미양면", "대덕면", "양성면", "원곡면", "일죽면", "죽산면", "삼죽면", "고삼면", "안성동"] },
      gimpo: { name: "김포시", dongs: ["통진읍", "고촌읍", "양촌읍", "대곶면", "월곶면", "하성면", "김포본동", "장기본동", "사우동", "풍무동", "장기동", "구래동", "마산동", "운양동"] },
      hwaseong: { name: "화성시", dongs: ["봉담읍", "우정읍", "향남읍", "남양읍", "매송면", "비봉면", "마도면", "송산면", "서신면", "팔탄면", "장안면", "양감면", "정남면", "새솔동", "진안동", "병점동", "반월동", "기배동", "화산동", "동탄동"] },
      gwangju: { name: "광주시", dongs: ["오포읍", "초월읍", "곤지암읍", "도척면", "퇴촌면", "남종면", "남한산성면", "경안동", "쌍령동", "송정동", "탄벌동", "광남동"] },
      yangju: { name: "양주시", dongs: ["백석읍", "은현면", "남면", "광적면", "장흥면", "양주동", "회천동", "옥정동"] },
      pochon: { name: "포천시", dongs: ["소흘읍", "군내면", "내촌면", "가산면", "신북면", "창수면", "영중면", "일동면", "이동면", "영북면", "관인면", "화현면", "포천동", "선단동"] },
      yeoju: { name: "여주시", dongs: ["가남읍", "점동면", "흥천면", "금사면", "산북면", "대신면", "북내면", "강천면", "여흥동", "중앙동", "오학동"] },
      uijeongbu: { name: "의정부시", dongs: ["의정부동", "호원동", "장암동", "신곡동", "용현동", "민락동", "낙양동", "자일동", "금오동", "가능동", "녹양동", "고산동", "산곡동"] },
      yeoncheon: { name: "연천군", dongs: ["연천읍", "전곡읍", "군남면", "청산면", "백학면", "미산면", "왕징면", "신서면", "중면", "장남면"] },
      gapyeong: { name: "가평군", dongs: ["가평읍", "설악면", "청평면", "상면", "조종면", "북면"] },
      yangpyeong: { name: "양평군", dongs: ["양평읍", "강상면", "강하면", "양서면", "옥천면", "서종면", "단월면", "청운면", "양동면", "지평면", "용문면", "개군면"] },
    },
  },
  incheon: {
    name: "인천광역시",
    districts: {
      jemulpo: { name: "제물포구", dongs: ["신포동", "연안동", "신흥동", "도원동", "율목동", "동인천동", "개항동", "만석동", "화수동", "송현동", "송림동", "금창동"] },
      yeongjong: { name: "영종구", dongs: ["영종동", "영종1동", "영종2동", "운서동", "용유동", "중산동", "운남동", "운북동"] },
      michuhol: { name: "미추홀구", dongs: ["숭의동", "용현동", "학익동", "도화동", "주안동", "관교동", "문학동"] },
      yeonsu: { name: "연수구", dongs: ["옥련동", "선학동", "연수동", "청학동", "동춘동", "송도1동", "송도2동", "송도3동", "송도4동", "송도5동"] },
      namdong: { name: "남동구", dongs: ["구월동", "간석동", "만수동", "장수서창동", "서창동", "남촌도림동", "논현동", "논현고잔동"] },
      bupyeong: { name: "부평구", dongs: ["부평동", "산곡동", "청천동", "갈산동", "삼산동", "부개동", "일신동", "십정동"] },
      gyeyang: { name: "계양구", dongs: ["효성동", "계산동", "작전동", "작전서운동", "계양동"] },
      seohae: { name: "서해구 (서구)", dongs: ["검암경서동", "연희동", "청라1동", "청라2동", "청라3동", "가정동", "신현원창동", "석남동", "가좌동"] },
      geomdan: { name: "검단구", dongs: ["검단동", "불로대곡동", "원당동", "당하동", "오류왕길동", "마전동", "아라동", "금곡동"] },
      ganghwa: { name: "강화군", dongs: ["강화읍", "선원면", "불은면", "길상면", "화도면", "양도면", "내가면", "하점면", "양사면", "송해면", "교동면", "삼산면", "서도면"] },
      ongjin: { name: "옹진군", dongs: ["북도면", "연평면", "백령면", "대청면", "덕적면", "자월면", "영흥면"] },
    },
  },
};

const initialShops = [
  {
    id: 1,
    name: "한국미인테라피",
    desc: "서울·경기·인천 전지역 신속 매칭, 정성 가득한 프리미엄 감성 바디 테라피 & 1:1 맞춤 케어",
    phone: "0507-1280-3140",
    price: "90,000원부터~",
    image: "/shop1.jpg",
  },
  {
    id: 2,
    name: "오늘밤테라피",
    desc: "최고급 천연 아로마 오일 블렌딩, 지친 일상을 깨우는 고품격 프라이빗 힐링 바디 테라피 전문",
    phone: "0507-1280-3199",
    price: "60,000원부터~",
    image: "/shop2.jpg",
  },
  {
    id: 3,
    name: "주주홈타이",
    desc: "재방문율 1위, 철저한 위생 관리와 숙련된 테라피스트의 정통 바디 릴렉싱 프로그램",
    phone: "0507-1280-3197",
    price: "60,000원부터~",
    image: "/shop3.jpg",
  },
  {
    id: 4,
    name: "한국골든테라피",
    desc: "전문 테라피스트의 VIP 집중 피로회복 솔루션, 수도권 어디서나 편안하게 만나는 맞춤 힐링",
    phone: "0507-1280-3360",
    price: "60,000원부터~",
    image: "/shop4.jpg",
  },
  {
    id: 5,
    name: "퀸즈홈테라피",
    desc: "수도권 전역 빠른 안내, 검증된 전문 매니저의 힐링 테라피 & 프리미엄 바디 밸런스 프로그램",
    phone: "0507-1280-3296",
    price: "60,000원부터~",
    image: "/shop5.jpg",
  },
];

function FaqItem({ question, answer }: { question: string; answer: string }) {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <div className="bg-neutral-900/70 rounded-2xl border border-white/5 overflow-hidden transition-colors">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full p-4 text-left flex justify-between items-center font-bold text-sm text-gray-200 hover:text-amber-400 transition-colors"
      >
        <span className="flex items-center gap-2">
          <span className="text-amber-400">Q.</span> {question}
        </span>
        <span className="text-amber-400 font-extrabold text-lg">
          {isOpen ? "−" : "+"}
        </span>
      </button>
      {isOpen && (
        <div className="px-4 pb-4 text-xs text-gray-300 leading-relaxed border-t border-white/5 pt-3 bg-black/40">
          <span className="text-amber-400 font-bold">A. </span>
          {answer}
        </div>
      )}
    </div>
  );
}

export default function MainClientUI() {
  const [selectedRegion, setSelectedRegion] = useState("seoul");
  const [selectedDistrict, setSelectedDistrict] = useState("");
  const [selectedDong, setSelectedDong] = useState("");
  const [shops, setShops] = useState(initialShops);

  useEffect(() => {
    const shuffled = [...initialShops];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    setShops(shuffled);
  }, []);

  const handleRegionChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedRegion(e.target.value);
    setSelectedDistrict("");
    setSelectedDong("");
  };

  const handleDistrictChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedDistrict(e.target.value);
    setSelectedDong("");
  };

  const handleSearch = () => {
    if (!selectedDistrict) {
      alert("원하시는 지역(구/시/군)을 먼저 선택해주세요!");
      return;
    }
    const districtObj = regionData[selectedRegion]?.districts[selectedDistrict];
    const districtName = districtObj ? districtObj.name : selectedDistrict;

    const targetUrl = selectedDong
      ? `/${selectedRegion}/${encodeURIComponent(districtName)}/${encodeURIComponent(selectedDong)}`
      : `/${selectedRegion}/${encodeURIComponent(districtName)}`;

    window.location.href = targetUrl;
  };

  const currentDistricts = regionData[selectedRegion]?.districts || {};
  const currentDongs =
    selectedDistrict && currentDistricts[selectedDistrict]
      ? currentDistricts[selectedDistrict].dongs
      : [];

  return (
    <div className="bg-[#070709] text-gray-100 min-h-screen flex flex-col font-sans selection:bg-amber-500 selection:text-black">
      <main className="max-w-4xl mx-auto px-4 py-8 w-full flex-1 space-y-12">
        {/* 상단 메인 배너 */}
        <section className="text-center my-2">
          <div className="overflow-hidden rounded-3xl border border-amber-500/30 shadow-[0_0_40px_rgba(245,158,11,0.12)] relative h-60 md:h-72 flex items-center justify-center p-6 bg-gradient-to-b from-[#141418] to-[#0a0a0d]">
            <div className="absolute inset-0 z-0">
              <img
                src="/banner.jpg"
                alt="케어존마사지 메인 배너"
                className="w-full h-full object-cover filter brightness-[0.4] scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent"></div>
            </div>

            <div className="relative z-10 space-y-3">
              <span className="inline-block px-3.5 py-1 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/40 font-bold text-xs tracking-wider">
                수도권 힐링 테라피 큐레이션 플랫폼
              </span>
              <h1 className="text-2xl md:text-4xl font-black text-white tracking-tight drop-shadow-lg">
                서울·경기·인천{" "}
                <span className="bg-gradient-to-r from-amber-300 to-amber-500 bg-clip-text text-transparent">
                  케어존마사지 프리미엄 바디 웰니스 가이드
                </span>
              </h1>
              <p className="text-gray-200 text-xs md:text-sm font-medium max-w-lg mx-auto leading-relaxed drop-shadow">
                엄선된 전문 테라피스트들의 1:1 맞춤 바디 릴렉싱 프로그램을 케어존마사지에서 손쉽게 비교하고 확인하세요.
              </p>
            </div>
          </div>
        </section>

        {/* 메인 추천 제휴 샵 */}
        <section className="space-y-6">
          <div className="text-center mb-4">
            <p className="text-xs text-amber-400 font-bold tracking-widest uppercase">
              RECOMMENDED PARTNERS
            </p>
            <h2 className="text-xl md:text-2xl font-black text-white mt-1">
              🏆 케어존마사지 베스트 추천 제휴 샵
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {shops.map((lShop) => (
              <div
                key={lShop.id}
                className="bg-[#111114] border border-amber-500/20 rounded-2xl p-4 flex gap-4 items-center shadow-md"
              >
                <img
                  src={lShop.image}
                  alt={lShop.name}
                  className="w-20 h-20 md:w-24 md:h-24 rounded-xl object-cover border border-white/10 flex-shrink-0"
                />

                <div className="flex-1 min-w-0">
                  <h3 className="font-extrabold text-sm md:text-base text-white truncate">
                    {lShop.name}
                  </h3>
                  <p className="text-[11px] text-gray-400 mt-1 line-clamp-2 leading-snug">
                    {lShop.desc}
                  </p>
                  <div className="mt-2.5 flex items-center justify-between">
                    <span className="text-xs font-black text-amber-400">
                      {lShop.price}
                    </span>
                    <a
                      href={`tel:${lShop.phone.replace(/-/g, "")}`}
                      className="bg-amber-500 hover:bg-amber-400 text-black font-extrabold text-xs px-3.5 py-1.5 rounded-xl shadow transition-colors active:scale-95 flex items-center gap-1"
                    >
                      <span>📞</span> 전화연결
                    </a>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* 수도권 지역 검색 박스 */}
        <section className="pt-6 border-t border-white/10">
          <div className="bg-gradient-to-b from-[#16161b] to-[#0e0e12] border border-amber-500/30 p-6 rounded-3xl max-w-xl mx-auto shadow-2xl text-left relative overflow-hidden">
            <div className="flex items-center justify-between mb-4">
              <label className="text-xs text-amber-400 font-black uppercase tracking-wider flex items-center gap-1.5">
                📍 내 주변 맞춤 테라피 찾기
              </label>
              <span className="text-[11px] text-gray-400 bg-black/40 px-2.5 py-1 rounded-lg border border-white/5">
                서울·경기·인천 전역
              </span>
            </div>

            <div className="space-y-3.5">
              <div>
                <span className="text-[11px] text-gray-400 block mb-1 font-semibold">
                  1단계: 광역 시·도 선택
                </span>
                <select
                  value={selectedRegion}
                  onChange={handleRegionChange}
                  className="bg-black/80 text-sm text-white w-full outline-none cursor-pointer font-bold p-3.5 rounded-xl border border-amber-500/30 focus:border-amber-400 transition-colors shadow-inner"
                >
                  {Object.keys(regionData).map((key) => (
                    <option key={key} value={key} className="bg-[#1c1c1f] text-white">
                      {regionData[key].name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <span className="text-[11px] text-gray-400 block mb-1 font-semibold">
                  2단계: 구·시·군 선택
                </span>
                <select
                  value={selectedDistrict}
                  onChange={handleDistrictChange}
                  className="bg-black/80 text-sm text-white w-full outline-none cursor-pointer font-bold p-3.5 rounded-xl border border-amber-500/30 focus:border-amber-400 transition-colors shadow-inner"
                >
                  <option value="" className="bg-[#1c1c1f] text-gray-400">
                    구 / 시 / 군을 선택해주세요
                  </option>
                  {Object.keys(currentDistricts).map((dKey) => (
                    <option key={dKey} value={dKey} className="bg-[#1c1c1f] text-white">
                      {currentDistricts[dKey].name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <span className="text-[11px] text-gray-400 block mb-1 font-semibold">
                  3단계: 동 선택 (세부 필터)
                </span>
                <select
                  value={selectedDong}
                  onChange={(e) => setSelectedDong(e.target.value)}
                  disabled={!selectedDistrict}
                  className="bg-black/80 text-sm text-white w-full outline-none cursor-pointer font-medium p-3.5 rounded-xl border border-amber-500/30 disabled:opacity-30 transition-colors shadow-inner"
                >
                  <option value="" className="bg-[#1c1c1f] text-gray-400">
                    동 전체 보기
                  </option>
                  {currentDongs.map((dong, idx) => (
                    <option key={idx} value={dong} className="bg-[#1c1c1f] text-white">
                      {dong}
                    </option>
                  ))}
                </select>
              </div>

              <button
                onClick={handleSearch}
                className="w-full bg-gradient-to-r from-amber-500 via-yellow-400 to-amber-500 hover:from-amber-400 hover:to-yellow-300 text-black font-black py-4 rounded-2xl text-sm transition-all shadow-[0_0_25px_rgba(245,158,11,0.35)] mt-3 cursor-pointer transform active:scale-[0.98]"
              >
                🔍 선택한 지역 테라피 샵 정보 확인하기
              </button>
            </div>
          </div>
        </section>

        {/* 🌟 네이버 로봇 크롤링 누락 방지용 주요 지역 내부 링크 (SEO 필수 요소) */}
        <section className="bg-[#0b0b0e] border border-white/5 p-6 rounded-3xl space-y-4">
          <div className="border-b border-white/10 pb-3">
            <h3 className="text-sm font-bold text-amber-400 flex items-center gap-1.5">
              <span>🗺️</span> 수도권 주요 지역별 바로가기
            </h3>
            <p className="text-[11px] text-gray-400 mt-1">
              원하시는 지역을 선택하시면 해당 지역의 추천 샵 목록을 바로 확인하실 수 있습니다.
            </p>
          </div>
          <div className="flex flex-wrap gap-2 pt-2">
            {Object.entries(regionData).map(([rKey, rVal]) =>
              Object.entries(rVal.districts).slice(0, 10).map(([dKey, dVal]) => (
                <Link
                  key={dKey}
                  href={`/${rKey}/${encodeURIComponent(dVal.name)}`}
                  className="text-xs bg-neutral-900/90 text-gray-300 hover:text-amber-400 hover:border-amber-500/40 px-3 py-1.5 rounded-lg border border-white/5 transition-colors"
                >
                  {dVal.name} 마사지
                </Link>
              ))
            )}
          </div>
        </section>

        {/* 가이드 섹션 */}
        <section className="bg-[#0f0f13] border border-amber-500/20 p-6 md:p-8 rounded-3xl space-y-6">
          <div className="text-center">
            <span className="text-amber-400 text-xs font-bold tracking-widest uppercase">
              SERVICE GUIDE
            </span>
            <h3 className="text-xl font-black text-white mt-1">
              케어존마사지 안심 이용 가이드
            </h3>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-black/60 p-4 rounded-2xl border border-white/5 text-center">
              <span className="text-xs text-amber-400 font-bold">STEP 1</span>
              <h4 className="font-bold text-white mt-1">지역 확인</h4>
              <p className="text-xs text-gray-400 mt-1">
                원하시는 수도권 주요 지역을 선택합니다.
              </p>
            </div>
            <div className="bg-black/60 p-4 rounded-2xl border border-white/5 text-center">
              <span className="text-xs text-amber-400 font-bold">STEP 2</span>
              <h4 className="font-bold text-white mt-1">프로그램 비교</h4>
              <p className="text-xs text-gray-400 mt-1">
                타이, 아로마, 스웨디시 코스를 확인합니다.
              </p>
            </div>
            <div className="bg-black/60 p-4 rounded-2xl border border-white/5 text-center">
              <span className="text-xs text-amber-400 font-bold">STEP 3</span>
              <h4 className="font-bold text-white mt-1">직접 상담</h4>
              <p className="text-xs text-gray-400 mt-1">
                전화 버튼으로 샵과 직접 일정을 소통합니다.
              </p>
            </div>
            <div className="bg-black/60 p-4 rounded-2xl border border-white/5 text-center">
              <span className="text-xs text-amber-400 font-bold">STEP 4</span>
              <h4 className="font-bold text-white mt-1">맞춤 케어</h4>
              <p className="text-xs text-gray-400 mt-1">
                전문 테라피스트의 프라이빗 힐링을 누립니다.
              </p>
            </div>
          </div>
        </section>

        {/* 이용 후기 */}
        <section className="space-y-4">
          <div className="text-center">
            <span className="text-amber-400 text-xs font-bold tracking-widest uppercase">
              USER REVIEWS
            </span>
            <h3 className="text-xl font-black text-white mt-1">
              실제 이용 고객 솔직 후기
            </h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-[#101014] p-5 rounded-2xl border border-white/5 space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-amber-400 font-black text-sm">★★★★★ 5.0</span>
                <span className="text-[11px] text-gray-500">서울 강남 이용자</span>
              </div>
              <p className="text-xs text-gray-300 leading-relaxed">
                &quot;시간에 맞춰 꼼꼼하게 진행해주셨고 관리사분이 매우 정성스럽게 관리해 주셨습니다. 뭉친 피로가 싹 풀렸네요.&quot;
              </p>
            </div>
            <div className="bg-[#101014] p-5 rounded-2xl border border-white/5 space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-amber-400 font-black text-sm">★★★★★ 5.0</span>
                <span className="text-[11px] text-gray-500">인천 송도 이용자</span>
              </div>
              <p className="text-xs text-gray-300 leading-relaxed">
                &quot;플랫폼에 등록된 정보가 투명해서 좋았고 상담도 친절했습니다. 번거롭게 찾아다닐 필요 없이 편리하게 이용했습니다.&quot;
              </p>
            </div>
          </div>
        </section>

        {/* 자주 묻는 질문 */}
        <section className="space-y-4">
          <div className="text-center">
            <span className="text-amber-400 text-xs font-bold tracking-widest uppercase">
              FAQ
            </span>
            <h3 className="text-xl font-black text-white mt-1">자주 묻는 질문</h3>
          </div>
          <div className="space-y-3">
            <FaqItem
              question="예약 및 상담은 어떻게 진행되나요?"
              answer="케어존마사지에 등록된 각 제휴 업체의 전화연결 버튼을 통해 샵으로 직접 연결되며, 코스 및 시간을 바로 조율하실 수 있습니다."
            />
            <FaqItem
              question="수도권 전 지역 이용이 가능한가요?"
              answer="서울 25개 구, 경기도 31개 시·군, 인천 전역의 주요 권역별로 등록된 제휴 샵 정보를 편리하게 확인하실 수 있습니다."
            />
          </div>
        </section>
      </main>

      {/* 푸터 */}
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

          <p className="text-gray-400 font-medium">
            케어존마사지는 건전하고 쾌적한 프리미엄 바디 테라피 제휴 정보를 제공하는 웰니스 안내 플랫폼입니다.
          </p>
          <p className="text-[11px] text-gray-600">
            COPYRIGHT &copy; CAREZONE MASSAGE ALL RIGHTS RESERVED.
          </p>
        </div>
      </footer>
    </div>
  );
}