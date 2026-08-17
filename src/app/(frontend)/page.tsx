import type { Metadata } from 'next'
import CommunityPage from '@/components/CommunityPage'

export const metadata: Metadata = {
  title: 'Future Architecture – профессиональное сообщество',
  description:
    'Future Architecture — профессиональное сообщество архитекторов, девелоперов и производителей Молдовы.',
}

export default function Home() {
  return <CommunityPage />
}
