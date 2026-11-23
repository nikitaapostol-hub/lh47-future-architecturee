/* Заявки → Google Таблица «Заявки – Future Architecture».

   Сайт отправляет строку в скрипт, привязанный к таблице (Apps Script, веб-приложение).
   Скрипт дописывает её во вкладку раздела и пропускает заявки, которые уже есть
   (сверяет по ID в последней колонке), поэтому повторная отправка ничего не дублирует.

   Нужны переменные на Vercel:
   SHEETS_WEBHOOK_URL — адрес веб-приложения скрипта (…/exec)
   SHEETS_SECRET      — тот же секрет, что записан в скрипте
   Без них заявки по-прежнему сохраняются в админке и уходят письмом. */

import { ru } from '@/i18n/ru'
import { ro } from '@/i18n/ro'
import { en } from '@/i18n/en'

export type AppSlug = 'community-applications' | 'forum-applications' | 'award-applications'

/** Вкладка таблицы для каждой коллекции заявок. */
export const SHEET_OF: Record<AppSlug, string> = {
  'community-applications': 'Сообщество',
  'forum-applications': 'Форум',
  'award-applications': 'Премия',
}

const STATUS: Record<string, string> = {
  new: 'Новая',
  progress: 'В работе',
  accepted: 'Принята',
  declined: 'Отклонена',
}

const site = () => (process.env.NEXT_PUBLIC_SITE_URL || 'https://future-arch.md').replace(/\/$/, '')

/** Текст из формы в ячейку. Значения, которые таблица приняла бы за формулу
    (=, +, -, @ в начале — например, телефон +373…), записываются как текст. */
const cell = (v: unknown): string => {
  const t = v == null ? '' : String(v).trim()
  return /^[=+\-@]/.test(t) ? "'" + t : t
}

/** Телефон — всегда текстом: иначе таблица примет 060… за число и потеряет ноль. */
const tel = (v: unknown): string => {
  const t = v == null ? '' : String(v).trim()
  return t ? "'" + t : ''
}

const low = (v: unknown) => String(v || '').trim().toLowerCase()

/* Номинация в таблице всегда по-русски, на каком бы языке ни подали заявку, —
   иначе одна номинация считается тремя (Residential interior, Interiorul spațiului
   rezidențial…). Сверяем без регистра, диакритики и разницы в тире. */
const key = (v: unknown) =>
  String(v || '')
    .normalize('NFKD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[\u2012-\u2015\-]+/g, '-')
    .replace(/\s+/g, ' ')
    .trim()
    .toLowerCase()

export type NomMap = Map<string, string>

/** Словарь «название на любом языке → русское» из списка номинаций в админке и спецноминаций. */
export async function nominationMap(payload: any): Promise<NomMap> {
  const m: NomMap = new Map()
  const add = (t: any) => {
    const r = String(t?.ru || '').trim()
    if (r) for (const l of ['ru', 'ro', 'en']) if (t?.[l]) m.set(key(t[l]), r)
  }
  add({ ru: ru.aSpec1, ro: ro.aSpec1, en: en.aSpec1 })
  add({ ru: ru.aSpec2, ro: ro.aSpec2, en: en.aSpec2 })
  try {
    const g = await payload?.findGlobal?.({ slug: 'award', depth: 0 })
    for (const n of Array.isArray(g?.nominationList) ? g.nominationList : []) add(n?.title)
  } catch {
    /* без админки — только спецноминации */
  }
  return m
}

/** Строка таблицы: Дата · Статус · Ответственный · Комментарий команды · поля заявки ·
    Язык · Страница · UTM · Админка · ID. Порядок колонок совпадает с шапкой вкладки. */
export function rowOf(slug: AppSlug, d: any, noms?: NomMap): (string | number)[] {
  const head = [
    String(d?.submittedAt || d?.createdAt || new Date().toISOString()),
    STATUS[String(d?.status || 'new')] || 'Новая',
    '',
    cell(d?.note),
  ]
  let body: string[]
  if (slug === 'community-applications') {
    body = [
      /партн/.test(low(d.track)) ? 'Партнёр' : 'Резидент',
      d.name, tel(d.phone), d.email, d.role, d.employment, d.company, d.field, d.website,
    ].map((v, i) => (i === 2 ? v : cell(v)))
  } else if (slug === 'forum-applications') {
    body = [/партн/.test(low(d.kind)) ? 'Партнёр' : 'Участник', d.name, tel(d.phone), d.email, d.company, d.role].map((v, i) => (i === 2 ? v : cell(v)))
  } else {
    body = [
      /студ/.test(low(d.track)) ? 'Студенческий конкурс' : 'Премия',
      (d.nomination && noms?.get(key(d.nomination))) || d.nomination, d.project, d.name, d.org, tel(d.phone), d.email, d.faculty, d.studyStart,
      d.location, d.area, d.year, d.desc, d.files, d.url,
    ].map((v, i) => (i === 5 ? v : cell(v)))
  }
  const admin = `${site()}/admin/collections/${slug}/${d.id}`
  const tail = [
    d?.lang ? String(d.lang).toUpperCase() : '',
    cell(d?.source),
    cell(d?.utm),
    `=HYPERLINK("${admin}";"Открыть")`,
    d.id,
  ]
  return [...head, ...body, ...tail]
}

export type PushResult = { ok: boolean; added?: number; skipped?: number; error?: string }

export const sheetsConfigured = () => Boolean(process.env.SHEETS_WEBHOOK_URL && process.env.SHEETS_SECRET)

/** Отправить строки в одну вкладку. Не бросает ошибок — возвращает результат. */
export async function pushRows(sheet: string, rows: (string | number)[][]): Promise<PushResult> {
  const url = process.env.SHEETS_WEBHOOK_URL
  const secret = process.env.SHEETS_SECRET
  if (!url || !secret) return { ok: false, error: 'SHEETS_WEBHOOK_URL / SHEETS_SECRET не заданы' }
  if (!rows.length) return { ok: true, added: 0, skipped: 0 }
  try {
    // text/plain — Apps Script принимает тело как есть; ответ приходит после редиректа Google
    const res = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'text/plain;charset=utf-8' },
      body: JSON.stringify({ secret, sheet, rows }),
      redirect: 'follow',
      signal: AbortSignal.timeout(20000),
    })
    const text = await res.text()
    try {
      return JSON.parse(text) as PushResult
    } catch {
      return { ok: false, error: `HTTP ${res.status}: ${text.slice(0, 200)}` }
    }
  } catch (e) {
    return { ok: false, error: (e as Error).message }
  }
}

/** Хук коллекции: новая заявка сразу уходит в таблицу. Ошибка не мешает сохранению заявки. */
export const toSheet =
  (slug: AppSlug) =>
  async ({ doc, operation, req }: any) => {
    if (operation !== 'create' || !sheetsConfigured()) return doc
    const noms = slug === 'award-applications' ? await nominationMap(req?.payload) : undefined
    const r = await pushRows(SHEET_OF[slug], [rowOf(slug, doc, noms)])
    if (!r.ok) req?.payload?.logger?.error?.(`Google Таблица: заявка ${slug}/${doc?.id} не записана — ${r.error}`)
    return doc
  }
