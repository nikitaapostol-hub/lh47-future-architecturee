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
