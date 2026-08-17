import type { Metadata } from 'next'
import Shell from '@/lib/Shell'

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'),
  title: 'Future Architecture',
  description: 'Future Architecture — профессиональное сообщество, форум и премия отрасли.',
}

export default function RuLayout({ children }: { children: React.ReactNode }) {
  return <Shell lang="ru">{children}</Shell>
}
