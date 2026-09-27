import type { Metadata } from 'next'
import Shell from '@/lib/Shell'

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'https://future-arch.md'),
  title: 'ARCH MAKERS',
  icons: {
    icon: [
      { url: '/favicon.ico', sizes: '48x48' },
      { url: '/icon.svg', type: 'image/svg+xml' },
    ],
    apple: '/apple-touch-icon.png',
  },
  manifest: '/site.webmanifest',
  description: 'ARCH MAKERS — профессиональное сообщество архитекторов и дизайнеров Молдовы, форум и премия.',
}

export default function RuLayout({ children }: { children: React.ReactNode }) {
  return <Shell lang="ru">{children}</Shell>
}
