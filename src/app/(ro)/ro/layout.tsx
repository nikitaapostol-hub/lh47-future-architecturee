import { baseMeta, baseViewport } from '@/i18n/base-meta'
import Shell from '@/lib/Shell'

export const metadata = baseMeta('ro')
export const viewport = baseViewport

export default function ROLayout({ children }: { children: React.ReactNode }) {
  return <Shell lang="ro">{children}</Shell>
}
