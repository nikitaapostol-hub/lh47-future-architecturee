import type { MetadataRoute } from 'next'
import { SITE } from '@/i18n/links'

/** Админка и служебные маршруты в индекс не нужны. */
const PRIVATE = ['/admin', '/api/']

/** Поисковые и AI-краулеры, которым сайт открыт явно: так сайт попадает
    и в обычную выдачу, и в ответы ChatGPT, Claude, Perplexity, Gemini. */
const BOTS = [
  'Googlebot',
  'Bingbot',
  'YandexBot',
  'Google-Extended',
  'GPTBot',
  'OAI-SearchBot',
  'ChatGPT-User',
  'ClaudeBot',
  'Claude-SearchBot',
  'Claude-User',
  'PerplexityBot',
  'Perplexity-User',
  'Applebot',
  'Applebot-Extended',
]

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      { userAgent: BOTS, allow: '/', disallow: PRIVATE },
      { userAgent: '*', allow: '/', disallow: PRIVATE },
    ],
    sitemap: SITE + '/sitemap.xml',
    host: SITE,
  }
}
