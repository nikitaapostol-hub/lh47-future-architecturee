import type { Metadata } from 'next'
import Shell from '@/lib/Shell'

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'),
  title: 'Future Architecture',
  description: 'Future Architecture — comunitate profesională, forum și premiul industriei.',
}

export default function ROLayout({ children }: { children: React.ReactNode }) {
  return <Shell lang="ro">{children}</Shell>
}
