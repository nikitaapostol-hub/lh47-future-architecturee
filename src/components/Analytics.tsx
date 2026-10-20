import Script from 'next/script'

/* Счётчики. Идентификаторы приходят из админки («Аналитика и счётчики»),
   а если поле пустое — из переменных окружения. Пусто и там — ничего
   не грузится: на скорость страницы аналитика тогда не влияет.

   Meta Pixel и подтверждение домена в Meta заданы ещё и здесь, в коде:
   это публичные значения (они и так видны в коде страницы), а поле
   в админке, если его заполнить, главнее. Пиксель «Future Architecture —
   future-arch.md» в портфолио «Future Architecture Community × InSTYLE Home». */

const META_PIXEL_ID = '1819950995810337'
const META_DOMAIN_VERIFICATION = 'k28wfn1nez5fcqocv656z1vdkesd90'

export type AnalyticsConfig = {
  enabled?: boolean
  gtmId?: string
  ga4Id?: string
  searchConsoleToken?: string
  yandexId?: string
  metaPixelId?: string
}

export function resolveAnalytics(cfg: Partial<AnalyticsConfig> = {}): AnalyticsConfig {
  const pick = (v: unknown, env?: string) =>
    (typeof v === 'string' && v.trim()) || (env || '').trim() || ''
  return {
    enabled: cfg.enabled !== false,
    gtmId: pick(cfg.gtmId, process.env.NEXT_PUBLIC_GTM_ID),
    ga4Id: pick(cfg.ga4Id, process.env.NEXT_PUBLIC_GA4_ID),
    searchConsoleToken: pick(cfg.searchConsoleToken, process.env.GOOGLE_SITE_VERIFICATION),
    yandexId: pick(cfg.yandexId, process.env.NEXT_PUBLIC_YANDEX_ID),
    metaPixelId: pick(cfg.metaPixelId, process.env.NEXT_PUBLIC_META_PIXEL_ID || META_PIXEL_ID),
  }
}

/** Мета-тег подтверждения прав в Search Console. Идёт в <head>. */
export function VerificationMeta({ token }: { token?: string }) {
  if (!token) return null
  return <meta name="google-site-verification" content={token} />
}

/** Мета-тег подтверждения домена future-arch.md в Meta Business. Идёт в <head>. */
export function MetaDomainVerification() {
  return <meta name="facebook-domain-verification" content={META_DOMAIN_VERIFICATION} />
}

/** Сами счётчики. Ставятся в конце <body>. */
export function AnalyticsScripts({ cfg }: { cfg: AnalyticsConfig }) {
  if (!cfg.enabled) return null
  const { gtmId, ga4Id } = cfg
  return (
    <>
      {gtmId ? (
        <>
          <Script id="gtm" strategy="afterInteractive">
            {`(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src='https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);})(window,document,'script','dataLayer','${gtmId}');`}
          </Script>
          <noscript>
            <iframe
              src={`https://www.googletagmanager.com/ns.html?id=${gtmId}`}
              height="0"
              width="0"
              style={{ display: 'none', visibility: 'hidden' }}
              title="Google Tag Manager"
            />
          </noscript>
        </>
      ) : null}

      {/* GA4 напрямую — только если нет GTM: при GTM код GA4 стоит в нём
          (тег «Google tag»), иначе просмотры считались бы дважды. */}
      {ga4Id && !gtmId ? (
        <>
          <Script
            src={`https://www.googletagmanager.com/gtag/js?id=${ga4Id}`}
            strategy="afterInteractive"
          />
          <Script id="ga4" strategy="afterInteractive">
            {`window.dataLayer=window.dataLayer||[];window.gtag=window.gtag||function(){dataLayer.push(arguments);};gtag('js',new Date());gtag('config','${ga4Id}');`}
          </Script>
        </>
      ) : null}

      {/* Яндекс.Метрика и Meta Pixel грузит баннер cookie (CookieConsent) —
          только после согласия на аналитику / рекламу. */}
    </>
  )
}
