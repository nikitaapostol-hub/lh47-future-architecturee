/* Письма по заявкам: уведомление команде и автоответ заявителю.
   Отправка никогда не должна ронять форму — все ошибки гасятся и логируются. */
import type { Payload } from 'payload'

export type MailRow = { label: string; value?: string | null }

const BRAND = '#FF4002'
const INK = '#16181D'

function esc(s: string) {
  return s.replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' })[c] as string)
}

/** Таблица «поле — значение» в письме команде. */
export function notifyHtml(title: string, rows: MailRow[], footer?: string) {
  const body = rows
    .filter((r) => r.value != null && String(r.value).trim() !== '')
    .map(
      (r) => `
      <tr>
        <td style="padding:10px 0;border-bottom:1px solid #E6E3DD;font:12px/1.4 -apple-system,Segoe UI,Roboto,sans-serif;letter-spacing:.06em;text-transform:uppercase;color:#6E7278;white-space:nowrap;vertical-align:top;width:38%">${esc(r.label)}</td>
        <td style="padding:10px 0 10px 16px;border-bottom:1px solid #E6E3DD;font:15px/1.5 -apple-system,Segoe UI,Roboto,sans-serif;color:${INK}">${esc(String(r.value)).replace(/\n/g, '<br>')}</td>
      </tr>`,
    )
    .join('')

  return `<!doctype html><html><body style="margin:0;background:#F7F6F3;padding:32px 16px">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:620px;margin:0 auto;background:#FFFFFF;border:1px solid #E6E3DD">
    <tr><td style="padding:24px 28px;border-bottom:3px solid ${BRAND}">
      <div style="font:11px/1 -apple-system,Segoe UI,Roboto,sans-serif;letter-spacing:.18em;text-transform:uppercase;color:#6E7278">Future Architecture</div>
      <div style="margin-top:10px;font:700 22px/1.25 -apple-system,Segoe UI,Roboto,sans-serif;color:${INK}">${esc(title)}</div>
    </td></tr>
    <tr><td style="padding:8px 28px 24px">
      <table role="presentation" width="100%" cellpadding="0" cellspacing="0">${body}</table>
    </td></tr>
    ${footer ? `<tr><td style="padding:0 28px 24px;font:12px/1.6 -apple-system,Segoe UI,Roboto,sans-serif;color:#6E7278">${esc(footer)}</td></tr>` : ''}
  </table></body></html>`
}

/** Автоответ заявителю — тот же бланк, только текстом. */
export function autoreplyHtml(text: string) {
  const paragraphs = text
    .split(/\n\s*\n/)
    .map((p) => `<p style="margin:0 0 14px;font:15px/1.6 -apple-system,Segoe UI,Roboto,sans-serif;color:${INK}">${esc(p).replace(/\n/g, '<br>')}</p>`)
    .join('')
  return `<!doctype html><html><body style="margin:0;background:#F7F6F3;padding:32px 16px">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:620px;margin:0 auto;background:#FFFFFF;border:1px solid #E6E3DD">
    <tr><td style="padding:24px 28px;border-bottom:3px solid ${BRAND}">
      <div style="font:11px/1 -apple-system,Segoe UI,Roboto,sans-serif;letter-spacing:.18em;text-transform:uppercase;color:#6E7278">Future Architecture</div>
    </td></tr>
    <tr><td style="padding:24px 28px">${paragraphs}</td></tr>
  </table></body></html>`
}

export async function sendSafe(
  payload: Payload,
  args: { to: string; subject: string; html: string; replyTo?: string },
) {
  try {
    await payload.sendEmail({
      to: args.to,
      subject: args.subject,
      html: args.html,
      ...(args.replyTo ? { replyTo: args.replyTo } : {}),
    } as any)
  } catch (e) {
    payload.logger.error({ msg: '[mail] не удалось отправить письмо', err: (e as Error).message })
  }
}
