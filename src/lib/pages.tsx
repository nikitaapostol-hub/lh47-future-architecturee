/* One implementation per page, rendered by each language route.
   Keeps the three language trees from drifting apart. */
import CommunityPage from '@/components/CommunityPage'
import ForumPage from '@/components/ForumPage'
import AwardPage from '@/components/AwardPage'
import { getGlobal } from '@/lib/settings'
import { dict } from '@/i18n'
import type { Lang } from '@/i18n/links'

export function Community({ lang }: { lang: Lang }) {
  return <CommunityPage t={dict[lang]} lang={lang} />
}

export async function Forum({ lang }: { lang: Lang }) {
  const s = await getGlobal('forum-settings')
  return (
    <ForumPage
      t={dict[lang]}
      lang={lang}
      forumDate={s.forumDate as string}
      countdownVisible={s.countdownVisible !== false}
    />
  )
}

export async function Award({ lang }: { lang: Lang }) {
  const s = await getGlobal('award-settings')
  return (
    <AwardPage
      t={dict[lang]}
      lang={lang}
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
