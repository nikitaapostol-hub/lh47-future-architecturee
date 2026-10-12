import type { MigrateUpArgs, MigrateDownArgs } from '@payloadcms/db-postgres'
import { SEO_COPY } from '../i18n/seo-defaults'

/* Финальное название — Future Architecture.

   1. Во всех разделах админки (страницы, меню и подвал, настройки) прежнее
      название ARCH MAKERS заменяется на Future Architecture: тексты страниц,
      подписи, письмо «Заявка получена».
   2. SEO-заголовки и описания, которые всё ещё стоят из первой выкладки
      (с прежним названием), заменяются новыми — с ключевыми фразами
      «архитектурный форум в Молдове», «сообщество архитекторов и дизайнеров».
      Если заголовок уже правили руками, он остаётся, только с новым названием.
   Схема базы не меняется. */

const OLD = /ARCH\s+MAKERS|Arch\s+Makers/g
const HAS = /ARCH\s+MAKERS|Arch\s+Makers/
const NEW = 'Future Architecture'
/** Описания из первой выкладки — их тоже меняем на новые. */
const OLD_DESC = new Set([
  'Профессиональное сообщество архитекторов, дизайнеров и представителей индустрий Молдовы: форум, премия, встречи ArchiMinds, журнал и поездки. Вступление по заявке.',
  'Comunitatea profesională a arhitecților, designerilor și reprezentanților industriilor din Moldova: forum, premiu, întâlniri ArchiMinds, revistă și călătorii. Aderare pe bază de cerere.',
  'A professional community of architects, designers and industry representatives in Moldova: a forum, an award, ArchiMinds meetings, a magazine and trips. Membership by application.',
  'Закрытая встреча тех, кто определяет будущее недвижимости Молдовы. Более 250 девелоперов, инвесторов, архитекторов и производителей. 9 декабря 2026, Range Rover Moldova. Участие по отбору.',
  'O întâlnire închisă a celor care definesc viitorul imobiliarelor din Moldova. Peste 250 de dezvoltatori, investitori, arhitecți și producători. 9 decembrie 2026, Range Rover Moldova. Participare pe bază de selecție.',
  'A closed meeting of the people shaping the future of real estate in Moldova. More than 250 developers, investors, architects and manufacturers. 9 December 2026, Range Rover Moldova. Attendance by selection.',
  'Премия для архитекторов и дизайнеров в четырёх номинациях и студенческий конкурс. Заявки до 20 ноября, победителей объявят 9 декабря на сцене ARCH MAKERS Forum.',
  'Premiu pentru arhitecți și designeri în patru nominalizări și un concurs studențesc. Cereri până pe 20 noiembrie, câștigătorii vor fi anunțați pe 9 decembrie pe scena ARCH MAKERS Forum.',
  'An award for architects and designers in four categories, plus a student competition. Applications until 20 November, winners announced on 9 December on stage at ARCH MAKERS Forum.',
])
const SEO_KEYS = { home: '/', forum: '/forum', award: '/award' } as const
const LANGS = ['ru', 'ro', 'en'] as const
const SKIP = new Set(['id', 'globalType', 'createdAt', 'updatedAt'])

function rename(v: any): any {
  if (typeof v === 'string') return v.replace(OLD, NEW)
  if (Array.isArray(v)) return v.map(rename)
  if (v && typeof v === 'object') {
    const out: Record<string, any> = {}
    for (const [k, x] of Object.entries(v)) out[k] = rename(x)
    return out
  }
  return v
}

export async function up({ payload, req }: MigrateUpArgs): Promise<void> {
  for (const slug of ['home', 'forum', 'award', 'common', 'settings']) {
    let doc: any
    try {
      doc = await payload.findGlobal({ slug: slug as any, depth: 0, req })
    } catch {
      continue
    }
    if (!doc) continue
    const hadOld = HAS.test(JSON.stringify(doc))
    const data = rename(doc)
    for (const k of SKIP) delete data[k]

    if (slug === 'settings') {
      for (const [k, page] of Object.entries(SEO_KEYS)) {
        for (const field of ['title', 'description'] as const) {
          const was = doc?.seo?.[k]?.[field] || {}
          for (const l of LANGS) {
            const v = was[l]
            // пусто или стоит текст из первой выкладки — ставим новый
            if (typeof v !== 'string' || !v.trim() || HAS.test(v) || OLD_DESC.has(v.trim())) {
              data.seo = data.seo || {}
              data.seo[k] = data.seo[k] || {}
              data.seo[k][field] = { ...(data.seo[k][field] || {}), [l]: SEO_COPY[page][l][field] }
            }
          }
        }
      }
    }

    if (!hadOld && slug !== 'settings') continue
    await payload.updateGlobal({ slug: slug as any, data, req, context: { skipRevalidate: true } })
    payload.logger.info(`[future-architecture] ${slug}: название обновлено`)
  }
}

export async function down(_: MigrateDownArgs): Promise<void> {
  // Обратно не переименовываем.
}
