import { Community } from '@/lib/pages'
import { meta } from '@/i18n/meta'

export const revalidate = 60

export async function generateMetadata() {
  return meta('ru', '/')
}

export default function Page() {
  return <Community lang="ru" />
}
