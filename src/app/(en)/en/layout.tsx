import { baseMeta, baseViewport } from '@/i18n/base-meta'
import Shell from '@/lib/Shell'

export const metadata = baseMeta('en')
export const viewport = baseViewport

export default function ENLayout({ children }: { children: React.ReactNode }) {
  return <Shell lang="en">{children}</Shell>
}
