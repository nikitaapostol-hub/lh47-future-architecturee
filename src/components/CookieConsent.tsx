'use client'

/* Баннер согласия на cookie. Как работает согласие — см. lib/consent.ts.
   Первый заход: плашка внизу слева (на телефоне — во всю ширину) с кнопками
   «Принять все / Отклонить» и ссылкой «Настроить». Выбор живёт 12 месяцев;
   открыть заново можно ссылкой «Настройки cookie» в подвале и в политике.
   Яндекс.Метрика и Meta Pixel (если заданы в админке) грузятся только
   после согласия на свою категорию; GA4 через GTM сам слушает Consent Mode. */

import { useEffect, useRef, useState } from 'react'
import type { CSSProperties } from 'react'
import type { Lang } from '@/i18n/links'
import { path } from '@/i18n/links'
import { CONSENT_EVENT, readConsent, saveConsent } from '@/lib/consent'
import type { Consent } from '@/lib/consent'
import { applyAdClick, flushMeta, rememberAdClick } from '@/lib/meta'

type S = CSSProperties
const W = "'Actay Wide',Onest,sans-serif"

const T: Record<Lang, Record<string, string>> = {
  ru: {
    title: 'Файлы cookie',
    text: 'Мы используем cookie, чтобы понимать, как посетители пользуются сайтом. Аналитика включается только с вашего согласия.',
    more: 'Подробнее',
    accept: 'Принять все',
    reject: 'Отклонить',
    settings: 'Настроить',
    save: 'Сохранить выбор',
    necessary: 'Необходимые',
    necessaryText: 'Запоминают ваш выбор и обеспечивают работу сайта и форм.',
    always: 'Всегда',
    analytics: 'Аналитика',
    analyticsText: 'Google Analytics: какие страницы смотрят и сколько заявок отправляют. Без рекламы.',
    marketing: 'Реклама',
    marketingText: 'Meta Pixel: показ рекламы сообщества тем, кто был на сайте.',
  },
  ro: {
    title: 'Cookie-uri',
    text: 'Folosim cookie-uri pentru a înțelege cum este utilizat site-ul. Analiza se activează doar cu acordul dumneavoastră.',
    more: 'Detalii',
    accept: 'Accept toate',
    reject: 'Refuz',
    settings: 'Setări',
    save: 'Salvează alegerea',
    necessary: 'Necesare',
    necessaryText: 'Rețin alegerea dumneavoastră și asigură funcționarea site-ului și a formularelor.',
    always: 'Mereu',
    analytics: 'Analiză',
    analyticsText: 'Google Analytics: ce pagini sunt vizitate și câte cereri se trimit. Fără publicitate.',
    marketing: 'Publicitate',
    marketingText: 'Meta Pixel: afișarea reclamelor comunității celor care au vizitat site-ul.',
  },
  en: {
    title: 'Cookies',
    text: 'We use cookies to understand how visitors use the site. Analytics is turned on only with your consent.',
    more: 'Learn more',
    accept: 'Accept all',
    reject: 'Reject',
    settings: 'Settings',
    save: 'Save choice',
    necessary: 'Necessary',
    necessaryText: 'Remember your choice and keep the site and forms working.',
    always: 'Always on',
    analytics: 'Analytics',
    analyticsText: 'Google Analytics: which pages are viewed and how many applications are sent. No advertising.',
    marketing: 'Advertising',
    marketingText: 'Meta Pixel: showing community ads to people who visited the site.',
  },
}

/** Подпись ссылки «Настройки cookie» — для подвала и политики. */
export const COOKIE_LINK: Record<Lang, string> = { ru: 'Настройки cookie', ro: 'Setări cookie', en: 'Cookie settings' }

type Props = { lang: Lang; yandexId?: string; metaPixelId?: string }

function loadOnce(id: string, code: string) {
  if (document.getElementById(id)) return
  const s = document.createElement('script')
  s.id = id
  s.text = code
  document.body.appendChild(s)
}

function applyThirdParty(c: Consent, yandexId?: string, metaPixelId?: string) {
  if (c.analytics && yandexId)
    loadOnce(
      'ym',
      `(function(m,e,t,r,i,k,a){m[i]=m[i]||function(){(m[i].a=m[i].a||[]).push(arguments)};m[i].l=1*new Date();k=e.createElement(t),a=e.getElementsByTagName(t)[0],k.async=1,k.src=r,a.parentNode.insertBefore(k,a)})(window,document,'script','https://mc.yandex.ru/metrika/tag.js','ym');ym(${Number(yandexId)},'init',{clickmap:true,trackLinks:true,accurateTrackBounce:true,webvisor:true});`,
    )
  if (c.marketing && metaPixelId) applyAdClick()
  if (c.marketing && metaPixelId)
    loadOnce(
      'meta-pixel',
      `!function(f,b,e,v,n,t,s){if(f.fbq)return;n=f.fbq=function(){n.callMethod?n.callMethod.apply(n,arguments):n.queue.push(arguments)};if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';n.queue=[];t=b.createElement(e);t.async=!0;t.src=v;s=b.getElementsByTagName(e)[0];s.parentNode.insertBefore(t,s)}(window,document,'script','https://connect.facebook.net/en_US/fbevents.js');fbq('init','${String(metaPixelId).replace(/\D/g, '')}');fbq('track','PageView');`,
    )
  // события (Lead со страницы «Спасибо»), пришедшие раньше пикселя
  if (c.marketing && metaPixelId) flushMeta()
}

const BTN: S = { display: 'inline-flex', alignItems: 'center', justifyContent: 'center', minHeight: '44px', padding: '0 18px', fontFamily: W, fontWeight: 700, fontSize: '13px', cursor: 'pointer', transition: 'background 200ms,color 200ms', whiteSpace: 'nowrap' }

function Switch({ on, onChange, label, disabled }: { on: boolean; onChange?: (v: boolean) => void; label: string; disabled?: boolean }) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={on}
      aria-label={label}
      disabled={disabled}
      onClick={() => onChange?.(!on)}
      style={{ position: 'relative', flex: '0 0 auto', width: '44px', height: '24px', padding: 0, border: '1px solid ' + (on ? '#000' : '#C9C9C5'), background: on ? '#000' : '#fff', cursor: disabled ? 'default' : 'pointer', opacity: disabled ? 0.45 : 1, transition: 'background 200ms,border-color 200ms' }}
    >
      <span aria-hidden="true" style={{ position: 'absolute', top: '3px', left: on ? '23px' : '3px', width: '16px', height: '16px', background: on ? '#E5D900' : '#C9C9C5', transition: 'left 200ms,background 200ms' }} />
    </button>
  )
}

export default function CookieConsent({ lang, yandexId, metaPixelId }: Props) {
  const t = T[lang]
  const [open, setOpen] = useState(false)
  const [details, setDetails] = useState(false)
  const [analytics, setAnalytics] = useState(false)
  const [marketing, setMarketing] = useState(false)
  const box = useRef<HTMLDivElement>(null)
  const hasMarketing = Boolean(metaPixelId)

  useEffect(() => {
    // внутри админки (живой предпросмотр) баннер не нужен
    if (window.self !== window.top) return
    rememberAdClick()
    const c = readConsent()
    if (c) {
      setAnalytics(c.analytics)
      setMarketing(c.marketing)
      applyThirdParty(c, yandexId, metaPixelId)
    } else {
      setOpen(true)
    }
    const reopen = () => {
      const cur = readConsent()
      setAnalytics(cur?.analytics ?? false)
      setMarketing(cur?.marketing ?? false)
      setDetails(true)
      setOpen(true)
      setTimeout(() => box.current?.focus(), 30)
    }
    window.addEventListener(CONSENT_EVENT, reopen)
    return () => window.removeEventListener(CONSENT_EVENT, reopen)
  }, [yandexId, metaPixelId])

  const done = (c: Consent) => {
    saveConsent(c)
    applyThirdParty(c, yandexId, metaPixelId)
    setAnalytics(c.analytics)
    setMarketing(c.marketing)
    setOpen(false)
    setDetails(false)
  }

  if (!open) return null

  const rows: { key: string; title: string; text: string; on: boolean; set?: (v: boolean) => void; fixed?: boolean }[] = [
    { key: 'n', title: t.necessary, text: t.necessaryText, on: true, fixed: true },
    { key: 'a', title: t.analytics, text: t.analyticsText, on: analytics, set: setAnalytics },
    ...(hasMarketing ? [{ key: 'm', title: t.marketing, text: t.marketingText, on: marketing, set: setMarketing }] : []),
  ]

  return (
    <div
      ref={box}
      tabIndex={-1}
      role="dialog"
      aria-modal="false"
      aria-labelledby="fa-cookie-title"
      className="fa-cookie"
      style={{ position: 'fixed', zIndex: 80, background: '#fff', color: '#000', border: '1px solid #000', boxShadow: '0 12px 40px rgba(0,0,0,.14)', outline: 'none' }}
    >
      <div aria-hidden="true" style={{ display: 'flex', height: '4px' }}>
        {['#E5D900', '#1A52A0', '#E8461E', '#3C3F44'].map((c) => (
          <span key={c} style={{ flex: 1, background: c }} />
        ))}
      </div>
      <div style={{ padding: '20px 22px 22px' }}>
        <div id="fa-cookie-title" style={{ fontFamily: W, fontWeight: 800, fontSize: '17px', letterSpacing: '-.01em' }}>
          {t.title}
        </div>
        <p style={{ marginTop: '8px', fontSize: '14px', lineHeight: 1.55, color: '#3A3A37' }}>
          {t.text}{' '}
          <a href={path(lang, '/privacy') + '#cookies'} style={{ textDecoration: 'underline', textUnderlineOffset: '2px', color: '#000' }}>
            {t.more}
          </a>
        </p>

        {details && (
          <div style={{ marginTop: '14px', borderTop: '1px solid #E6E6E3' }}>
            {rows.map((r) => (
              <div key={r.key} style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '16px', padding: '12px 0', borderBottom: '1px solid #E6E6E3' }}>
                <div>
                  <div style={{ fontSize: '12px', fontWeight: 600, letterSpacing: '.1em', textTransform: 'uppercase' }}>
                    {r.title}
                    {r.fixed ? <span style={{ marginLeft: '8px', color: '#8A8A86', letterSpacing: '.06em' }}>· {t.always}</span> : null}
                  </div>
                  <div style={{ marginTop: '4px', fontSize: '13px', lineHeight: 1.5, color: '#55554F' }}>{r.text}</div>
                </div>
                <Switch on={r.on} onChange={r.set} label={r.title} disabled={r.fixed} />
              </div>
            ))}
          </div>
        )}

        <div className="fa-cookie-btns" style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: '8px', marginTop: '16px' }}>
          {details ? (
            <>
              <button type="button" className="hv-blue" onClick={() => done({ analytics, marketing: hasMarketing && marketing })} style={{ ...BTN, background: '#000', color: '#fff', border: 0 }}>
                {t.save}
              </button>
              <button type="button" className="hv-black" onClick={() => done({ analytics: true, marketing: hasMarketing })} style={{ ...BTN, background: '#fff', color: '#000', border: '1px solid #000' }}>
                {t.accept}
              </button>
            </>
          ) : (
            <>
              <button type="button" className="hv-blue" onClick={() => done({ analytics: true, marketing: hasMarketing })} style={{ ...BTN, background: '#000', color: '#fff', border: 0 }}>
                {t.accept}
              </button>
              <button type="button" className="hv-black" onClick={() => done({ analytics: false, marketing: false })} style={{ ...BTN, background: '#fff', color: '#000', border: '1px solid #000' }}>
                {t.reject}
              </button>
              <button type="button" onClick={() => setDetails(true)} style={{ ...BTN, padding: '0 6px', background: 'transparent', border: 0, color: '#000', textDecoration: 'underline', textUnderlineOffset: '3px', fontFamily: 'inherit', fontWeight: 600 }}>
                {t.settings}
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  )
}

/** Ссылка «Настройки cookie» — открывает баннер с переключателями. */
export function CookieSettingsLink({ lang, style, className }: { lang: Lang; style?: S; className?: string }) {
  return (
    <button
      type="button"
      className={className}
      onClick={() => window.dispatchEvent(new Event(CONSENT_EVENT))}
      style={{ padding: 0, border: 0, background: 'transparent', color: 'inherit', font: 'inherit', cursor: 'pointer', textAlign: 'left', ...style }}
    >
      {COOKIE_LINK[lang]}
    </button>
  )
}
