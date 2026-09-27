import '../app/(frontend)/globals.css'
import { AnalyticsScripts, VerificationMeta, resolveAnalytics } from '@/components/Analytics'
import { getGlobal } from '@/lib/settings'
import type { Lang } from '@/i18n/links'

/** The <html> shell. Each language has its own root layout so the
    lang attribute is correct in the HTML that leaves the server. */
export default async function Shell({
  lang,
  children,
}: {
  lang: Lang
  children: React.ReactNode
}) {
  const cfg = resolveAnalytics(await getGlobal('analytics'))
  return (
    <html lang={lang}>
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="preload" href="/fonts/onest-cyrillic.woff2" as="font" type="font/woff2" crossOrigin="" />
        <link rel="preload" href="/fonts/onest-latin.woff2" as="font" type="font/woff2" crossOrigin="" />
        <VerificationMeta token={cfg.searchConsoleToken} />
      </head>
      <body>
        {children}
        <AnalyticsScripts cfg={cfg} />
      </body>
    </html>
  )
}
