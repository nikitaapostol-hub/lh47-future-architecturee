import { Forum } from '@/lib/pages'
import { meta } from '@/i18n/meta'

export const dynamic = 'force-dynamic'
export const metadata = meta('ru', '/forum')

export default function Page() {
  return <Forum lang="ru" />
}
