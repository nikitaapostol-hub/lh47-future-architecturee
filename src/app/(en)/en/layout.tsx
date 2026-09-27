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
  description: 'ARCH MAKERS — a professional community of architects and designers in Moldova, a forum and an award.',
}

export default function ENLayout({ children }: { children: React.ReactNode }) {
  return <Shell lang="en">{children}</Shell>
}
