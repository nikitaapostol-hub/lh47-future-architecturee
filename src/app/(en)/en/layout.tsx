import type { Metadata } from 'next'
import Shell from '@/lib/Shell'

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'https://future-arch.md'),
  title: 'Future Architecture',
  icons: {
    icon: [
      { url: '/favicon.ico', sizes: '48x48' },
      { url: '/icon.svg', type: 'image/svg+xml' },
    ],
    apple: '/apple-touch-icon.png',
  },
  manifest: '/site.webmanifest',
  description: 'Future Architecture — a professional community, a forum and an industry award.',
}

export default function ENLayout({ children }: { children: React.ReactNode }) {
  return <Shell lang="en">{children}</Shell>
}
