import type { Metadata } from 'next'
import Script from 'next/script'
import './globals.css'

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'),
  title: 'Future Architecture',
  description: 'Future Architecture — профессиональное сообщество, форум и премия отрасли.',
}

export default function FrontendLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ru">
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
