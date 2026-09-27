import '../app/(frontend)/globals.css'
import { AnalyticsScripts, VerificationMeta, resolveAnalytics } from '@/components/Analytics'
import { getGlobal } from '@/lib/settings'
import type { Lang } from '@/i18n/links'

/** Заставка: первый заход за сессию — полная, дальше — короткая.
    Отметку ставим до первой отрисовки, чтобы не было мигания. */
const PRE = `try{var s=sessionStorage;if(s.getItem('am-pre')){document.documentElement.setAttribute('data-pre','quick')}else{s.setItem('am-pre','1')}}catch(e){}`

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
    <html lang={lang} suppressHydrationWarning>
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="preload" href="/fonts/onest-cyrillic.woff2" as="font" type="font/woff2" crossOrigin="" />
        <link rel="preload" href="/fonts/onest-latin.woff2" as="font" type="font/woff2" crossOrigin="" />
        <script dangerouslySetInnerHTML={{ __html: PRE }} />
        <VerificationMeta token={cfg.searchConsoleToken} />
      </head>
      <body>
        {children}
        <AnalyticsScripts cfg={cfg} />
      </body>
    </html>
  )
}
