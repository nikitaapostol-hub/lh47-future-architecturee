import type { Metadata } from 'next'
import ForumPage from '@/components/ForumPage'
import { getGlobal } from '@/lib/settings'

export const dynamic = 'force-dynamic'

export const metadata: Metadata = {
  title: 'Future Architecture Forum Moldova 2026',
  description:
    'Закрытый форум для всей цепочки создания стоимости объекта: инвесторы, архитекторы, производители, управляющие компании.',
}

export default async function Forum() {
  const s = await getGlobal('forum-settings')
  return (
    <ForumPage
      forumDate={s.forumDate as string}
      countdownVisible={s.countdownVisible !== false}
    />
  )
}
