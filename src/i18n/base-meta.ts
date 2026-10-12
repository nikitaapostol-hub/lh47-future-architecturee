/* Общие мета-теги корневых layout-ов трёх языков: домен, иконки, имя приложения. */
import type { Metadata, Viewport } from 'next'
import type { Lang } from './links'
import { SITE } from './links'
import { BRAND } from './seo-defaults'

export function baseMeta(lang: Lang): Metadata {
  return {
    metadataBase: new URL(SITE),
    title: BRAND.name,
    description: BRAND.about[lang],
    applicationName: BRAND.name,
    appleWebApp: { title: BRAND.name },
    creator: 'LH47 ARCH',
    publisher: BRAND.name,
    formatDetection: { telephone: false, email: false, address: false },
    icons: {
      icon: [
        { url: '/favicon.ico', sizes: '48x48' },
        { url: '/icon.svg', type: 'image/svg+xml' },
      ],
      apple: '/apple-touch-icon.png',
    },
    manifest: '/site.webmanifest',
  }
}

export const baseViewport: Viewport = { themeColor: '#ffffff' }
