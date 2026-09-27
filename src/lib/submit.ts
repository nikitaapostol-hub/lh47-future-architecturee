/* Отправка форм. Кроме полей формы уходит контекст: язык, страница и utm —
   по ним видно, откуда пришла заявка. Событие дублируется в dataLayer,
   чтобы цель настраивалась в GTM без правок кода. */

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
    if (typeof w.gtag === 'function') w.gtag('event', event, params)
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
  track('form_submit', { form: collection, language: lang })
  return res.json()
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
