/* События Meta Pixel.

   Сам пиксель грузит баннер cookie (components/CookieConsent.tsx) — только
   после согласия на категорию «Реклама». Поэтому событие может прийти
   раньше, чем пиксель загрузился: тогда оно ждёт в очереди и уходит сразу
   после загрузки (flushMeta). Если согласия на рекламу нет, пиксель не
   загрузится и очередь просто исчезнет вместе со страницей — так и нужно.

   Заявка = стандартное событие Lead. На него в Ads Manager настраивается
   оптимизация кампаний и считаются конверсии с рекламы Meta. */

type Queued = [event: string, params: Record<string, unknown>, eventID: string]
type W = Window & { fbq?: (...a: unknown[]) => void; __faFbq?: Queued[] }

function send(w: W, [event, params, eventID]: Queued) {
  try {
    w.fbq!('track', event, params, { eventID })
  } catch {}
}

/** Отправить стандартное событие Meta (Lead и т.п.) — сразу или после загрузки пикселя. */
export function metaTrack(event: string, params: Record<string, unknown> = {}) {
  if (typeof window === 'undefined') return
  const w = window as W
  // eventID — на будущее, для склейки с серверными событиями (Conversions API)
  const eventID =
    (typeof crypto !== 'undefined' && 'randomUUID' in crypto && crypto.randomUUID()) ||
    `${Date.now()}-${Math.random().toString(36).slice(2)}`
  const item: Queued = [event, params, eventID]
  if (typeof w.fbq === 'function') send(w, item)
  else (w.__faFbq = w.__faFbq || []).push(item)
}

/** Пиксель загружен — отправить всё, что ждало в очереди. */
export function flushMeta() {
  if (typeof window === 'undefined') return
  const w = window as W
  if (typeof w.fbq !== 'function' || !w.__faFbq?.length) return
  const q = w.__faFbq
  w.__faFbq = []
  q.forEach((item) => send(w, item))
}

/* ——— Клик из рекламы (fbclid) ———
   Человек приходит с рекламы по ссылке с ?fbclid=…, но соглашается на cookie
   не сразу — часто уже на другой странице, где fbclid в адресе нет. Тогда
   пиксель не узнал бы, что визит пришёл с рекламы, и заявка не засчиталась бы
   объявлению. Поэтому fbclid запоминаем в sessionStorage вкладки (в Meta он
   не уходит), а когда пиксель загружается после согласия, ставим cookie _fbc
   в формате Meta. Без согласия на рекламу cookie не ставится. */

const CLICK_KEY = 'fa-fbclid'

/** Запомнить fbclid из адреса текущей страницы. Вызывается на каждой странице. */
export function rememberAdClick() {
  if (typeof window === 'undefined') return
  try {
    const id = new URLSearchParams(window.location.search).get('fbclid')
    if (id) sessionStorage.setItem(CLICK_KEY, JSON.stringify({ id, ts: Date.now() }))
  } catch {}
}

/** Перед загрузкой пикселя: поставить _fbc из сохранённого клика, если его ещё нет. */
export function applyAdClick() {
  if (typeof window === 'undefined') return
  try {
    if (/(?:^|;\s*)_fbc=/.test(document.cookie)) return
    const raw = sessionStorage.getItem(CLICK_KEY)
    if (!raw) return
    const { id, ts } = JSON.parse(raw) as { id: string; ts: number }
    if (!id) return
    const secure = location.protocol === 'https:' ? '; Secure' : ''
    document.cookie = `_fbc=${encodeURIComponent(`fb.1.${ts}.${id}`)}; Max-Age=${60 * 60 * 24 * 90}; Path=/; SameSite=Lax${secure}`
  } catch {}
}
