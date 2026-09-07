/* One implementation per page, rendered by each language route.
   Keeps the three language trees from drifting apart. */
import CommunityPage from '@/components/CommunityPage'
import ForumPage from '@/components/ForumPage'
import AwardPage from '@/components/AwardPage'
import { getGlobal } from '@/lib/settings'
import { texts } from '@/lib/content'
import type { Lang } from '@/i18n/links'
import { OrgLd, ForumLd, AwardLd } from '@/lib/JsonLd'

export async function Community({ lang }: { lang: Lang }) {
  const t = await texts('home', lang)
  return (
    <>
      <OrgLd lang={lang} />
      <CommunityPage t={t} lang={lang} />
    </>
  )
}

export async function Forum({ lang }: { lang: Lang }) {
  const [s, t] = await Promise.all([getGlobal('forum-settings', lang), texts('forum', lang)])
  return (
    <>
      <OrgLd lang={lang} />
      <ForumLd lang={lang} startDate={s.forumDate as string} />
      <ForumPage
        t={t}
        lang={lang}
        forumDate={s.forumDate as string}
        countdownVisible={s.countdownVisible !== false}
        speakers={(s.speakers as any) || []}
      />
    </>
  )
}

export async function Award({ lang }: { lang: Lang }) {
  const [s, t] = await Promise.all([getGlobal('award-settings', lang), texts('award', lang)])
  return (
    <>
      <OrgLd lang={lang} />
      <AwardLd lang={lang} deadline={s.deadlineDate as string} />
      <AwardPage
        t={t}
        lang={lang}
        deadlineLabel={s.deadlineLabel as string}
        deadlineDate={s.deadlineDate as string}
        countdownVisible={s.countdownVisible !== false}
        juryVisible={s.juryVisible === true}
        jury={(s.jury as any) || []}
        nominations={(s.nominations as any) || []}
        studentNominations={(s.studentNominations as any) || []}
        formOpen={s.formOpen !== false}
        formClosedText={s.formClosedText as string}
      />
    </>
  )
}
