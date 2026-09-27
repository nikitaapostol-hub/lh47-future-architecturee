import { getPayload } from 'payload'
import config from '@payload-config'
import type { Lang } from '@/i18n/links'

/** Globals are optional: the site must still render if the DB is unreachable
    (first deploy, preview build, local run without DATABASE_URI). */
export async function getGlobal<T = any>(
  slug: string,
  locale?: Lang,
  /** false — не подставлять русский вместо пустых полей (для текстов страниц:
      пустое поле в RO/EN должно брать перевод из кода, а не русскую правку). */
  fallback = true,
): Promise<Partial<T>> {
  try {
    const payload = await getPayload({ config })
    return (await payload.findGlobal({
      slug: slug as any,
      ...(locale ? { locale, fallbackLocale: (fallback ? 'ru' : 'none') as any } : {}),
      depth: 1,
    })) as Partial<T>
  } catch (e) {
    console.warn(`[settings] falling back to defaults for "${slug}":`, (e as Error).message)
    return {}
  }
}
