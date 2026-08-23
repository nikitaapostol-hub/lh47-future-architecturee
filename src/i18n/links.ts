export type Lang = 'ru' | 'ro' | 'en'

export const LANGS: Lang[] = ['ru', 'ro', 'en']

/** Russian lives at the root — the links that are already out in the world
 *  keep working. The other languages sit under their own prefix. */
export function path(lang: Lang, page: string): string {
  const p = page === '/' ? '' : page
  return lang === 'ru' ? p || '/' : '/' + lang + p
}

/** Публичный адрес сайта. Берётся из переменной окружения, но по умолчанию —
 *  боевой домен: без этого canonical и og:url уезжали бы на localhost. */
export const SITE = (process.env.NEXT_PUBLIC_SITE_URL || 'https://future-arch.md').replace(/\/$/, '')

/** Страницы, которые попадают в карту сайта. */
export const PAGES = ['/', '/forum', '/award', '/privacy'] as const
