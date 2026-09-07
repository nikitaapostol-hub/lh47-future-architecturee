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
  return applyContent(p, await getGlobal(p.slug, lang), lang)
}

/** Тексты для одной из страниц: общие + свои. */
export async function texts(page: 'home' | 'forum' | 'award', lang: Lang): Promise<Dict> {
  const own = page === 'home' ? HOME : page === 'forum' ? FORUM : AWARD
  const [common, self] = await Promise.all([overrides(COMMON, lang), overrides(own, lang)])
  return { ...dict[lang], ...common, ...self }
}
