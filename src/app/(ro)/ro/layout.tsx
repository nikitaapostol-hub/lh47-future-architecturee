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
  description: 'ARCH MAKERS — comunitatea profesională a arhitecților și designerilor din Moldova, forum și premiu.',
}

export default function ROLayout({ children }: { children: React.ReactNode }) {
  return <Shell lang="ro">{children}</Shell>
}
