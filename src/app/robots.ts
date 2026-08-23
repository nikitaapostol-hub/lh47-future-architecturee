import type { MetadataRoute } from 'next'
import { SITE } from '@/i18n/links'

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        // админка и служебные маршруты в индекс не нужны
        disallow: ['/admin', '/api/'],
      },
    ],
    sitemap: SITE + '/sitemap.xml',
    host: SITE,
  }
}
