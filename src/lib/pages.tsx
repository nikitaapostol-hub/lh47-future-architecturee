/* One implementation per page, rendered by each language route.
   Keeps the three language trees from drifting apart. */
import CommunityPage from '@/components/CommunityPage'
import ForumPage from '@/components/ForumPage'
import AwardPage from '@/components/AwardPage'
import { getGlobal } from '@/lib/settings'
import { texts } from '@/lib/content'
import { inLang } from '@/cms/build'
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
  const g: any = await getGlobal('forum')
  const t = await texts('forum', lang, g)
  const speakers = (Array.isArray(g.speakers) ? g.speakers : []).map((s: any) => ({
    name: inLang(s?.name, lang),
    role: inLang(s?.role, lang),
    photo: s?.photo && typeof s.photo === 'object' ? { url: s.photo.url } : null,
  }))
  return (
    <>
      <OrgLd lang={lang} />
      <ForumLd lang={lang} startDate={g.forumDate as string} />
      <ForumPage t={t} lang={lang} forumDate={g.forumDate as string} countdownVisible={g.countdownVisible !== false} speakers={speakers} />
    </>
  )
}

export async function Award({ lang }: { lang: Lang }) {
  const [g, f]: any[] = await Promise.all([getGlobal('award'), getGlobal('forum')])
  const t = await texts('award', lang, g)
  const nominations = (Array.isArray(g.nominationList) ? g.nominationList : [])
    .map((n: any, i: number) => ({ no: String(i + 1).padStart(2, '0'), title: inLang(n?.title, lang), hint: inLang(n?.kind, lang) }))
    .filter((n: any) => n.title)
  return (
    <>
      <OrgLd lang={lang} />
      <AwardLd lang={lang} deadline={g.deadlineDate as string} />
      <AwardPage
        t={t}
        lang={lang}
        deadlineDate={g.deadlineDate as string}
        forumDate={f.forumDate as string}
        nominations={nominations}
        formOpen={g.formOpen !== false}
        formClosedText={inLang(g.formClosedText, lang) || t.aClosed}
      />
    </>
  )
}
