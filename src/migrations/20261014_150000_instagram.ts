import type { MigrateUpArgs, MigrateDownArgs } from '@payloadcms/db-postgres'

/* Подвал: ссылка на Instagram сообщества. Ставится, только если поле пустое. */
const URL = 'https://www.instagram.com/futurearch.md/'

export async function up({ payload, req }: MigrateUpArgs): Promise<void> {
  let doc: any
  try {
    doc = await payload.findGlobal({ slug: 'common' as any, depth: 0, req })
  } catch {
    return
  }
  if (!doc) return
  const cur = doc?.contacts?.instagram || {}
  if (['ru', 'ro', 'en'].some((l) => String(cur[l] || '').trim())) return
  const data: any = Object.fromEntries(Object.entries(doc).filter(([k]) => !['id', 'globalType', 'createdAt', 'updatedAt'].includes(k)))
  data.contacts = { ...(data.contacts || {}), instagram: { ru: URL, ro: URL, en: URL } }
  await payload.updateGlobal({ slug: 'common' as any, data, req, context: { skipRevalidate: true } })
  payload.logger.info('[14.10] common: Instagram в подвале')
}

export async function down(_: MigrateDownArgs): Promise<void> {}
