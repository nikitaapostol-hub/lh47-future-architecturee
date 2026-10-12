import type { Metadata } from 'next'
import { LANGS, SITE, path } from './links'
import type { Lang } from './links'
import { getGlobal } from '@/lib/settings'

/** Ключи в глобале «SEO — заголовки и описания». */
const SEO_KEY: Record<Page, string> = { '/': 'home', '/forum': 'forum', '/award': 'award' }


type SeoOverride = { title?: string; description?: string; image?: string }

async function seoFor(lang: Lang, page: Page): Promise<SeoOverride> {
  const g: any = await getGlobal('settings')
  const k = SEO_KEY[page]
  const s = g?.seo?.[k] || {}
  const tr = (v: any) => (v && typeof v === 'object' && typeof v[lang] === 'string' && v[lang].trim() ? v[lang].trim() : undefined)
  const img = s.image
  return {
    title: tr(s.title),
    description: tr(s.description),
    image: img && typeof img === 'object' && typeof img.url === 'string' ? img.url : undefined,
  }
}

import { SEO_COPY as COPY, ogImage } from './seo-defaults'
import type { SeoPage as Page } from './seo-defaults'

const OG_LOCALE: Record<Lang, string> = { ru: 'ru_RU', ro: 'ro_MD', en: 'en_US' }

export async function meta(lang: Lang, page: Page): Promise<Metadata> {
  const base = COPY[page][lang]
  const over = await seoFor(lang, page)
  const c = { title: over.title || base.title, description: over.description || base.description }
  const image = over.image || ogImage(page, lang)
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
      images: [{ url: image, width: 1200, height: 630, alt: c.title, type: over.image ? undefined : 'image/jpeg' }],
    },
    twitter: {
      card: 'summary_large_image',
      title: c.title,
      description: c.description,
      images: [{ url: image, alt: c.title }],
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
      images: [{ url: ogImage('/privacy', lang), width: 1200, height: 630, alt: c.title, type: 'image/jpeg' }],
    },
  }
}

const THANKS: Record<Lang, string> = {
  ru: 'Заявка отправлена · Future Architecture',
  ro: 'Cererea a fost trimisă · Future Architecture',
  en: 'Application sent · Future Architecture',
}

/** Страница «Спасибо»: в поиск не попадает. */
export function thanksMeta(lang: Lang): Metadata {
  return { title: THANKS[lang], robots: { index: false, follow: false } }
}
