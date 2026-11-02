/* Перенос заявок из админки в Google Таблицу.

   GET /api/sheets-sync — только для вошедших в админку. Отправляет все заявки
   трёх разделов; те, что уже есть в таблице (по ID), скрипт пропускает,
   поэтому ссылку можно открывать сколько угодно раз — дублей не будет.
   Статус и заметка из админки переносятся в «Статус» и «Комментарий команды». */
import { getPayload } from 'payload'
import config from '@payload-config'
import { NextResponse } from 'next/server'
import { SHEET_OF, pushRows, rowOf, sheetsConfigured } from '@/lib/sheets'
import type { AppSlug } from '@/lib/sheets'

export const maxDuration = 60

const esc = (s: string) => s.replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' })[c] as string)

export async function GET(request: Request): Promise<Response> {
  const url = new URL(request.url)
  const payload = await getPayload({ config })
  const { user } = await payload.auth({ headers: request.headers })
  if (!user) {
    return NextResponse.redirect(new URL('/admin/login?redirect=' + encodeURIComponent(url.pathname), url.origin))
  }

  const lines: string[] = []
  if (!sheetsConfigured()) {
    lines.push('Таблица ещё не подключена: на Vercel нет SHEETS_WEBHOOK_URL и SHEETS_SECRET.')
  } else {
    for (const slug of Object.keys(SHEET_OF) as AppSlug[]) {
      const sheet = SHEET_OF[slug]
      const { docs } = await payload.find({
        collection: slug,
        limit: 2000,
        depth: 0,
        sort: 'createdAt',
        overrideAccess: true,
        pagination: false,
      })
      const rows = docs.map((d: any) => rowOf(slug, d))
      let added = 0
      let skipped = 0
      let error = ''
      for (let i = 0; i < rows.length && !error; i += 100) {
        const r = await pushRows(sheet, rows.slice(i, i + 100))
        if (!r.ok) error = r.error || 'ошибка'
        added += r.added || 0
        skipped += r.skipped || 0
      }
      lines.push(
        `${sheet}: в админке ${rows.length}, добавлено ${added}, уже были в таблице ${skipped}` + (error ? ` — ошибка: ${error}` : ''),
      )
    }
  }

  const html = `<!doctype html><meta charset="utf-8"><meta name="robots" content="noindex"><title>Заявки → Google Таблица</title>
<body style="font:16px/1.6 system-ui,sans-serif;max-width:640px;margin:48px auto;padding:0 20px">
<h1 style="font-size:22px">Заявки → Google Таблица</h1>
<ul>${lines.map((l) => `<li>${esc(l)}</li>`).join('')}</ul>
<p><a href="/admin">← В админку</a></p></body>`
  return new Response(html, { headers: { 'Content-Type': 'text/html; charset=utf-8', 'Cache-Control': 'no-store' } })
}
