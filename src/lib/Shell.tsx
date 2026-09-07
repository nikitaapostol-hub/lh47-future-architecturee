import Script from 'next/script'
import '../app/(frontend)/globals.css'
import Notice from '@/components/Notice'
import Preloader from '@/components/Preloader'
import { AnalyticsScripts, VerificationMeta, resolveAnalytics } from '@/components/Analytics'
import { getGlobal } from '@/lib/settings'
import { applyContent } from '@/cms/build'
import { COMMON } from '@/cms/common'
import { dict } from '@/i18n'
import type { Lang } from '@/i18n/links'

/** Заставка показывается один раз за вкладку: отметку ставим до первой
    отрисовки, иначе при переходе между страницами она мигала бы снова. */
const PRE_ONCE = `try{var s=sessionStorage;if(s.getItem('fa-pre')==='off'){document.documentElement.setAttribute('data-pre','off')}else{s.setItem('fa-pre','off')}}catch(e){}`

/** The <html> shell. Each language has its own root layout so the
    lang attribute is correct in the HTML that leaves the server. */
export default async function Shell({
  lang,
  children,
}: {
  lang: Lang
  children: React.ReactNode
}) {
  const [analytics, common] = await Promise.all([
    getGlobal('analytics'),
    getGlobal(COMMON.slug, lang),
  ])
  const cfg = resolveAnalytics(analytics)
  const t = { ...dict[lang], ...applyContent(COMMON, common, lang) }
  return (
    <html lang={lang}>
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <VerificationMeta token={cfg.searchConsoleToken} />
        <script dangerouslySetInnerHTML={{ __html: PRE_ONCE }} />
      </head>
      <body>
        <Preloader />
        <Notice lang={lang} title={t.noticeTitle} cta={t.noticeCta} close={t.noticeClose} />
        {children}
        <Script src="/fa-motion.js" strategy="afterInteractive" />
        <AnalyticsScripts cfg={cfg} />
      </body>
    </html>
  )
}
