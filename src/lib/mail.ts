/* Письма по заявкам: уведомление команде и автоответ заявителю.
   Минималистичная вёрстка: белый лист, логотип, метка с цветом раздела,
   заголовок, данные заявки таблицей, ссылка в админку.
   Почтовики понимают только таблицы и инлайновые стили, шрифт — Arial;
   логотип — PNG с сайта (SVG Gmail не показывает).
   Отправка никогда не должна ронять форму — все ошибки гасятся и логируются. */
import type { Payload } from 'payload'

export type MailRow = { label: string; value?: string | null }
export type Section = 'home' | 'forum' | 'award'
type Lang = 'ru' | 'ro' | 'en'

const SITE = (process.env.NEXT_PUBLIC_SITE_URL || 'https://future-arch.md').replace(/\/$/, '')
const LOGO = 'https://future-arch.md/email/logo.png'

const INK = '#16181D'
const MUTED = '#6E7278'
const LINE = '#E6E6E3'
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

/** Общий «лист»: белое поле, логотип, содержимое, тонкая строка подвала. */
function frame(opts: { lang: Lang; preheader: string; body: string; footer: string }) {
  return `<!doctype html>
<html lang="${opts.lang}"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<meta name="color-scheme" content="light only"><meta name="supported-color-schemes" content="light only">
<title>Future Architecture</title></head>
<body style="margin:0;padding:0;background:#FFFFFF;-webkit-text-size-adjust:100%">
<div style="display:none;max-height:0;overflow:hidden;opacity:0;color:#FFFFFF">${esc(opts.preheader)}&#8199;&#65279;&#847;&#8199;&#65279;&#847;</div>
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="background:#FFFFFF">
<tr><td align="center" style="padding:40px 24px">
  <table role="presentation" width="520" cellpadding="0" cellspacing="0" border="0" style="width:100%;max-width:520px">
    <tr><td style="padding:0 0 40px">
      <a href="${SITE}" style="text-decoration:none"><img src="${LOGO}" width="139" height="34" alt="Future Architecture" style="display:block;border:0;width:139px;height:34px"></a>
    </td></tr>
    ${opts.body}
    <tr><td style="padding:40px 0 0;font:12px/1.6 ${FONT};color:${MUTED}">${opts.footer}</td></tr>
  </table>
</td></tr></table>
</body></html>`
}

/** Короткая метка над заголовком: цветной квадрат раздела и подпись. */
function label(section: Section, text: string) {
  return `<table role="presentation" cellpadding="0" cellspacing="0" border="0"><tr>
    <td width="8" height="8" style="width:8px;height:8px;line-height:8px;font-size:0;background:${ACCENT[section].bg}">&nbsp;</td>
    <td style="padding-left:10px;font:12px/1 ${FONT};letter-spacing:.06em;text-transform:uppercase;color:${MUTED}">${esc(text)}</td>
  </tr></table>`
}

const link = (href: string, text: string, color = INK) =>
  `<a href="${esc(href)}" style="color:${color};text-decoration:none;border-bottom:1px solid ${LINE}">${esc(text)}</a>`

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
  const contacts = [m.phone ? link(telHref(m.phone), m.phone) : '', m.email ? link(`mailto:${m.email}`, m.email) : '']
    .filter(Boolean)
    .join(' &nbsp;&nbsp; ')

  const table = filled(m.rows)
    .map(
      (r) => `<tr>
        <td valign="top" style="padding:10px 16px 10px 0;border-top:1px solid ${LINE};width:38%;font:14px/1.5 ${FONT};color:${MUTED}">${esc(r.label)}</td>
        <td valign="top" style="padding:10px 0;border-top:1px solid ${LINE};font:14px/1.5 ${FONT};color:${INK}">${cell(String(r.value))}</td>
      </tr>`,
    )
    .join('')

  const meta = [m.when ? esc(m.when) : '', ...filled(m.meta).map((r) => `${esc(r.label)}: ${cell(String(r.value))}`)]
    .filter(Boolean)
    .join(' · ')

  const body = `
    <tr><td>
      ${label(m.section, 'Новая заявка')}
      <div style="margin-top:14px;font:bold 24px/1.2 ${FONT};color:${INK};letter-spacing:-.01em">${esc(m.kind)}</div>
      ${m.name ? `<div style="margin-top:20px;font:17px/1.4 ${FONT};color:${INK}">${esc(m.name)}</div>` : ''}
      ${contacts ? `<div style="margin-top:6px;font:15px/1.6 ${FONT};color:${INK}">${contacts}</div>` : ''}
    </td></tr>
    ${table ? `<tr><td style="padding-top:28px"><table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">${table}</table></td></tr>` : ''}
    <tr><td style="padding-top:28px;font:bold 14px/1 ${FONT}">${link(m.adminUrl, 'Открыть в админке →')}</td></tr>
    ${meta ? `<tr><td style="padding-top:28px;font:12px/1.6 ${FONT};color:${MUTED}">${meta}</td></tr>` : ''}`

  return frame({
    lang: 'ru',
    preheader: [m.name, m.phone, m.email].filter(Boolean).join(' · '),
    body,
    footer: 'Ответ на это письмо уйдёт заявителю.',
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

const AUTO: Record<Lang, { kicker: string; footer: string }> = {
  ru: { kicker: 'Заявка получена', footer: 'сообщество архитекторов и дизайнеров Молдовы' },
  ro: { kicker: 'Cerere primită', footer: 'comunitatea arhitecților și designerilor din Moldova' },
  en: { kicker: 'Application received', footer: 'community of architects and designers in Moldova' },
}

/** Автоответ заявителю. Текст — из админки («Настройки сайта → Почта»):
    первый короткий абзац («Здравствуйте!») становится заголовком, подпись
    с адресом сайта не дублируется — она уже есть в подвале письма. */
export function autoreplyHtml(opts: { lang?: string; text: string; section?: Section }) {
  const lang: Lang = opts.lang === 'ro' || opts.lang === 'en' ? opts.lang : 'ru'
  const t = AUTO[lang]
  const href = SITE + (lang === 'ru' ? '/' : '/' + lang)
  let parts = opts.text
    .split(/\n\s*\n/)
    .map((p) => p.trim())
    .filter(Boolean)
  let title = ''
  if (parts.length > 1 && parts[0].length <= 40 && !parts[0].includes('\n')) title = parts.shift() as string
  if (parts.length > 1 && /future-arch\.md\s*$/i.test(parts[parts.length - 1])) parts = parts.slice(0, -1)
  const paragraphs = parts
    .map((p) => `<p style="margin:0 0 12px;font:16px/1.6 ${FONT};color:${INK}">${esc(p).replace(/\n/g, '<br>')}</p>`)
    .join('')
  const body = `
    <tr><td>
      ${label(opts.section || 'home', t.kicker)}
      ${title ? `<div style="margin-top:14px;font:bold 24px/1.2 ${FONT};color:${INK};letter-spacing:-.01em">${esc(title)}</div>` : ''}
    </td></tr>
    <tr><td style="padding-top:18px">${paragraphs}</td></tr>`
  return frame({
    lang,
    preheader: opts.text.split(/\n/).map((s) => s.trim()).filter(Boolean).slice(0, 2).join(' '),
    body,
    footer: `Future Architecture — ${esc(t.footer)}<br>${link(href, 'future-arch.md', MUTED)} &nbsp;·&nbsp; ${link('mailto:info@future-arch.md', 'info@future-arch.md', MUTED)}`,
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
