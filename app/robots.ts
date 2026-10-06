import { MetadataRoute } from 'next';

const BASE_URL = 'https://carezone-massage.netlify.app';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: ['/api/'], // 검색에 불필요한 내부 API 경로 차단
    },
    sitemap: `${BASE_URL}/sitemap.xml`,
  };
}