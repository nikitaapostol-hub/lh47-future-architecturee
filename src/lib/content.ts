/* Словарь страницы = тексты из кода, поверх которых ложатся значения из админки.
   Если база недоступна или поле пустое — остаётся исходный текст. */
import { getGlobal } from '@/lib/settings'
import { dict } from '@/i18n'
import type { Dict } from '@/i18n/dict'
import type { Lang } from '@/i18n/links'
import { applyContent } from '@/cms/build'
import { COMMON } from '@/cms/common'
import { HOME } from '@/cms/home'
import { FORUM } from '@/cms/forum'
import { AWARD } from '@/cms/award'

type Page = 'home' | 'forum' | 'award'

/** Тексты для страницы: общие + свои. `own` — уже загруженный раздел страницы,
    чтобы не ходить в базу дважды. */
export async function texts(page: Page | null, lang: Lang, own?: any): Promise<Dict> {
  const desc = page === 'home' ? HOME : page === 'forum' ? FORUM : page === 'award' ? AWARD : null
  const [common, self] = await Promise.all([
    getGlobal(COMMON.slug),
    desc ? (own ? Promise.resolve(own) : getGlobal(desc.slug)) : Promise.resolve(null),
  ])
  const all: Record<string, string> = {
    ...dict[lang],
    ...applyContent(COMMON, common, lang),
    ...(desc ? applyContent(desc, self, lang) : {}),
  }
  // В браузер уходят только тексты этой страницы и общие (c*).
  const own2 = page === 'home' ? 'h' : page === 'forum' ? 'f' : page === 'award' ? 'a' : ''
  const out: Record<string, string> = {}
  for (const k in all) if (k[0] === 'c' || (own2 && k[0] === own2)) out[k] = all[k]
  return out as Dict
}
