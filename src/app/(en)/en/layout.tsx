import type { Metadata } from 'next'
import Shell from '@/lib/Shell'

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'),
  title: 'Future Architecture',
  description: 'Future Architecture — a professional community, a forum and an industry award.',
}

export default function ENLayout({ children }: { children: React.ReactNode }) {
  return <Shell lang="en">{children}</Shell>
}
