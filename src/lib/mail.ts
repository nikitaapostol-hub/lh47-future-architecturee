/* Письма по заявкам: уведомление команде и автоответ заявителю.
   Уведомление — простой список «Поле: значение», как в письмах с lh47arch.com.
   Отправка никогда не должна ронять форму — все ошибки гасятся и логируются. */
import type { Payload } from 'payload'

export type MailRow = { label: string; value?: string | null }

const SITE = (process.env.NEXT_PUBLIC_SITE_URL || 'https://future-arch.md').replace(/\/$/, '')
const FONT = "font-family:Arial,Helvetica,sans-serif"

function esc(s: string) {
  return s.replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' })[c] as string)
}

const filled = (rows: MailRow[]) => rows.filter((r) => r.value != null && String(r.value).trim() !== '')

/** Строка значения: почта и телефон — ссылками, многострочное — с переносами. */
function value(label: string, v: string) {
  const s = v.trim()
  if (/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(s)) return `<a href="mailto:${esc(s)}">${esc(s)}</a>`
  if (/телефон/i.test(label) && /^[+\d][\d\s()\-]{6,}$/.test(s)) return `<a href="tel:${esc(s.replace(/[^\d+]/g, ''))}">${esc(s)}</a>`
  if (/^https?:\/\//.test(s) && !s.includes('\n')) return `<a href="${esc(s)}">${esc(s)}</a>`
  return esc(s).replace(/\n/g, '<br>')
}

/** Письмо команде. */
export function notifyHtml(rows: MailRow[], adminUrl: string) {
  const lines = filled(rows)
    .map((r) => `<div style="margin:0 0 4px">${esc(r.label)}: ${value(r.label, String(r.value))}</div>`)
    .join('')
  return `<!doctype html><html><body style="margin:0;padding:16px;${FONT};font-size:15px;line-height:1.5;color:#222">
${lines}
<div style="margin:12px 0 4px;color:#888">--</div>
<div style="color:#888;font-size:13px">Это уведомление о том, что на сайте Future Architecture (<a href="${SITE}" style="color:#888">${SITE.replace(/^https?:\/\//, '')}</a>) отправлена заявка.<br>Заявка сохранена в админке: <a href="${adminUrl}" style="color:#888">открыть</a>.</div>
</body></html>`
}

/** То же письмо простым текстом — для почтовиков без HTML. */
export function notifyText(rows: MailRow[], adminUrl: string) {
  return (
    filled(rows)
      .map((r) => `${r.label}: ${String(r.value).trim()}`)
      .join('\n') +
    `\n--\nЭто уведомление о том, что на сайте Future Architecture (${SITE}) отправлена заявка.\nЗаявка в админке: ${adminUrl}`
  )
}

/** Автоответ заявителю — обычный текст по абзацам. */
export function autoreplyHtml(text: string) {
  const paragraphs = text
    .split(/\n\s*\n/)
    .map((p) => `<p style="margin:0 0 14px">${esc(p).replace(/\n/g, '<br>')}</p>`)
    .join('')
  return `<!doctype html><html><body style="margin:0;padding:16px;${FONT};font-size:15px;line-height:1.6;color:#222">${paragraphs}</body></html>`
}

export async function sendSafe(
  payload: Payload,
  args: { to: string; subject: string; html: string; text?: string; replyTo?: string },
) {
  try {
    await payload.sendEmail({
      to: args.to,
      subject: args.subject,
      html: args.html,
      ...(args.text ? { text: args.text } : {}),
      ...(args.replyTo ? { replyTo: args.replyTo } : {}),
    } as any)
  } catch (e) {
    payload.logger.error({ msg: '[mail] не удалось отправить письмо', err: (e as Error).message })
  }
}
