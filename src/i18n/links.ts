export type Lang = 'ru' | 'ro' | 'en'

export const LANGS: Lang[] = ['ru', 'ro', 'en']

/** Russian lives at the root — the links that are already out in the world
 *  keep working. The other languages sit under their own prefix. */
export function path(lang: Lang, page: string): string {
  const p = page === '/' ? '' : page
  return lang === 'ru' ? p || '/' : '/' + lang + p
}
