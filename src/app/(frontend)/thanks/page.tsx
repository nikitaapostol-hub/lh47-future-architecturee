import { Thanks } from '@/lib/pages'
import { thanksMeta } from '@/i18n/meta'

export const revalidate = 60
export const metadata = thanksMeta('ru')

export default function Page() {
  return <Thanks lang="ru" />
}
