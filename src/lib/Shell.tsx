import '../app/(frontend)/globals.css'
import { AnalyticsScripts, MetaDomainVerification, VerificationMeta, resolveAnalytics } from '@/components/Analytics'
import { getGlobal } from '@/lib/settings'
import type { Lang } from '@/i18n/links'
import LivePreview from '@/components/LivePreview'
import CookieConsent from '@/components/CookieConsent'
import { CONSENT_DEFAULT } from '@/lib/consent'

/** Заставка: первый заход за сессию — полная, дальше — короткая.
    Отметку ставим до первой отрисовки, чтобы не было мигания. */
const PRE = `try{if(window.self!==window.top){document.documentElement.setAttribute('data-pre','off')}else{var s=sessionStorage;if(s.getItem('am-pre')){document.documentElement.setAttribute('data-pre','quick')}else{s.setItem('am-pre','1')}}}catch(e){}`

/** The <html> shell. Each language has its own root layout so the
    lang attribute is correct in the HTML that leaves the server. */
export default async function Shell({
  lang,
  children,
}: {
  lang: Lang
  children: React.ReactNode
}) {
  const g: any = await getGlobal('settings')
  const cfg = resolveAnalytics({
    enabled: g.analyticsEnabled,
    gtmId: g.gtmId,
    ga4Id: g.ga4Id,
    searchConsoleToken: g.searchConsoleToken,
    yandexId: g.yandexId,
    metaPixelId: g.metaPixelId,
  })
  // Баннер и запреты по умолчанию нужны, только если на сайте есть счётчики
  const tracking = Boolean(cfg.enabled && (cfg.gtmId || cfg.ga4Id || cfg.yandexId || cfg.metaPixelId))
  return (
    <html lang={lang} suppressHydrationWarning>
      <head>
        {/* Consent Mode v2: до любых счётчиков, поэтому первым в <head> */}
        {tracking ? <script dangerouslySetInnerHTML={{ __html: CONSENT_DEFAULT }} /> : null}
        <link rel="preload" href="/fonts/onest-cyrillic.woff2" as="font" type="font/woff2" crossOrigin="" />
        <link rel="preload" href="/fonts/onest-latin.woff2" as="font" type="font/woff2" crossOrigin="" />
        <script dangerouslySetInnerHTML={{ __html: PRE }} />
        <VerificationMeta token={cfg.searchConsoleToken} />
        <MetaDomainVerification />
      </head>
      <body>
        {children}
        <LivePreview />
        <AnalyticsScripts cfg={cfg} />
        {tracking ? <CookieConsent lang={lang} yandexId={cfg.yandexId} metaPixelId={cfg.metaPixelId} /> : null}
      </body>
    </html>
  )
}
