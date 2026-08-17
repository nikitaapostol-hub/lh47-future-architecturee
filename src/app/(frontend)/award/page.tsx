import type { Metadata } from 'next'
import AwardPage from '@/components/AwardPage'
import { getGlobal } from '@/lib/settings'

export const dynamic = 'force-dynamic'

export const metadata: Metadata = {
  title: 'Future Architecture Award 2026 · Премия отрасли и студенческий конкурс',
  description:
    'Премия Future Architecture Award 2026: номинации отрасли и студенческий конкурс.',
}

export default async function Award() {
  const s = await getGlobal('award-settings')
  return (
    <AwardPage
      deadlineLabel={s.deadlineLabel as string}
      deadlineDate={s.deadlineDate as string}
      countdownVisible={s.countdownVisible !== false}
      juryVisible={s.juryVisible === true}
      jury={(s.jury as any) || []}
      nominations={(s.nominations as any) || []}
      studentNominations={(s.studentNominations as any) || []}
    />
  )
}
