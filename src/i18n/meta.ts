import type { Metadata } from 'next'
import { LANGS, SITE, path } from './links'
import type { Lang } from './links'
import { getGlobal } from '@/lib/settings'

/** Ключи в глобале «SEO — заголовки и описания». */
const SEO_KEY: Record<Page, string> = { '/': 'home', '/forum': 'forum', '/award': 'award' }

/** Своя картинка для соцсетей на каждой странице. */
const OG_IMAGE: Record<Page, string> = {
  '/': '/og.png',
  '/forum': '/og-forum.png',
  '/award': '/og-award.png',
}

type SeoOverride = { title?: string; description?: string; image?: string }

async function seoFor(lang: Lang, page: Page): Promise<SeoOverride> {
  const g: any = await getGlobal('seo', lang)
  const k = SEO_KEY[page]
  const img = g?.[k + 'Image']
  return {
    title: typeof g?.[k + 'Title'] === 'string' && g[k + 'Title'].trim() ? g[k + 'Title'] : undefined,
    description:
      typeof g?.[k + 'Description'] === 'string' && g[k + 'Description'].trim()
        ? g[k + 'Description']
        : undefined,
    image: img && typeof img === 'object' && typeof img.url === 'string' ? img.url : undefined,
  }
}

type Page = '/' | '/forum' | '/award'

const COPY: Record<Page, Record<Lang, { title: string; description: string }>> = {
  '/': {
    ru: {
      title: 'ARCH MAKERS — сообщество архитекторов и дизайнеров Молдовы',
      description:
        'Профессиональное сообщество архитекторов, дизайнеров и представителей индустрий Молдовы: форум, премия, встречи ArchiMinds, журнал и поездки. Вступление по заявке.',
    },
    ro: {
      title: 'ARCH MAKERS — comunitatea arhitecților și designerilor din Moldova',
      description:
        'Comunitatea profesională a arhitecților, designerilor și reprezentanților industriilor din Moldova: forum, premiu, întâlniri ArchiMinds, revistă și călătorii. Aderare pe bază de cerere.',
    },
    en: {
      title: 'ARCH MAKERS — community of architects and designers in Moldova',
      description:
        'A professional community of architects, designers and industry representatives in Moldova: a forum, an award, ArchiMinds meetings, a magazine and trips. Membership by application.',
    },
  },
  '/forum': {
    ru: {
      title: 'ARCH MAKERS Forum 2026 — 9 декабря, Кишинёв',
      description:
        'Закрытая встреча тех, кто определяет будущее недвижимости Молдовы. Более 250 девелоперов, инвесторов, архитекторов и производителей. 9 декабря 2026, Range Rover Moldova. Участие по отбору.',
    },
    ro: {
      title: 'ARCH MAKERS Forum 2026 — 9 decembrie, Chișinău',
      description:
        'O întâlnire închisă a celor care definesc viitorul imobiliarelor din Moldova. Peste 250 de dezvoltatori, investitori, arhitecți și producători. 9 decembrie 2026, Range Rover Moldova. Participare pe bază de selecție.',
    },
    en: {
      title: 'ARCH MAKERS Forum 2026 — 9 December, Chișinău',
      description:
        'A closed meeting of the people shaping the future of real estate in Moldova. More than 250 developers, investors, architects and manufacturers. 9 December 2026, Range Rover Moldova. Attendance by selection.',
    },
  },
  '/award': {
    ru: {
      title: 'ARCH MAKERS Award 2026 — премия и студенческий конкурс',
      description:
        'Премия для архитекторов и дизайнеров в четырёх номинациях и студенческий конкурс. Заявки до 20 ноября, победителей объявят 9 декабря на сцене ARCH MAKERS Forum.',
    },
    ro: {
      title: 'ARCH MAKERS Award 2026 — premiu și concurs studențesc',
      description:
        'Premiu pentru arhitecți și designeri în patru nominalizări și un concurs studențesc. Cereri până pe 20 noiembrie, câștigătorii vor fi anunțați pe 9 decembrie pe scena ARCH MAKERS Forum.',
    },
    en: {
      title: 'ARCH MAKERS Award 2026 — award and student competition',
      description:
        'An award for architects and designers in four categories, plus a student competition. Applications until 20 November, winners announced on 9 December on stage at ARCH MAKERS Forum.',
    },
  },
}

const OG_LOCALE: Record<Lang, string> = { ru: 'ru_RU', ro: 'ro_MD', en: 'en_US' }

export async function meta(lang: Lang, page: Page): Promise<Metadata> {
  const base = COPY[page][lang]
  const over = await seoFor(lang, page)
  const c = { title: over.title || base.title, description: over.description || base.description }
  const image = over.image || OG_IMAGE[page]
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
      siteName: 'ARCH MAKERS',
      title: c.title,
      description: c.description,
      url,
      locale: OG_LOCALE[lang],
      alternateLocale: LANGS.filter((l) => l !== lang).map((l) => OG_LOCALE[l]),
      images: [{ url: image, width: 1200, height: 630, alt: c.title }],
    },
    twitter: {
      card: 'summary_large_image',
      title: c.title,
      description: c.description,
      images: [image],
    },
  }
}

const PRIVACY: Record<Lang, { title: string; description: string }> = {
  ru: {
    title: 'Политика обработки персональных данных · ARCH MAKERS',
    description:
      'Какие данные собирают формы сайта future-arch.md, зачем они нужны, сколько хранятся и как их удалить.',
  },
  ro: {
    title: 'Politica de prelucrare a datelor cu caracter personal · ARCH MAKERS',
    description:
      'Ce date colectează formularele site-ului future-arch.md, de ce sunt necesare, cât se păstrează și cum pot fi șterse.',
  },
  en: {
    title: 'Personal data processing policy · ARCH MAKERS',
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
      siteName: 'ARCH MAKERS',
      title: c.title,
      description: c.description,
      url: SITE + path(lang, '/privacy'),
      locale: OG_LOCALE[lang],
      images: [{ url: '/og.png', width: 1200, height: 630, alt: c.title }],
    },
  }
}
