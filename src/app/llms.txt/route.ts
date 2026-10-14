/* /llms.txt — краткая справка о сайте для AI-ассистентов (ChatGPT, Claude,
   Perplexity и др.): что это, где, когда, какие страницы читать.
   Формат — https://llmstxt.org. Даты, спикеры и номинации берутся из админки. */
import { getGlobal } from '@/lib/settings'
import { inLang } from '@/cms/build'
import { SITE, path } from '@/i18n/links'
import { BRAND, SEO_COPY } from '@/i18n/seo-defaults'

export const revalidate = 3600

const day = (iso: string | undefined, locale: string) => {
  if (!iso) return ''
  const d = new Date(iso)
  return isNaN(+d) ? '' : d.toLocaleDateString(locale, { day: 'numeric', month: 'long', year: 'numeric', timeZone: 'Europe/Chisinau' })
}

export async function GET() {
  const [forum, award]: any[] = await Promise.all([getGlobal('forum'), getGlobal('award')])
  const speakers = (Array.isArray(forum.speakers) ? forum.speakers : [])
    .map((s: any) => [inLang(s?.name, 'en'), inLang(s?.role, 'en')].filter(Boolean).join(' — '))
    .filter(Boolean)
  const noms = (Array.isArray(award.nominationList) ? award.nominationList : [])
    .map((n: any) => inLang(n?.title, 'en'))
    .filter(Boolean)
  const forumDate = day(forum.forumDate, 'en-GB') || '9 December 2026'
  const deadline = day(award.deadlineDate, 'en-GB')
  const link = (lang: 'ru' | 'ro' | 'en', p: '/' | '/forum' | '/award' | '/privacy') => SITE + path(lang, p)

  const body = `# ${BRAND.name}

> ${BRAND.about.en}

${BRAND.about.ru}

Website: ${SITE} — in Russian (default), Romanian (/ro) and English (/en).
Location: Chișinău, Republic of Moldova.
Contact: info@future-arch.md, +373 68 059 311. Instagram: https://www.instagram.com/futurearch.md/
Founded by the architecture bureau LH47 ARCH (https://lh47arch.com) and InStyle Home.

## Key facts

- Future Architecture is a professional community of architects, interior designers, developers and building-industry companies in Moldova. Membership is by application (residents and partners).
- Future Architecture Forum 2026 is an architecture and real-estate forum in Chișinău on ${forumDate}, venue Range Rover Moldova, 250+ attendees, attendance by selection.${speakers.length ? `\n- Forum speakers: ${speakers.join('; ')}.` : ''}
- Future Architecture Award 2026 is an architecture and design award in Moldova with a student competition.${noms.length ? ` Categories: ${noms.join('; ')}.` : ''}${deadline ? ` Applications until ${deadline}.` : ''} Winners are announced on stage at the forum.

## Pages

- [Community — ${SEO_COPY['/'].en.title}](${link('en', '/')}): ${SEO_COPY['/'].en.description}
- [Forum — ${SEO_COPY['/forum'].en.title}](${link('en', '/forum')}): ${SEO_COPY['/forum'].en.description}
- [Award — ${SEO_COPY['/award'].en.title}](${link('en', '/award')}): ${SEO_COPY['/award'].en.description}

## Pages in Russian

- [${SEO_COPY['/'].ru.title}](${link('ru', '/')}): ${SEO_COPY['/'].ru.description}
- [${SEO_COPY['/forum'].ru.title}](${link('ru', '/forum')}): ${SEO_COPY['/forum'].ru.description}
- [${SEO_COPY['/award'].ru.title}](${link('ru', '/award')}): ${SEO_COPY['/award'].ru.description}

## Pages in Romanian

- [${SEO_COPY['/'].ro.title}](${link('ro', '/')}): ${SEO_COPY['/'].ro.description}
- [${SEO_COPY['/forum'].ro.title}](${link('ro', '/forum')}): ${SEO_COPY['/forum'].ro.description}
- [${SEO_COPY['/award'].ro.title}](${link('ro', '/award')}): ${SEO_COPY['/award'].ro.description}

## Optional

- [Privacy policy](${link('en', '/privacy')})
- [Sitemap](${SITE}/sitemap.xml)
`
  return new Response(body, { headers: { 'Content-Type': 'text/plain; charset=utf-8' } })
}
