/* Отправка форм. Кроме полей формы уходит контекст: язык, страница и utm —
   по ним видно, откуда пришла заявка. После успешной отправки — переход
   на страницу «Спасибо» (/thanks), там уходит событие form_success в dataLayer
   (GTM → GA4 generate_lead). */
import { path } from '@/i18n/links'
import type { Lang } from '@/i18n/links'

/** Какая форма отправлена — значение параметра form_name в GA4. */
export type FormName =
  | 'community_resident'
  | 'community_partner'
  | 'forum_guest'
  | 'forum_partner'
  | 'award_nomination'
  | 'award_student'

export const LEAD_KEY = 'fa-lead'

/* ——— Проверка формы перед отправкой ———
   Браузер сам проверяет required и формат почты; дополнительно ловим поля
   из одних пробелов и номер телефона без цифр. Те же правила — на сервере. */

const MSG: Record<Lang, { empty: string; phone: string; email: string }> = {
  ru: { empty: 'Заполните это поле', phone: 'Проверьте номер телефона: нужно от 8 цифр', email: 'Проверьте адрес почты' },
  ro: { empty: 'Completați acest câmp', phone: 'Verificați numărul de telefon: minimum 8 cifre', email: 'Verificați adresa de e-mail' },
  en: { empty: 'Please fill in this field', phone: 'Check the phone number: at least 8 digits', email: 'Check the email address' },
}

const EMAIL_OK = /^[^@\s]+@[^@\s]+\.[^@\s]{2,}$/
export function phoneOk(v: string) {
  const digits = v.replace(/\D/g, '').length
  return /^\+?[\d\s().-]{7,20}$/.test(v.trim()) && digits >= 8 && digits <= 15
}

/** true — можно отправлять; иначе браузер покажет подсказку у первого неверного поля. */
export function checkForm(form: HTMLFormElement, lang: Lang): boolean {
  const m = MSG[lang] || MSG.ru
  if (!form.dataset.watch) {
    form.dataset.watch = '1'
    form.addEventListener('input', (e) => (e.target as HTMLInputElement).setCustomValidity?.(''))
  }
  for (const el of Array.from(form.elements) as HTMLInputElement[]) {
    if (!el.name || el.name === 'hp' || !('setCustomValidity' in el) || el.type === 'file') continue
    const v = String(el.value || '')
    let msg = ''
    if (el.required && !v.trim()) msg = m.empty
    else if (el.type === 'tel' && v.trim() && !phoneOk(v)) msg = m.phone
    else if (el.type === 'email' && v.trim() && !EMAIL_OK.test(v.trim())) msg = m.email
    el.setCustomValidity(msg)
  }
  return form.reportValidity()
}

/** Значение невидимого поля-ловушки для ботов. */
export const hpValue = (form: HTMLFormElement) => String((form.elements.namedItem('hp') as HTMLInputElement | null)?.value || '')

function utm() {
  if (typeof window === 'undefined') return ''
  const q = new URLSearchParams(window.location.search)
  const keys = ['utm_source', 'utm_medium', 'utm_campaign', 'utm_content', 'utm_term', 'gclid', 'fbclid']
  const found = keys.filter((k) => q.get(k)).map((k) => k + '=' + q.get(k))
  if (found.length) {
    try { sessionStorage.setItem('fa-utm', found.join('&')) } catch {}
    return found.join('&')
  }
  try { return sessionStorage.getItem('fa-utm') || '' } catch { return '' }
}

export function track(event: string, params: Record<string, unknown> = {}) {
  if (typeof window === 'undefined') return
  const w = window as any
  try {
    w.dataLayer = w.dataLayer || []
    w.dataLayer.push({ event, ...params })
    // без GTM (GA4 подключён напрямую) — событие сразу в GA4
    if (!w.google_tag_manager && typeof w.gtag === 'function' && event === 'form_success') w.gtag('event', 'generate_lead', params)
  } catch {}
}

export async function post(collection: string, body: Record<string, unknown>, lang = 'ru') {
  const payload = {
    ...body,
    lang,
    source: typeof window === 'undefined' ? '' : window.location.pathname,
    utm: utm(),
  }
  const res = await fetch('/api/' + collection, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  })
  if (!res.ok) throw new Error('submit failed: ' + res.status)
  return res.json()
}

/** Заявка принята — на страницу «Спасибо». */
export function thanks(form: FormName, lang: Lang, nomination = '') {
  try {
    sessionStorage.setItem(LEAD_KEY, JSON.stringify({ form, nomination, page: window.location.pathname }))
  } catch {}
  window.location.assign(path(lang, '/thanks') + '?form=' + form)
}

/** Загрузка файлов заявки в приватное хранилище Vercel Blob прямо из браузера.
    Возвращает строки «имя — ссылка» для поля «Файлы проекта»; ссылка открывается
    только после входа в админку. */
export async function uploadFiles(files: File[], folder: string): Promise<string> {
  if (!files.length) return ''
  const { upload } = await import('@vercel/blob/client')
  const stamp = new Date().toISOString().slice(0, 10)
  const out: string[] = []
  for (const f of files) {
    const safe = f.name.replace(/[^\w.\-]+/g, '_').slice(-80) || 'file'
    const blob = await upload(`applications/${folder}/${stamp}/${safe}`, f, {
      access: 'private',
      handleUploadUrl: '/api/attach',
      contentType: f.type || undefined,
    })
    out.push(`${f.name} — ${window.location.origin}/api/attach?p=${encodeURIComponent(blob.pathname)}`)
  }
  return out.join('\n')
}
