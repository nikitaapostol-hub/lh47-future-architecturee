import path from 'path'
import { fileURLToPath } from 'url'
import { buildConfig } from 'payload'
import { postgresAdapter } from '@payloadcms/db-postgres'
import { lexicalEditor } from '@payloadcms/richtext-lexical'
import { nodemailerAdapter } from '@payloadcms/email-nodemailer'
import { ru } from '@payloadcms/translations/languages/ru'
import nodemailer from 'nodemailer'
import sharp from 'sharp'

import { Users } from './collections/Users'
import { Media } from './collections/Media'
import {
  ForumApplications,
  CommunityApplications,
  AwardApplications,
} from './collections/Applications'
import { ForumSettings, AwardSettings } from './globals/Settings'
import { Seo } from './globals/Seo'
import { Analytics } from './globals/Analytics'
import { Mail } from './globals/Mail'
import { buildGlobal } from './cms/build'
import { COMMON } from './cms/common'
import { HOME } from './cms/home'
import { FORUM } from './cms/forum'
import { AWARD } from './cms/award'

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
    defaultFromName: process.env.SMTP_FROM_NAME || 'Future Architecture',
    transport: nodemailer.createTransport({
      host,
      port,
      secure: port === 465,
      auth: { user: process.env.SMTP_USER || '', pass: process.env.SMTP_PASS || '' },
    }),
  })
}

export default buildConfig({
  admin: {
    user: Users.slug,
    importMap: { baseDir: path.resolve(dirname) },
    meta: { titleSuffix: '· Future Architecture' },
  },
  // Интерфейс админки на русском.
  i18n: { supportedLanguages: { ru }, fallbackLanguage: 'ru' },
  localization: {
    locales: [
      { label: 'Русский', code: 'ru' },
      { label: 'Română', code: 'ro' },
      { label: 'English', code: 'en' },
    ],
    defaultLocale: 'ru',
    fallback: true,
  },
  collections: [Users, Media, CommunityApplications, ForumApplications, AwardApplications],
  globals: [
    buildGlobal(COMMON),
    buildGlobal(HOME),
    buildGlobal(FORUM),
    buildGlobal(AWARD),
    ForumSettings,
    AwardSettings,
    Seo,
    Analytics,
    Mail,
  ],
  editor: lexicalEditor(),
  secret: process.env.PAYLOAD_SECRET || '',
  typescript: { outputFile: path.resolve(dirname, 'payload-types.ts') },
  db: postgresAdapter({
    // Vercel's Neon integration injects the connection string under its own
    // name, so accept the usual aliases rather than forcing a manual copy.
    pool: {
      connectionString:
        process.env.DATABASE_URI ||
        process.env.POSTGRES_URL ||
        process.env.DATABASE_URL ||
        '',
    },
  }),
  email: email(),
  sharp,
})
