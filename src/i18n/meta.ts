import type { Metadata } from 'next'
import { LANGS, path } from './links'
import type { Lang } from './links'

type Page = '/' | '/forum' | '/award'

const COPY: Record<Page, Record<Lang, { title: string; description: string }>> = {
  '/': {
    ru: {
      title: 'Future Architecture – профессиональное сообщество',
      description:
        'Future Architecture — профессиональное сообщество архитекторов, девелоперов и производителей Молдовы.',
    },
    ro: {
      title: 'Future Architecture – comunitatea profesională',
      description:
        'Future Architecture — comunitatea profesională a arhitecților, dezvoltatorilor și producătorilor din Moldova.',
    },
    en: {
      title: 'Future Architecture – professional community',
      description:
        'Future Architecture — a professional community of architects, developers and manufacturers in Moldova.',
    },
  },
  '/forum': {
    ru: {
      title: 'Future Architecture Forum Moldova 2026',
      description:
        'Закрытый форум для всей цепочки создания стоимости объекта: инвесторы, архитекторы, производители, управляющие компании.',
    },
    ro: {
      title: 'Future Architecture Forum Moldova 2026',
      description:
        'Forum închis pentru întregul lanț de creare a valorii: investitori, arhitecți, producători, companii de administrare.',
    },
    en: {
      title: 'Future Architecture Forum Moldova 2026',
      description:
        'A closed forum for the whole value chain of a building: investors, architects, manufacturers, management companies.',
    },
  },
  '/award': {
    ru: {
      title: 'Future Architecture Award 2026 · Премия отрасли и студенческий конкурс',
      description:
        'Премия Future Architecture Award 2026: номинации отрасли и студенческий конкурс.',
    },
    ro: {
      title: 'Future Architecture Award 2026 · Premiul industriei și concursul studențesc',
      description:
        'Future Architecture Award 2026: nominalizările industriei și concursul pentru studenți.',
    },
    en: {
      title: 'Future Architecture Award 2026 · Industry award and student competition',
      description:
        'Future Architecture Award 2026: industry categories and a competition for students.',
    },
  },
}

export function meta(lang: Lang, page: Page): Metadata {
  const c = COPY[page][lang]
  return {
    title: c.title,
    description: c.description,
    alternates: {
      canonical: path(lang, page),
      languages: Object.fromEntries(LANGS.map((l) => [l, path(l, page)])),
    },
    openGraph: { title: c.title, description: c.description, locale: lang },
  }
}
