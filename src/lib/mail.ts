/* Письма по заявкам: уведомление команде и автоответ заявителю.
   Вёрстка в стиле сайта: белый лист, четыре цвета знака сверху, крупный
   заголовок, данные заявки таблицей, кнопки «Позвонить / Написать».
   Почтовики понимают только таблицы и инлайновые стили, шрифт — Arial;
   логотип — PNG с сайта (SVG Gmail не показывает).
   Отправка никогда не должна ронять форму — все ошибки гасятся и логируются. */
import type { Payload } from 'payload'

export type MailRow = { label: string; value?: string | null }
export type Section = 'home' | 'forum' | 'award'
type Lang = 'ru' | 'ro' | 'en'

const SITE = (process.env.NEXT_PUBLIC_SITE_URL || 'https://future-arch.md').replace(/\/$/, '')
const LOGO = 'https://future-arch.md/email/logo.png'
const MARK = 'https://future-arch.md/email/mark.png'

const INK = '#16181D'
const MUTED = '#6E7278'
const LINE = '#E6E6E3'
const PAPER = '#F3F3F1'
const FONT = 'Arial,Helvetica,sans-serif'

/** Цвет раздела — как на сайте: сообщество синее, форум оранжевый, премия жёлтая. */
const ACCENT: Record<Section, { bg: string; ink: string }> = {
  home: { bg: '#1A52A0', ink: '#FFFFFF' },
  forum: { bg: '#E8461E', ink: '#FFFFFF' },
  award: { bg: '#E5D900', ink: '#000000' },
}

function esc(s: string) {
  return s.replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' })[c] as string)
}
const filled = (rows: MailRow[]) => rows.filter((r) => r.value != null && String(r.value).trim() !== '')
const telHref = (s: string) => 'tel:' + s.replace(/[^\d+]/g, '')

/** Значение в таблице: ссылки кликабельны, многострочное — с переносами. */
function cell(v: string) {
  const s = v.trim()
  if (/^https?:\/\/\S+$/.test(s)) return `<a href="${esc(s)}" style="color:${INK};text-decoration:underline">${esc(s.replace(/^https?:\/\//, ''))}</a>`
  // список файлов «имя — ссылка»: ссылку прячем под имя файла
  if (/ — https?:\/\//.test(s))
    return s
      .split('\n')
      .map((line) => {
        const m = line.match(/^(.*) — (https?:\/\/\S+)$/)
        return m ? `<a href="${esc(m[2])}" style="color:${INK};text-decoration:underline">${esc(m[1])}</a>` : esc(line)
      })
      .join('<br>')
  return esc(s).replace(/\n/g, '<br>')
}

/** Общий «лист»: полоса из четырёх цветов, логотип, содержимое, подвал. */
function frame(opts: { lang: Lang; preheader: string; body: string; footer: string }) {
  const stripe = ['#E5D900', '#1A52A0', '#E8461E', '#3C3F44']
    .map((c) => `<td width="25%" height="6" style="height:6px;line-height:6px;font-size:0;background:${c}">&nbsp;</td>`)
    .join('')
  return `<!doctype html>
<html lang="${opts.lang}"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<meta name="color-scheme" content="light only"><meta name="supported-color-schemes" content="light only">
<title>Future Architecture</title></head>
<body style="margin:0;padding:0;background:${PAPER};-webkit-text-size-adjust:100%">
<div style="display:none;max-height:0;overflow:hidden;opacity:0;color:${PAPER}">${esc(opts.preheader)}&#8199;&#65279;&#847;&#8199;&#65279;&#847;</div>
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="background:${PAPER}">
<tr><td align="center" style="padding:28px 12px">
  <table role="presentation" width="600" cellpadding="0" cellspacing="0" border="0" style="width:100%;max-width:600px;background:#FFFFFF;border:1px solid ${LINE}">
    <tr><td style="padding:0"><table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0"><tr>${stripe}</tr></table></td></tr>
    <tr><td style="padding:26px 32px 22px;border-bottom:1px solid ${LINE}">
      <a href="${SITE}" style="text-decoration:none"><img src="${LOGO}" width="176" height="44" alt="Future Architecture" style="display:block;border:0;width:176px;height:44px"></a>
    </td></tr>
    ${opts.body}
    <tr><td style="padding:22px 32px;background:#16181D">
      <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0"><tr>
        <td valign="middle" width="40"><img src="${MARK}" width="28" height="28" alt="" style="display:block;border:0;width:28px;height:28px;border-radius:4px"></td>
        <td valign="middle" style="font:13px/1.5 ${FONT};color:#C9C9C5">${opts.footer}</td>
      </tr></table>
    </td></tr>
  </table>
</td></tr></table>
</body></html>`
}

/** Кнопка, которая одинаково выглядит в Gmail, Outlook и Apple Mail. */
function button(href: string, label: string, dark = true) {
  const bg = dark ? '#000000' : '#FFFFFF'
  const fg = dark ? '#FFFFFF' : '#000000'
  return `<a href="${esc(href)}" style="display:inline-block;margin:0 6px 8px 0;padding:12px 18px;background:${bg};color:${fg};border:1px solid #000;font:bold 14px/1 ${FONT};text-decoration:none;white-space:nowrap">${esc(label)}</a>`
}

export type NotifyMail = {
  section: Section
  /** «Форум — участник», «Премия: Архитектура частного дома» */
  kind: string
  name?: string
  phone?: string
  email?: string
  rows: MailRow[]
  meta: MailRow[]
  adminUrl: string
  when?: string
}

/** Письмо команде о новой заявке. */
export function notifyHtml(m: NotifyMail) {
  const a = ACCENT[m.section]
  const contacts = [
    m.phone ? button(telHref(m.phone), 'Позвонить') : '',
    m.email ? button(`mailto:${m.email}`, 'Написать') : '',
    button(m.adminUrl, 'Открыть в админке', false),
  ].join('')

  const table = filled(m.rows)
    .map(
      (r) => `<tr>
        <td valign="top" style="padding:11px 16px 11px 0;border-top:1px solid ${LINE};width:36%;font:bold 11px/1.5 ${FONT};letter-spacing:.08em;text-transform:uppercase;color:${MUTED}">${esc(r.label)}</td>
        <td valign="top" style="padding:11px 0;border-top:1px solid ${LINE};font:15px/1.5 ${FONT};color:${INK}">${cell(String(r.value))}</td>
      </tr>`,
    )
    .join('')

  const meta = filled(m.meta)
    .map((r) => `${esc(r.label)}: ${cell(String(r.value))}`)
    .join(' &nbsp;·&nbsp; ')

  const body = `
    <tr><td style="padding:28px 32px 6px">
      <span style="display:inline-block;padding:6px 10px;background:${a.bg};color:${a.ink};font:bold 11px/1 ${FONT};letter-spacing:.12em;text-transform:uppercase">Новая заявка</span>
      <div style="margin-top:14px;font:bold 26px/1.15 ${FONT};color:${INK};letter-spacing:-.01em">${esc(m.kind)}</div>
      ${m.name ? `<div style="margin-top:8px;font:18px/1.4 ${FONT};color:${INK}">${esc(m.name)}</div>` : ''}
      ${m.phone || m.email ? `<div style="margin-top:4px;font:15px/1.5 ${FONT};color:${MUTED}">${[m.phone ? `<a href="${telHref(m.phone)}" style="color:${MUTED};text-decoration:none">${esc(m.phone)}</a>` : '', m.email ? `<a href="mailto:${esc(m.email)}" style="color:${MUTED};text-decoration:none">${esc(m.email)}</a>` : ''].filter(Boolean).join(' &nbsp;·&nbsp; ')}</div>` : ''}
    </td></tr>
    <tr><td style="padding:18px 32px 10px">
      ${contacts}
    </td></tr>
    <tr><td style="padding:8px 32px 26px">
      <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">${table}</table>
      ${meta || m.when ? `<div style="margin-top:16px;font:12px/1.6 ${FONT};color:${MUTED}">${[m.when ? esc(m.when) : '', meta].filter(Boolean).join(' &nbsp;·&nbsp; ')}</div>` : ''}
    </td></tr>`

  return frame({
    lang: 'ru',
    preheader: [m.name, m.phone, m.email].filter(Boolean).join(' · '),
    body,
    footer: `Заявка с сайта <a href="${SITE}" style="color:#FFFFFF;text-decoration:none">future-arch.md</a>. Ответ на это письмо уйдёт заявителю.`,
  })
}

/** То же уведомление простым текстом — для почтовиков без HTML. */
export function notifyText(m: NotifyMail) {
  const lines = [
    `Новая заявка — ${m.kind}`,
    m.name || '',
    [m.phone, m.email].filter(Boolean).join(' · '),
    '',
    ...filled(m.rows).map((r) => `${r.label}: ${String(r.value).trim()}`),
    '',
    ...filled(m.meta).map((r) => `${r.label}: ${String(r.value).trim()}`),
    `Админка: ${m.adminUrl}`,
  ]
  return lines.filter((l, i, a) => !(l === '' && a[i - 1] === '')).join('\n').trim()
}

const AUTO: Record<Lang, { kicker: string; site: string; footer: string }> = {
  ru: { kicker: 'Заявка получена', site: 'Перейти на сайт', footer: 'сообщество архитекторов и дизайнеров Молдовы' },
  ro: { kicker: 'Cerere primită', site: 'Accesați site-ul', footer: 'comunitatea arhitecților și designerilor din Moldova' },
  en: { kicker: 'Application received', site: 'Visit the website', footer: 'community of architects and designers in Moldova' },
}

/** Автоответ заявителю. Текст — из админки («Настройки сайта → Почта»):
    первый короткий абзац («Здравствуйте!») становится заголовком, подпись
    с адресом сайта не дублируется — она уже есть в подвале письма. */
export function autoreplyHtml(opts: { lang?: string; text: string; section?: Section }) {
  const lang: Lang = opts.lang === 'ro' || opts.lang === 'en' ? opts.lang : 'ru'
  const t = AUTO[lang]
  const a = ACCENT[opts.section || 'home']
  const href = SITE + (lang === 'ru' ? '/' : '/' + lang)
  let parts = opts.text
    .split(/\n\s*\n/)
    .map((p) => p.trim())
    .filter(Boolean)
  let title = ''
  if (parts.length > 1 && parts[0].length <= 40 && !parts[0].includes('\n')) title = parts.shift() as string
  if (parts.length > 1 && /future-arch\.md\s*$/i.test(parts[parts.length - 1])) parts = parts.slice(0, -1)
  const paragraphs = parts
    .map((p) => `<p style="margin:0 0 14px;font:17px/1.6 ${FONT};color:${INK}">${esc(p).replace(/\n/g, '<br>')}</p>`)
    .join('')
  const body = `
    <tr><td style="padding:30px 32px 8px">
      <span style="display:inline-block;padding:6px 10px;background:${a.bg};color:${a.ink};font:bold 11px/1 ${FONT};letter-spacing:.12em;text-transform:uppercase">${esc(t.kicker)}</span>
      ${title ? `<div style="margin-top:14px;font:bold 26px/1.15 ${FONT};color:${INK};letter-spacing:-.01em">${esc(title)}</div>` : ''}
    </td></tr>
    <tr><td style="padding:16px 32px 10px">${paragraphs}</td></tr>
    <tr><td style="padding:0 32px 30px">
      ${button(href, t.site)}
    </td></tr>`
  return frame({
    lang,
    preheader: opts.text.split(/\n/).map((s) => s.trim()).filter(Boolean).slice(0, 2).join(' '),
    body,
    footer: `Future Architecture — ${esc(t.footer)}<br><a href="mailto:info@future-arch.md" style="color:#FFFFFF;text-decoration:none">info@future-arch.md</a> &nbsp;·&nbsp; <a href="${href}" style="color:#FFFFFF;text-decoration:none">future-arch.md</a>`,
  })
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
