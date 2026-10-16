/* Микроразметка schema.org. Отдаётся сервером в <script type="application/ld+json">,
   поэтому её видят поисковики и AI-краулеры без выполнения JS.
   Из неё Google и ассистенты берут «кто это, где, когда». Тексты — те же,
   что в заголовках и описаниях страниц (seo-defaults.ts). */
import { LANGS, SITE, path } from '@/i18n/links'
import type { Lang } from '@/i18n/links'
import { BRAND, SEO_COPY, ogImage } from '@/i18n/seo-defaults'

const ORG_ID = SITE + '/#organization'
const SITE_ID = SITE + '/#website'

const ORGANIZER = { '@type': 'Organization', '@id': ORG_ID, name: BRAND.name, url: SITE }

const VENUE = {
  '@type': 'Place',
  name: 'Range Rover Moldova',
  address: { '@type': 'PostalAddress', addressLocality: 'Chișinău', addressCountry: 'MD' },
}

const IN_LANG: Record<Lang, string> = { ru: 'ru', ro: 'ro', en: 'en' }

function tag(data: unknown) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data).replace(/</g, '\\u003c') }}
    />
  )
}

/** Организация, сайт и текущая страница. Ставится на все страницы. */
export function OrgLd({ lang, page = '/' }: { lang: Lang; page?: '/' | '/forum' | '/award' }) {
  const url = SITE + path(lang, page)
  return tag({
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'Organization',
        '@id': ORG_ID,
        name: BRAND.name,
        alternateName: ['Future Architecture Community', 'Future Architecture Moldova'],
        description: BRAND.about[lang],
        url: SITE,
        logo: { '@type': 'ImageObject', url: SITE + '/icon-512.png', width: 512, height: 512 },
        image: SITE + ogImage('/', lang),
        email: 'info@future-arch.md',
        telephone: '+37368059311',
        sameAs: ['https://www.instagram.com/futurearch.md/'],
        foundingDate: '2026',
        address: { '@type': 'PostalAddress', addressLocality: 'Chișinău', addressCountry: 'MD' },
        areaServed: { '@type': 'Country', name: 'Moldova' },
        knowsAbout: ['Architecture', 'Interior design', 'Urban planning', 'Real estate development'],
        founder: [
          { '@type': 'Organization', name: 'LH47 ARCH', url: 'https://lh47arch.com' },
          { '@type': 'Organization', name: 'InStyle Home' },
        ],
      },
      {
        '@type': 'WebSite',
        '@id': SITE_ID,
        url: SITE,
        name: BRAND.name,
        description: BRAND.about[lang],
        inLanguage: LANGS.map((l) => IN_LANG[l]),
        publisher: { '@id': ORG_ID },
      },
      {
        '@type': 'WebPage',
        '@id': url + '#webpage',
        url,
        name: SEO_COPY[page][lang].title,
        description: SEO_COPY[page][lang].description,
        inLanguage: IN_LANG[lang],
        isPartOf: { '@id': SITE_ID },
        about: { '@id': ORG_ID },
        primaryImageOfPage: { '@type': 'ImageObject', url: SITE + ogImage(page, lang), width: 1200, height: 630 },
      },
    ],
  })
}

/** Конец дня мероприятия — Google просит endDate у событий. */
function sameDayEnd(start: string, hour = 20) {
  const m = /^(\d{4}-\d{2}-\d{2})T/.exec(start)
  return m ? `${m[1]}T${String(hour).padStart(2, '0')}:00:00+02:00` : undefined
}

/** Форум как событие: дата, площадка, организатор, спикеры. */
export function ForumLd({
  lang,
  startDate,
  speakers = [],
}: {
  lang: Lang
  startDate?: string
  speakers?: { name: string; role?: string }[]
}) {
  const start = startDate || '2026-12-09T10:00:00+02:00'
  const url = SITE + path(lang, '/forum')
  return tag({
    '@context': 'https://schema.org',
    '@type': 'Event',
    '@id': url + '#event',
    name: SEO_COPY['/forum'][lang].title,
    alternateName: 'Future Architecture Forum 2026',
    description: SEO_COPY['/forum'][lang].description,
    startDate: start,
    endDate: sameDayEnd(start),
    eventStatus: 'https://schema.org/EventScheduled',
    eventAttendanceMode: 'https://schema.org/OfflineEventAttendanceMode',
    url,
    inLanguage: IN_LANG[lang],
    maximumAttendeeCapacity: 300,
    image: [SITE + ogImage('/forum', lang)],
    location: VENUE,
    organizer: ORGANIZER,
    ...(speakers.length
      ? {
          performer: speakers
            .filter((s) => s.name)
            .map((s) => ({ '@type': 'Person', name: s.name, ...(s.role ? { description: s.role } : {}) })),
        }
      : {}),
    isAccessibleForFree: true,
    offers: {
      '@type': 'Offer',
      price: '0',
      priceCurrency: 'MDL',
      availability: 'https://schema.org/LimitedAvailability',
      url: url + '#apply',
      validFrom: '2026-09-01T00:00:00+03:00',
    },
  })
}

/** Премия: вручается в рамках форума. */
export function AwardLd({
  lang,
  deadline,
  ceremony,
  nominations = [],
}: {
  lang: Lang
  deadline?: string
  ceremony?: string
  nominations?: string[]
}) {
  const url = SITE + path(lang, '/award')
  const start = ceremony ? sameDayEnd(ceremony, 18) : '2026-12-09T18:00:00+02:00'
  return tag({
    '@context': 'https://schema.org',
    '@type': 'Event',
    '@id': url + '#event',
    name: SEO_COPY['/award'][lang].title,
    alternateName: 'Future Architecture Award 2026',
    description: SEO_COPY['/award'][lang].description,
    ...(nominations.length ? { keywords: nominations.join(', ') } : {}),
    startDate: start,
    endDate: sameDayEnd(start || '2026-12-09T', 21),
    eventStatus: 'https://schema.org/EventScheduled',
    eventAttendanceMode: 'https://schema.org/OfflineEventAttendanceMode',
    url,
    inLanguage: IN_LANG[lang],
    image: [SITE + ogImage('/award', lang)],
    location: VENUE,
    organizer: ORGANIZER,
    superEvent: { '@id': SITE + path(lang, '/forum') + '#event' },
    isAccessibleForFree: true,
    offers: {
      '@type': 'Offer',
      price: '0',
      priceCurrency: 'MDL',
      availability: 'https://schema.org/InStock',
      url: url + '#apply',
      validFrom: '2026-09-01T00:00:00+03:00',
      ...(deadline ? { validThrough: deadline } : {}),
    },
  })
}
