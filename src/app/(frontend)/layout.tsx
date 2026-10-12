import { baseMeta, baseViewport } from '@/i18n/base-meta'
import Shell from '@/lib/Shell'

export const metadata = baseMeta('ru')
export const viewport = baseViewport

export default function RuLayout({ children }: { children: React.ReactNode }) {
  return <Shell lang="ru">{children}</Shell>
}
