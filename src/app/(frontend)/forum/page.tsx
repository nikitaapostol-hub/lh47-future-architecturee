import { Forum } from '@/lib/pages'
import { meta } from '@/i18n/meta'

export const revalidate = 60

export async function generateMetadata() {
  return meta('ru', '/forum')
}

export default function Page() {
  return <Forum lang="ru" />
}
