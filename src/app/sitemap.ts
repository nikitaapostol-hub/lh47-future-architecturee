import type { MetadataRoute } from 'next'
import { LANGS, PAGES, SITE, path } from '@/i18n/links'

export default function sitemap(): MetadataRoute.Sitemap {
  const out: MetadataRoute.Sitemap = []
  for (const page of PAGES) {
    for (const lang of LANGS) {
      out.push({
        url: SITE + path(lang, page),
        changeFrequency: 'weekly',
        priority: page === '/' ? 1 : 0.8,
        alternates: {
          languages: Object.fromEntries(LANGS.map((l) => [l, SITE + path(l, page)])),
        },
      })
    }
  }
  return out
}
