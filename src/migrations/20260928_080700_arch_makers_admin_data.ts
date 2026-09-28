import { sql, type MigrateUpArgs, type MigrateDownArgs } from '@payloadcms/db-postgres'
import { filledData, RAW } from '../cms/build'
import { COMMON } from '../cms/common'
import { HOME } from '../cms/home'
import { FORUM } from '../cms/forum'
import { AWARD } from '../cms/award'
import { SEO_COPY } from '../i18n/seo-defaults'

/* ARCH MAKERS — перенос данных в новую админку.

   Всё, что уже сохранено (правки текстов, спикеры с фото, номинации, дата форума,
   дедлайн, почта для заявок, автоответ, SEO, счётчики), читается из старых таблиц
   и кладётся в новые разделы. Пустые поля заполняются текстом, который сейчас
   на сайте, — чтобы в админке было видно реальное содержимое, а не пустоту.
   Старые таблицы только читаются. Раздел, который уже заполнен, не трогается. */

type L = 'ru' | 'ro' | 'en'
const LS: L[] = ['ru', 'ro', 'en']

/** Для чистой базы: состав из макета. */
const DEFAULT_SPEAKERS = [
  { name: { ru: 'Дмитрий Волошин', ro: 'Dmitri Voloșin', en: 'Dmitry Voloshin' }, role: { ru: 'Основатель Simpals, 999.md, Point.md и Woloshin Banya', ro: 'Fondatorul Simpals, 999.md, Point.md și Woloshin Banya', en: 'Founder of Simpals, 999.md, Point.md and Woloshin Banya' } },
  { name: { ru: 'Дмитрий Разлога', ro: 'Dmitri Razloga', en: 'Dmitry Razloga' }, role: { ru: 'Основатель сети магазинов JYSK Bonus Local', ro: 'Fondatorul rețelei de magazine JYSK Bonus Local', en: 'Founder of the JYSK Bonus Local store chain' } },
  { name: { ru: 'Сергей Мырза', ro: 'Serghei Mîrza', en: 'Sergei Myrza' }, role: { ru: 'Основатель архитектурного бюро LH47 ARCH', ro: 'Fondatorul biroului de arhitectură LH47 ARCH', en: 'Founder of LH47 ARCH architecture bureau' } },
  { name: { ru: 'Вячеслав Ионицэ', ro: 'Veaceslav Ioniță', en: 'Veaceslav Ioniță' }, role: { ru: 'Экономический эксперт', ro: 'Expert economic', en: 'Economic expert' } },
] as { name: Record<string, string>; role: Record<string, string> }[]
const DEFAULT_NOMS = [
  { kind: { ru: 'Архитектура', ro: 'Arhitectură', en: 'Architecture' }, title: { ru: 'Архитектура частного дома', ro: 'Arhitectura casei private', en: 'Private house architecture' } },
  { kind: { ru: 'Архитектура', ro: 'Arhitectură', en: 'Architecture' }, title: { ru: 'Архитектура жилого комплекса', ro: 'Arhitectura complexului rezidențial', en: 'Residential complex architecture' } },
  { kind: { ru: 'Интерьер', ro: 'Interior', en: 'Interior' }, title: { ru: 'Интерьер жилого пространства', ro: 'Interiorul spațiului rezidențial', en: 'Residential interior' } },
  { kind: { ru: 'Интерьер', ro: 'Interior', en: 'Interior' }, title: { ru: 'Интерьер коммерческого пространства', ro: 'Interiorul spațiului comercial', en: 'Commercial interior' } },
] as { kind: Record<string, string>; title: Record<string, string> }[]
const snake = (s: string) => s.replace(/([a-z0-9])([A-Z])/g, '$1_$2').toLowerCase()

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  const rows = async (q: string): Promise<any[]> => {
    try {
      const r: any = await db.execute(sql.raw(q))
      return r?.rows || []
    } catch {
      return []
    }
  }
  const tableExists = async (t: string) =>
    (await rows(`select 1 from information_schema.tables where table_schema='public' and table_name='${t}'`)).length > 0
  const empty = async (t: string) => (await rows(`select id from "${t}" limit 1`)).length === 0
  const nz = (v: any) => (typeof v === 'string' && v.trim() ? v : undefined)
  /** Старая админка подставляла русский текст по умолчанию и в RO/EN.
      Такой «перевод», совпадающий с русским, считаем пустым. */
  const perLang = (get: (l: L) => string | undefined, fallback: (l: L) => string) => {
    const ru = get('ru')
    return Object.fromEntries(
      LS.map((l) => {
        const v = get(l)
        return [l, v && !(l !== 'ru' && v === ru) ? v : fallback(l)]
      }),
    )
  }

  // ——— тексты страниц: правки из вчерашних разделов page-* + тексты сайта
  for (const [desc, old] of [
    [HOME, 'page_home'],
    [FORUM, 'page_forum'],
    [AWARD, 'page_award'],
    [COMMON, 'page_common'],
  ] as const) {
    const locRows = (await tableExists(old + '_locales')) ? await rows(`select * from "${old}_locales"`) : []
    const byLocale: Record<string, any> = Object.fromEntries(locRows.map((r) => [r._locale, r]))
    const arrays: Record<string, any[]> = {}
    for (const s of desc.sections)
      for (const f of s.fields)
        if (f.kind === 'list') {
          const t = `${old}_${snake(s.name)}_${snake(f.name)}`
          arrays[s.name + '.' + f.name] = (await tableExists(t)) ? await rows(`select * from "${t}" order by _order`) : []
        }
    const oldValue = (lang: L, section: string, field: string, row?: number, col?: string) => {
      if (row === undefined) return nz(byLocale[lang]?.[snake(section) + '_' + snake(field)])
      const list = (arrays[section + '.' + field] || []).filter((r) => r._locale === lang)
      return nz(list[row]?.[snake(col || '')])
    }
    if (!(await empty(desc.slug))) {
      payload.logger.info(`[arch-makers] раздел ${desc.slug} уже заполнен — пропускаю`)
      continue
    }
    const data: Record<string, any> = filledData(desc, oldValue as any)

    if (desc.slug === 'forum') {
      const fs = (await rows(`select forum_date, countdown_visible from forum_settings limit 1`))[0]
      if (fs?.forum_date) data.forumDate = new Date(fs.forum_date).toISOString()
      if (fs && fs.countdown_visible === false) data.countdownVisible = false
      const sp = await rows(
        `select s.id, s._order, s.photo_id, l._locale, l.name, l.role from forum_settings_speakers s
         left join forum_settings_speakers_locales l on l._parent_id = s.id order by s._order`,
      )
      const byId = new Map<string, any>()
      for (const r of sp) {
        const cur = byId.get(r.id) || { _order: r._order, photo: r.photo_id || null, name: {}, role: {} }
        if (r._locale) {
          cur.name[r._locale] = r.name || ''
          cur.role[r._locale] = r.role || ''
        }
        byId.set(r.id, cur)
      }
      let speakers = [...byId.values()].sort((a, b) => a._order - b._order).filter((s) => nz(s.name.ru))
      if (!speakers.length) speakers = DEFAULT_SPEAKERS.map((s) => ({ ...s, photo: null }))
      data.speakers = speakers.map((s) => ({
        name: Object.fromEntries(LS.map((l) => [l, s.name[l] || s.name.ru])),
        role: Object.fromEntries(LS.map((l) => [l, s.role[l] || s.role.ru || ''])),
        ...(s.photo ? { photo: s.photo } : {}),
      }))
    }

    if (desc.slug === 'award') {
      const as = (await rows(`select id, deadline_date, form_open from award_settings limit 1`))[0]
      if (as?.deadline_date) data.deadlineDate = new Date(as.deadline_date).toISOString()
      if (as && as.form_open === false) data.formOpen = false
      const cl = await rows(`select _locale, form_closed_text from award_settings_locales`)
      data.formClosedText = perLang((l) => nz(cl.find((r) => r._locale === l)?.form_closed_text), (l) => RAW[l].aClosed || '')
      const nm = await rows(
        `select n.id, n._order, l._locale, l.title, l.hint from award_settings_nominations n
         left join award_settings_nominations_locales l on l._parent_id = n.id order by n._order`,
      )
      const byId = new Map<string, any>()
      for (const r of nm) {
        const cur = byId.get(r.id) || { _order: r._order, title: {}, kind: {} }
        if (r._locale) {
          cur.title[r._locale] = r.title || ''
          cur.kind[r._locale] = r.hint || ''
        }
        byId.set(r.id, cur)
      }
      let noms = [...byId.values()].sort((a, b) => a._order - b._order).filter((n) => nz(n.title.ru))
      if (!noms.length) noms = DEFAULT_NOMS
      data.nominationList = noms.map((n) => ({
        title: Object.fromEntries(LS.map((l) => [l, n.title[l] || n.title.ru])),
        kind: Object.fromEntries(LS.map((l) => [l, n.kind[l] || n.kind.ru || ''])),
      }))
    }

    await payload.updateGlobal({ slug: desc.slug as any, data: data as any, req, context: { skipRevalidate: true } })
    payload.logger.info(`[arch-makers] раздел ${desc.slug} заполнен`)
  }

  // ——— настройки сайта: почта, SEO, счётчики
  if (await empty('settings')) {
    const data: Record<string, any> = {}
    const m = (await rows(`select "to", subject_prefix, autoreply from mail limit 1`))[0]
    if (nz(m?.to)) data.mailTo = m.to
    if (nz(m?.subject_prefix)) data.subjectPrefix = m.subject_prefix
    if (m && m.autoreply === false) data.autoreply = false
    const ml = await rows(`select _locale, autoreply_subject, autoreply_body from mail_locales`)
    const brand = (v?: string) => (v ? v.split('Future Architecture').join('ARCH MAKERS') : v)
    const SUBJ: Record<L, string> = {
      ru: 'Заявка получена — ARCH MAKERS',
      ro: 'Cererea a fost primită — ARCH MAKERS',
      en: 'Application received — ARCH MAKERS',
    }
    const BODY: Record<L, string> = {
      ru: 'Здравствуйте!\n\nМы получили вашу заявку и вернёмся с ответом на этот адрес.\n\nARCH MAKERS — сообщество архитекторов и дизайнеров Молдовы.\nfuture-arch.md',
      ro: 'Bună ziua!\n\nAm primit cererea dumneavoastră și vă vom răspunde la această adresă.\n\nARCH MAKERS — comunitatea arhitecților și designerilor din Moldova.\nfuture-arch.md',
      en: 'Hello!\n\nWe have received your application and will reply to this address.\n\nARCH MAKERS — the community of architects and designers in Moldova.\nfuture-arch.md',
    }
    data.autoreplySubject = perLang((l) => brand(nz(ml.find((r) => r._locale === l)?.autoreply_subject)), (l) => SUBJ[l])
    data.autoreplyBody = perLang((l) => brand(nz(ml.find((r) => r._locale === l)?.autoreply_body)), (l) => BODY[l])

    const seo = (await rows(`select home_image_id, forum_image_id, award_image_id from seo limit 1`))[0] || {}
    const sl = await rows(`select * from seo_locales`)
    data.seo = {}
    for (const [k, path] of [
      ['home', '/'],
      ['forum', '/forum'],
      ['award', '/award'],
    ] as const) {
      data.seo[k] = {
        title: perLang((l) => nz(sl.find((r) => r._locale === l)?.[k + '_title']), (l) => SEO_COPY[path][l].title),
        description: perLang((l) => nz(sl.find((r) => r._locale === l)?.[k + '_description']), (l) => SEO_COPY[path][l].description),
        ...(seo[k + '_image_id'] ? { image: seo[k + '_image_id'] } : {}),
      }
    }

    const an = (await rows(`select * from analytics limit 1`))[0]
    if (an) {
      if (an.enabled === false) data.analyticsEnabled = false
      for (const [from, to] of [
        ['gtm_id', 'gtmId'],
        ['ga4_id', 'ga4Id'],
        ['search_console_token', 'searchConsoleToken'],
        ['yandex_id', 'yandexId'],
        ['meta_pixel_id', 'metaPixelId'],
      ])
        if (nz(an[from])) data[to] = an[from]
    }
    await payload.updateGlobal({ slug: 'settings' as any, data: data as any, req, context: { skipRevalidate: true } })
    payload.logger.info('[arch-makers] «Настройки сайта» заполнены')
  }
}

export async function down({ payload }: MigrateDownArgs): Promise<void> {
  // Старые таблицы не трогались — откатывать нечего.
  payload.logger.info('[arch-makers] откат данных не требуется')
}
