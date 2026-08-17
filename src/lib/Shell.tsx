import Script from 'next/script'
import '../app/(frontend)/globals.css'
import type { Lang } from '@/i18n/links'

/** The <html> shell. Each language has its own root layout so the
    lang attribute is correct in the HTML that leaves the server. */
export default function Shell({ lang, children }: { lang: Lang; children: React.ReactNode }) {
  return (
    <html lang={lang}>
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </head>
      <body>
        {children}
        <Script src="/fa-motion.js" strategy="afterInteractive" />
      </body>
    </html>
  )
}
