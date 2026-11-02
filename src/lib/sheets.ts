/* Заявки → Google Таблица «Заявки – Future Architecture».

   Сайт отправляет строку в скрипт, привязанный к таблице (Apps Script, веб-приложение).
   Скрипт дописывает её во вкладку раздела и пропускает заявки, которые уже есть
   (сверяет по ID в последней колонке), поэтому повторная отправка ничего не дублирует.

   Нужны переменные на Vercel:
   SHEETS_WEBHOOK_URL — адрес веб-приложения скрипта (…/exec)
   SHEETS_SECRET      — тот же секрет, что записан в скрипте
   Без них заявки по-прежнему сохраняются в админке и уходят письмом. */

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

/** Строка таблицы: Дата · Статус · Ответственный · Комментарий команды · поля заявки ·
    Язык · Страница · UTM · Админка · ID. Порядок колонок совпадает с шапкой вкладки. */
export function rowOf(slug: AppSlug, d: any): (string | number)[] {
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
      d.nomination, d.project, d.name, d.org, tel(d.phone), d.email, d.faculty, d.studyStart,
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
    const r = await pushRows(SHEET_OF[slug], [rowOf(slug, doc)])
    if (!r.ok) req?.payload?.logger?.error?.(`Google Таблица: заявка ${slug}/${doc?.id} не записана — ${r.error}`)
    return doc
  }
