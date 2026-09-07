import { Award } from '@/lib/pages'
import { meta } from '@/i18n/meta'

export const revalidate = 60

export async function generateMetadata() {
  return meta('ro', '/award')
}

export default function Page() {
  return <Award lang="ro" />
}
