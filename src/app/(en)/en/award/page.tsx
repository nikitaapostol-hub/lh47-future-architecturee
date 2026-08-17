import { Award } from '@/lib/pages'
import { meta } from '@/i18n/meta'

export const dynamic = 'force-dynamic'
export const metadata = meta('en', '/award')

export default function Page() {
  return <Award lang="en" />
}
