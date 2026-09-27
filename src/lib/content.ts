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
import type { PageContent } from '@/cms/types'

async function overrides(p: PageContent, lang: Lang) {
  return applyContent(p, await getGlobal(p.slug, lang, false), lang)
}

/** Тексты для страницы: общие + свои. Без page — только общие (политика, 404). */
export async function texts(page: 'home' | 'forum' | 'award' | null, lang: Lang): Promise<Dict> {
  const own = page === 'home' ? HOME : page === 'forum' ? FORUM : page === 'award' ? AWARD : null
  const [common, self] = await Promise.all([
    overrides(COMMON, lang),
    own ? overrides(own, lang) : Promise.resolve({}),
  ])
  const all: Record<string, string> = { ...dict[lang], ...common, ...self }
  // В браузер уходят только тексты этой страницы и общие (c*): словарь всех страниц
  // заметно утяжелил бы каждую из них.
  const own2 = page === 'home' ? 'h' : page === 'forum' ? 'f' : page === 'award' ? 'a' : ''
  const out: Record<string, string> = {}
  for (const k in all) if (k[0] === 'c' || (own2 && k[0] === own2)) out[k] = all[k]
  return out as Dict
}
