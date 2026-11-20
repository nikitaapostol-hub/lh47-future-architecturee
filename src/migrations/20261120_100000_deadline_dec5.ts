import type { MigrateUpArgs, MigrateDownArgs } from '@payloadcms/db-postgres'

/* 20.11.2026 — приём заявок на премию и студенческий конкурс продлён до 5 декабря.
   Меняется дата в «Премия → Приём заявок» (если стоит более ранняя) и во всех
   текстах админки «20 ноября / 20 noiembrie / 20 November» → «5 декабря / 5 decembrie / 5 December». */

const NEW_DEADLINE = '2026-12-05T21:59:00.000Z' // 5 декабря, 23:59 по Кишинёву
const SKIP = ['id', 'globalType', 'createdAt', 'updatedAt']
const strip = (d: any) => Object.fromEntries(Object.entries(d || {}).filter(([k]) => !SKIP.includes(k)))

const RULES: [RegExp, string][] = [
  [/(^|[^0-9])20 ноября/g, '$15 декабря'],
  [/\b20 noiembrie\b/g, '5 decembrie'],
  [/\b20(th)? November\b/g, '5 December'],
  [/\bNovember 20(th)?\b/g, 'December 5'],
  [/\b20\.11\.2026\b/g, '05.12.2026'],
  [/\b20\.11\b/g, '05.12'],
]
function fix(v: any): any {
  if (typeof v === 'string') return RULES.reduce((s, [re, to]) => s.replace(re, to), v)
  if (Array.isArray(v)) return v.map(fix)
  if (v && typeof v === 'object') return Object.fromEntries(Object.entries(v).map(([k, x]) => [k, fix(x)]))
  return v
}

export async function up({ payload, req }: MigrateUpArgs): Promise<void> {
  for (const slug of ['home', 'forum', 'award', 'settings']) {
    let doc: any
    try {
      doc = await payload.findGlobal({ slug: slug as any, depth: 0, req })
    } catch {
      continue
    }
    if (!doc) continue
    const before = strip(doc)
    const data: any = fix(before)
    if (slug === 'award' && (!data.deadlineDate || new Date(data.deadlineDate) < new Date(NEW_DEADLINE))) data.deadlineDate = NEW_DEADLINE
    if (JSON.stringify(data) === JSON.stringify(before)) continue
    await payload.updateGlobal({ slug: slug as any, data, req, context: { skipRevalidate: true } })
    payload.logger.info(`[20.11] ${slug}: приём заявок до 5 декабря`)
  }
}

export async function down(_: MigrateDownArgs): Promise<void> {}
