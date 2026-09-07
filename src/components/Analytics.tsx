import Script from 'next/script'

/* Счётчики. Идентификаторы приходят из админки («Аналитика и счётчики»),
   а если поле пустое — из переменных окружения. Пусто и там — ничего
   не грузится: на скорость страницы аналитика тогда не влияет. */

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
    metaPixelId: pick(cfg.metaPixelId, process.env.NEXT_PUBLIC_META_PIXEL_ID),
  }
}

/** Мета-тег подтверждения прав в Search Console. Идёт в <head>. */
export function VerificationMeta({ token }: { token?: string }) {
  if (!token) return null
  return <meta name="google-site-verification" content={token} />
}

/** Сами счётчики. Ставятся в конце <body>. */
export function AnalyticsScripts({ cfg }: { cfg: AnalyticsConfig }) {
  if (!cfg.enabled) return null
  const { gtmId, ga4Id, yandexId, metaPixelId } = cfg
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

      {ga4Id ? (
        <>
          <Script
            src={`https://www.googletagmanager.com/gtag/js?id=${ga4Id}`}
            strategy="afterInteractive"
          />
          <Script id="ga4" strategy="afterInteractive">
            {`window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments);}gtag('js',new Date());gtag('config','${ga4Id}',{anonymize_ip:true});`}
          </Script>
        </>
      ) : null}

      {yandexId ? (
        <Script id="ym" strategy="afterInteractive">
          {`(function(m,e,t,r,i,k,a){m[i]=m[i]||function(){(m[i].a=m[i].a||[]).push(arguments)};m[i].l=1*new Date();k=e.createElement(t),a=e.getElementsByTagName(t)[0],k.async=1,k.src=r,a.parentNode.insertBefore(k,a)})(window,document,'script','https://mc.yandex.ru/metrika/tag.js','ym');ym(${yandexId},'init',{clickmap:true,trackLinks:true,accurateTrackBounce:true,webvisor:true});`}
        </Script>
      ) : null}

      {metaPixelId ? (
        <Script id="meta-pixel" strategy="afterInteractive">
          {`!function(f,b,e,v,n,t,s){if(f.fbq)return;n=f.fbq=function(){n.callMethod?n.callMethod.apply(n,arguments):n.queue.push(arguments)};if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';n.queue=[];t=b.createElement(e);t.async=!0;t.src=v;s=b.getElementsByTagName(e)[0];s.parentNode.insertBefore(t,s)}(window,document,'script','https://connect.facebook.net/en_US/fbevents.js');fbq('init','${metaPixelId}');fbq('track','PageView');`}
        </Script>
      ) : null}
    </>
  )
}
