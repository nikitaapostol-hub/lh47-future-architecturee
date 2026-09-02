import type { Metadata } from 'next'
import { LANGS, SITE, path } from './links'
import type { Lang } from './links'

type Page = '/' | '/forum' | '/award'

const COPY: Record<Page, Record<Lang, { title: string; description: string }>> = {
  '/': {
    ru: {
      title: 'Future Architecture – профессиональное сообщество',
      description:
        'Закрытое сообщество архитекторов и дизайнеров Молдовы: восемь рабочих форматов, ежемесячные встречи ArchiMinds, форум и премия отрасли. Вступление по заявке и модерации.',
    },
    ro: {
      title: 'Future Architecture – comunitatea profesională',
      description:
        'Comunitate închisă a arhitecților și designerilor din Moldova: opt formate de lucru, întâlniri lunare ArchiMinds, forum și premiul industriei. Aderare pe bază de cerere și moderare.',
    },
    en: {
      title: 'Future Architecture – professional community',
      description:
        'A closed community of architects and designers in Moldova: eight working formats, monthly ArchiMinds meetings, a forum and an industry award. Membership by application and moderation.',
    },
  },
  '/forum': {
    ru: {
      title: 'Future Architecture Forum Moldova 2026',
      description:
        'Закрытый отраслевой форум 9 декабря 2026 в Кишинёве, площадка Range Rover Moldova. 250 участников: инвесторы, девелоперы, архитекторы и производители за одним столом. Участие по заявке и отбору, без взноса.',
    },
    ro: {
      title: 'Future Architecture Forum Moldova 2026',
      description:
        'Forum închis al industriei, 9 decembrie 2026, Chișinău, locație Range Rover Moldova. 250 de participanți: investitori, dezvoltatori, arhitecți și producători la aceeași masă. Participare pe bază de cerere și selecție, fără taxă.',
    },
    en: {
      title: 'Future Architecture Forum Moldova 2026',
      description:
        'A closed industry forum on 9 December 2026 in Chișinău, at Range Rover Moldova. 250 participants: investors, developers, architects and manufacturers at one table. Entry by application and selection, no fee.',
    },
  },
  '/award': {
    ru: {
      title: 'Future Architecture Award 2026 · Премия отрасли и студенческий конкурс',
      description:
        'Future Architecture Award 2026: премия отрасли для проектов, компаний и профессионалов и отдельный студенческий конкурс. Заявки до 20 ноября, победителей объявляют 9 декабря на форуме в Кишинёве.',
    },
    ro: {
      title: 'Future Architecture Award 2026 · Premiul industriei și concursul studențesc',
      description:
        'Future Architecture Award 2026: premiul industriei pentru proiecte, companii și profesioniști și un concurs separat pentru studenți. Cereri până pe 20 noiembrie, câștigătorii se anunță pe 9 decembrie la forumul din Chișinău.',
    },
    en: {
      title: 'Future Architecture Award 2026 · Industry award and student competition',
      description:
        'Future Architecture Award 2026: an industry award for projects, companies and professionals, plus a separate student competition. Applications until 20 November, winners announced on 9 December at the forum in Chișinău.',
    },
  },
}

const OG_LOCALE: Record<Lang, string> = { ru: 'ru_RU', ro: 'ro_MD', en: 'en_US' }

export function meta(lang: Lang, page: Page): Metadata {
  const c = COPY[page][lang]
  const url = SITE + path(lang, page)
  return {
    title: c.title,
    description: c.description,
    alternates: {
      canonical: path(lang, page),
      languages: {
        ...Object.fromEntries(LANGS.map((l) => [l, path(l, page)])),
        // ru — версия по умолчанию для всех прочих языков
        'x-default': path('ru', page),
      },
    },
    robots: {
      index: true,
      follow: true,
      googleBot: { index: true, follow: true, 'max-image-preview': 'large', 'max-snippet': -1 },
    },
    openGraph: {
      type: 'website',
      siteName: 'Future Architecture',
      title: c.title,
      description: c.description,
      url,
      locale: OG_LOCALE[lang],
      alternateLocale: LANGS.filter((l) => l !== lang).map((l) => OG_LOCALE[l]),
      images: [{ url: '/og.png', width: 1200, height: 630, alt: c.title }],
    },
    twitter: {
      card: 'summary_large_image',
      title: c.title,
      description: c.description,
      images: ['/og.png'],
    },
  }
}

const PRIVACY: Record<Lang, { title: string; description: string }> = {
  ru: {
    title: 'Политика обработки персональных данных · Future Architecture',
    description:
      'Какие данные собирают формы сайта future-arch.md, зачем они нужны, сколько хранятся и как их удалить.',
  },
  ro: {
    title: 'Politica de prelucrare a datelor cu caracter personal · Future Architecture',
    description:
      'Ce date colectează formularele site-ului future-arch.md, de ce sunt necesare, cât se păstrează și cum pot fi șterse.',
  },
  en: {
    title: 'Personal data processing policy · Future Architecture',
    description:
      'What data the forms on future-arch.md collect, why it is needed, how long it is kept and how to have it deleted.',
  },
}

export function privacyMeta(lang: Lang): Metadata {
  const c = PRIVACY[lang]
  return {
    title: c.title,
    description: c.description,
    alternates: {
      canonical: path(lang, '/privacy'),
      languages: {
        ...Object.fromEntries(LANGS.map((l) => [l, path(l, '/privacy')])),
        'x-default': path('ru', '/privacy'),
      },
    },
    robots: { index: true, follow: true },
    openGraph: {
      type: 'article',
      siteName: 'Future Architecture',
      title: c.title,
      description: c.description,
      url: SITE + path(lang, '/privacy'),
      locale: OG_LOCALE[lang],
      images: [{ url: '/og.png', width: 1200, height: 630, alt: c.title }],
    },
  }
}
