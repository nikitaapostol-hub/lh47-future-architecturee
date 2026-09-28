import path from 'path'
import { fileURLToPath } from 'url'
import { buildConfig } from 'payload'
import { postgresAdapter } from '@payloadcms/db-postgres'
import { lexicalEditor } from '@payloadcms/richtext-lexical'
import { nodemailerAdapter } from '@payloadcms/email-nodemailer'
import { vercelBlobStorage } from '@payloadcms/storage-vercel-blob'
import { ru } from '@payloadcms/translations/languages/ru'
import nodemailer from 'nodemailer'
import sharp from 'sharp'

import { Users } from './collections/Users'
import { Media } from './collections/Media'
import { ForumApplications, CommunityApplications, AwardApplications } from './collections/Applications'
import { HomePage, ForumPage, AwardPage, CommonPage } from './globals/pages'
import { SiteSettings } from './globals/SiteSettings'

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)

/** SMTP берём из окружения. Нет настроек — Payload просто логирует письма,
    заявка при этом всё равно сохраняется в базе. */
function email() {
  const host = process.env.SMTP_HOST
  if (!host) return undefined
  const port = Number(process.env.SMTP_PORT || 465)
  return nodemailerAdapter({
    defaultFromAddress: process.env.SMTP_FROM || process.env.SMTP_USER || 'no-reply@lh47arch.com',
    defaultFromName: process.env.SMTP_FROM_NAME || 'ARCH MAKERS',
    transport: nodemailer.createTransport({
      host,
      port,
      secure: port === 465,
      auth: { user: process.env.SMTP_USER || '', pass: process.env.SMTP_PASS || '' },
    }),
  })
}

export default buildConfig({
  serverURL: process.env.NEXT_PUBLIC_SITE_URL || '',
  admin: {
    user: Users.slug,
    importMap: { baseDir: path.resolve(dirname) },
    meta: {
      titleSuffix: ' · ARCH MAKERS',
      icons: [{ rel: 'icon', type: 'image/svg+xml', url: '/icon.svg' }],
    },
    components: {
      graphics: {
        Logo: '/components/admin/Brand#Logo',
        Icon: '/components/admin/Brand#Icon',
      },
    },
    // Первый экран админки — один блок: новые заявки и ссылки на страницы.
    dashboard: {
      widgets: [
        { slug: 'welcome', label: 'ARCH MAKERS', Component: '/components/admin/Welcome#Welcome', minWidth: 'full', maxWidth: 'full' },
      ],
      defaultLayout: [{ widgetSlug: 'welcome', width: 'full' }],
    },
    dateFormat: 'dd.MM.yyyy, HH:mm',
  },
  // Интерфейс админки на русском.
  i18n: { supportedLanguages: { ru }, fallbackLanguage: 'ru' },
  // Языков сайта три, но переключатель в админке не нужен:
  // каждое поле хранит RU, RO и EN рядом (см. cms/build.ts → l3).
  collections: [CommunityApplications, ForumApplications, AwardApplications, Media, Users],
  globals: [HomePage, ForumPage, AwardPage, CommonPage, SiteSettings],
  editor: lexicalEditor(),
  secret: process.env.PAYLOAD_SECRET || '',
  typescript: { outputFile: path.resolve(dirname, 'payload-types.ts') },
  db: postgresAdapter({
    // Vercel's Neon integration injects the connection string under its own
    // name, so accept the usual aliases rather than forcing a manual copy.
    pool: {
      connectionString: process.env.DATABASE_URI || process.env.POSTGRES_URL || process.env.DATABASE_URL || '',
    },
  }),
  plugins: [
    // Фото спикеров и картинки для соцсетей — в публичное хранилище Vercel Blob
    // arch-makers-media. Файл идёт из браузера прямо в хранилище (clientUploads),
    // поэтому проходят и большие фото. Без токена (локально) — папка media.
    vercelBlobStorage({
      enabled: Boolean(process.env.MEDIA_READ_WRITE_TOKEN),
      collections: { media: true },
      token: process.env.MEDIA_READ_WRITE_TOKEN,
      clientUploads: true,
    }),
  ],
  email: email(),
  sharp,
})
