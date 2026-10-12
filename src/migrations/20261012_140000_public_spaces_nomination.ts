import type { MigrateUpArgs, MigrateDownArgs } from '@payloadcms/db-postgres'

/* Премия: пятая номинация «Общественные пространства».
   1. Добавляется в конец списка номинаций (если её ещё нет).
   2. Тексты «четыре номинации / 4 номинации» → «пять / 5» на трёх языках —
      на странице премии и в SEO-описании. Остальные правки в админке не трогаем. */

const NOM = {
  kind: { ru: 'Архитектура', ro: 'Arhitectură', en: 'Architecture' },
  title: { ru: 'Общественные пространства', ro: 'Spații publice', en: 'Public spaces' },
}

const SWAP: [string, string][] = [
  ['в одной из четырёх номинаций', 'в одной из пяти номинаций'],
  ['Для архитекторов и дизайнеров: 4 номинации', 'Для архитекторов и дизайнеров: 5 номинаций'],
  ['Четыре номинации', 'Пять номинаций'],
  ['в четырёх номинациях', 'в пяти номинациях'],
  ['cele patru nominalizări', 'cele cinci nominalizări'],
  ['designeri: 4 nominalizări', 'designeri: 5 nominalizări'],
  ['Patru nominalizări', 'Cinci nominalizări'],
  ['în patru nominalizări', 'în cinci nominalizări'],
  ['one of four categories', 'one of five categories'],
  ['designers: 4 categories', 'designers: 5 categories'],
  ['Four categories', 'Five categories'],
  ['in four categories', 'in five categories'],
]
const SKIP = new Set(['id', 'globalType', 'createdAt', 'updatedAt'])

function swap(v: any): any {
  if (typeof v === 'string') return SWAP.reduce((s, [a, b]) => s.split(a).join(b), v)
  if (Array.isArray(v)) return v.map(swap)
  if (v && typeof v === 'object') return Object.fromEntries(Object.entries(v).map(([k, x]) => [k, swap(x)]))
  return v
}

export async function up({ payload, req }: MigrateUpArgs): Promise<void> {
  for (const slug of ['award', 'settings']) {
    let doc: any
    try {
      doc = await payload.findGlobal({ slug: slug as any, depth: 0, req })
    } catch {
      continue
    }
    if (!doc) continue
    const data = swap(doc)
    for (const k of SKIP) delete data[k]
    let changed = JSON.stringify(data) !== JSON.stringify(Object.fromEntries(Object.entries(doc).filter(([k]) => !SKIP.has(k))))

    if (slug === 'award') {
      const list = Array.isArray(data.nominationList) ? data.nominationList : []
      const has = list.some((n: any) => /обществен|public|publice/i.test(JSON.stringify(n?.title || '')))
      if (list.length && !has) {
        data.nominationList = [...list, NOM]
        changed = true
      }
    }
    if (!changed) continue
    await payload.updateGlobal({ slug: slug as any, data, req, context: { skipRevalidate: true } })
    payload.logger.info(`[award] ${slug}: пятая номинация и тексты обновлены`)
  }
}

export async function down(_: MigrateDownArgs): Promise<void> {}
