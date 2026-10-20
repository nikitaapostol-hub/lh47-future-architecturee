/* Согласие на cookie (Google Consent Mode v2).

   Как устроено:
   1. В <head>, до Google Tag Manager, стоит CONSENT_DEFAULT: всё, кроме
      необходимого, по умолчанию запрещено. Если человек уже выбирал —
      выбор сразу читается из cookie fa_consent и применяется.
   2. Пока согласия нет, GA4 не ставит cookie и шлёт в Google только
      обезличенные сигналы (так работает Consent Mode).
   3. Баннер (components/CookieConsent.tsx) сохраняет выбор в fa_consent
      на 12 месяцев и сообщает Google «consent update» — без перезагрузки.
   4. В dataLayer уходит событие fa_consent_update — на него можно вешать
      теги в GTM, которым нужен отдельный триггер после согласия. */

export const CONSENT_COOKIE = 'fa_consent'
export const CONSENT_EVENT = 'fa:cookie-settings'
const MAX_AGE = 60 * 60 * 24 * 365

export type Consent = { analytics: boolean; marketing: boolean }

/** Значение cookie: «a1.m0.v2» — аналитика да, реклама нет.
    v2 — выбор сделан, когда в баннере уже была категория «Реклама» (Meta Pixel).
    Выбор без v2 сделан раньше: тогда «Принять все» записывало m0, потому что
    рекламы на сайте ещё не было. Таких спрашиваем ещё раз, а до ответа
    действует их старый выбор по аналитике (его читает CONSENT_DEFAULT). */
const VERSION = 'v2'
export const encode = (c: Consent) => `a${c.analytics ? 1 : 0}.m${c.marketing ? 1 : 0}.${VERSION}`

export function readConsent(): Consent | null {
  if (typeof document === 'undefined') return null
  const m = document.cookie.match(/(?:^|;\s*)fa_consent=([^;]+)/)
  if (!m) return null
  const v = decodeURIComponent(m[1])
  if (!/a[01]\.m[01]/.test(v)) return null
  if (!v.endsWith('.' + VERSION)) return null // старый выбор — показать баннер ещё раз
  return { analytics: v.includes('a1'), marketing: v.includes('m1') }
}

type W = Window & { dataLayer?: unknown[]; gtag?: (...a: unknown[]) => void }

export function saveConsent(c: Consent) {
  const secure = location.protocol === 'https:' ? '; Secure' : ''
  document.cookie = `${CONSENT_COOKIE}=${encode(c)}; Max-Age=${MAX_AGE}; Path=/; SameSite=Lax${secure}`
  const w = window as W
  w.dataLayer = w.dataLayer || []
  // gtag() из CONSENT_DEFAULT; если его вдруг нет — пишем в dataLayer в том же формате
  const gtag =
    w.gtag ||
    function () {
      // eslint-disable-next-line prefer-rest-params
      w.dataLayer!.push(arguments)
    }
  const ads = c.marketing ? 'granted' : 'denied'
  gtag('consent', 'update', {
    analytics_storage: c.analytics ? 'granted' : 'denied',
    ad_storage: ads,
    ad_user_data: ads,
    ad_personalization: ads,
  })
  w.dataLayer.push({ event: 'fa_consent_update', consent_analytics: c.analytics, consent_marketing: c.marketing })
  // Отказ после согласия: убираем уже поставленные cookie аналитики на этом домене
  if (!c.analytics) {
    const host = location.hostname.replace(/^www\./, '')
    for (const part of document.cookie.split(';')) {
      const name = part.split('=')[0].trim()
      if (/^(_ga|_gid|_gat|_ym)/.test(name)) {
        for (const d of ['', `; Domain=${host}`, `; Domain=.${host}`])
          document.cookie = `${name}=; Max-Age=0; Path=/${d}`
      }
    }
  }
}

/** Открыть баннер с настройками — ссылка «Настройки cookie». */
export const openCookieSettings = () => window.dispatchEvent(new Event(CONSENT_EVENT))

/** Скрипт для <head>: запреты по умолчанию + ранее сохранённый выбор. */
export const CONSENT_DEFAULT = `window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments)}window.gtag=gtag;
gtag('consent','default',{ad_storage:'denied',ad_user_data:'denied',ad_personalization:'denied',analytics_storage:'denied',functionality_storage:'granted',security_storage:'granted',wait_for_update:500});
gtag('set','ads_data_redaction',true);
try{var m=document.cookie.match(/(?:^|;\\s*)fa_consent=([^;]+)/);if(m){var v=decodeURIComponent(m[1]),a=v.indexOf('a1')>-1,k=v.indexOf('m1')>-1;gtag('consent','update',{analytics_storage:a?'granted':'denied',ad_storage:k?'granted':'denied',ad_user_data:k?'granted':'denied',ad_personalization:k?'granted':'denied'});}}catch(e){}`
