import PrivacyPage from '@/components/PrivacyPage'
import { privacyMeta } from '@/i18n/meta'

export const metadata = privacyMeta('en')

export default function Page() {
  return <PrivacyPage lang="en" />
}
