import type { MigrateUpArgs, MigrateDownArgs } from '@payloadcms/db-postgres'

/* Заявки с сайта — напрямую Никите и Владе, без пересылки info@ на весь отдел.
   Меняется, только если в админке стоял прежний адрес. */
const NEXT = 'nikita.apostol@lh47arch.com, vlada.medvedcova@lh47arch.com'

export async function up({ payload, req }: MigrateUpArgs): Promise<void> {
  let doc: any
  try {
    doc = await payload.findGlobal({ slug: 'settings' as any, depth: 0, req })
  } catch {
    return
  }
  if (!doc) return
  const cur = String(doc.mailTo || '').trim().toLowerCase()
  if (cur && cur !== 'info@future-arch.md' && cur !== 'marketing-team@lh47arch.com') return
  const data: any = Object.fromEntries(Object.entries(doc).filter(([k]) => !['id', 'globalType', 'createdAt', 'updatedAt'].includes(k)))
  data.mailTo = NEXT
  await payload.updateGlobal({ slug: 'settings' as any, data, req, context: { skipRevalidate: true } })
  payload.logger.info('[22.10] settings: заявки — Никите и Владе')
}

export async function down(_: MigrateDownArgs): Promise<void> {}
