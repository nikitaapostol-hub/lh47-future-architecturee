/* Микроразметка schema.org. Отдаётся сервером в <script type="application/ld+json">,
   поэтому её видят поисковики без выполнения JS. */
import { LANGS, SITE, path } from '@/i18n/links'
import type { Lang } from '@/i18n/links'

const ORG_ID = SITE + '/#organization'
const SITE_ID = SITE + '/#website'

function tag(data: unknown) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data).replace(/</g, '\\u003c') }}
    />
  )
}

/** Организация + сайт. Ставится на все страницы. */
export function OrgLd({ lang }: { lang: Lang }) {
  return tag({
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'Organization',
        '@id': ORG_ID,
        name: 'Future Architecture',
        url: SITE,
        logo: SITE + '/img/5dd2fe9c60.png',
        email: 'marketing@lh47arch.com',
        telephone: ['+37368199951', '+37368059311'],
        foundingDate: '2026',
        address: {
          '@type': 'PostalAddress',
          addressLocality: 'Chișinău',
          addressCountry: 'MD',
        },
        parentOrganization: { '@type': 'Organization', name: 'LH47 ARCH', url: 'https://lh47arch.com' },
      },
      {
        '@type': 'WebSite',
        '@id': SITE_ID,
        url: SITE,
        name: 'Future Architecture',
        inLanguage: LANGS,
        publisher: { '@id': ORG_ID },
      },
    ],
  })
}

/** Форум как событие: дата, площадка, организатор. */
export function ForumLd({ lang, startDate }: { lang: Lang; startDate?: string }) {
  return tag({
    '@context': 'https://schema.org',
    '@type': 'Event',
    name: 'Future Architecture Forum 2026',
    startDate: startDate || '2026-12-03T10:00:00+02:00',
    eventStatus: 'https://schema.org/EventScheduled',
    eventAttendanceMode: 'https://schema.org/OfflineEventAttendanceMode',
    url: SITE + path(lang, '/forum'),
    inLanguage: lang,
    maximumAttendeeCapacity: 250,
    description:
      'Закрытый отраслевой форум: инвесторы, девелоперы, архитекторы и производители за одним столом.',
    image: [SITE + '/img/5dd2fe9c60.png'],
    location: {
      '@type': 'Place',
      name: 'Range Rover Moldova',
      address: {
        '@type': 'PostalAddress',
        addressLocality: 'Chișinău',
        addressCountry: 'MD',
      },
    },
    organizer: { '@id': ORG_ID },
    performer: { '@id': ORG_ID },
    isAccessibleForFree: true,
    offers: {
      '@type': 'Offer',
      price: '0',
      priceCurrency: 'MDL',
      availability: 'https://schema.org/InStock',
      url: SITE + path(lang, '/forum') + '#apply',
    },
  })
}

/** Премия: вручается в рамках форума. */
export function AwardLd({ lang, deadline }: { lang: Lang; deadline?: string }) {
  return tag({
    '@context': 'https://schema.org',
    '@type': 'Event',
    name: 'Future Architecture Award 2026',
    startDate: '2026-12-03T18:00:00+02:00',
    eventStatus: 'https://schema.org/EventScheduled',
    eventAttendanceMode: 'https://schema.org/OfflineEventAttendanceMode',
    url: SITE + path(lang, '/award'),
    inLanguage: lang,
    description:
      'Премия отрасли и студенческий конкурс Future Architecture Award. Церемония проходит в рамках форума.',
    location: {
      '@type': 'Place',
      name: 'Range Rover Moldova',
      address: { '@type': 'PostalAddress', addressLocality: 'Chișinău', addressCountry: 'MD' },
    },
    organizer: { '@id': ORG_ID },
    ...(deadline ? { subjectOf: { '@type': 'CreativeWork', datePublished: deadline } } : {}),
  })
}
