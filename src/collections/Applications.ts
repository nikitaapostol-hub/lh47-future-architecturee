import type { CollectionBeforeOperationHook, CollectionConfig, Field } from 'payload'
import { APIError } from 'payload'
import { autoreplyHtml, notifyHtml, notifyText, sendSafe } from '@/lib/mail'
import type { MailRow, NotifyMail, Section } from '@/lib/mail'

/* Входящие заявки. Сайт пишет, админка читает.
   На создание записи уходит письмо команде и автоответ заявителю. */

const inboxAccess = {
  create: () => true, // публичный POST с формы
  read: ({ req }: any) => Boolean(req.user),
  update: ({ req }: any) => Boolean(req.user),
  delete: ({ req }: any) => Boolean(req.user),
}

const STATUS: Field = {
  name: 'status',
  type: 'select',
  label: 'Статус',
  defaultValue: 'new',
  options: [
    { label: '● Новая', value: 'new' },
    { label: '◐ В работе', value: 'progress' },
    { label: '✓ Принята', value: 'accepted' },
    { label: '× Отклонена', value: 'declined' },
  ],
  admin: { position: 'sidebar' },
  access: { create: ({ req }: any) => Boolean(req.user), update: ({ req }: any) => Boolean(req.user) },
}

const NOTE: Field = {
  name: 'note',
  type: 'textarea',
  label: 'Заметка команды',
  admin: { position: 'sidebar', description: 'Видна только в админке.' },
  access: { create: ({ req }: any) => Boolean(req.user), update: ({ req }: any) => Boolean(req.user) },
}

/* ——— Проверка того, что пришло с формы ———
   Форма проверяет поля в браузере, но запрос можно отправить и в обход неё,
   поэтому то же самое проверяется здесь. */

/** Пробелы по краям убираем, слишком длинное обрезаем — до записи в базу. */
const clean = (max: number) => ({ value }: any) =>
  typeof value === 'string' ? value.trim().replace(/\s{3,}/g, '  ').slice(0, max) : value

const PHONE_RE = /^\+?[\d\s().-]{7,20}$/
const phoneOk = (v: string) => PHONE_RE.test(v) && v.replace(/\D/g, '').length >= 8 && v.replace(/\D/g, '').length <= 15

/** Текстовое поле заявки: обрезка пробелов и длины. */
const txt = (name: string, label: string, opts: { required?: boolean; max?: number; area?: boolean; admin?: any } = {}): Field =>
  ({
    name,
    type: opts.area ? 'textarea' : 'text',
    label,
    ...(opts.required ? { required: true } : {}),
    maxLength: opts.max || 300,
    hooks: { beforeValidate: [clean(opts.max || 300)] },
    ...(opts.admin ? { admin: opts.admin } : {}),
  }) as Field

const PHONE = (required: boolean): Field =>
  ({
    name: 'phone',
    type: 'text',
    label: 'Телефон',
    ...(required ? { required: true } : {}),
    hooks: { beforeValidate: [clean(40)] },
    // строго — только для новых заявок с сайта; правка старой заявки в админке не блокируется
    validate: (v: any, o: any) => {
      if (o?.operation === 'update' || o?.req?.user) return true
      if (!v) return required ? 'Укажите телефон' : true
      return phoneOk(String(v)) || 'Проверьте номер телефона'
    },
  }) as Field

const EMAIL = (required: boolean): Field =>
  ({
    name: 'email',
    type: 'email',
    label: 'Почта',
    ...(required ? { required: true } : {}),
    hooks: { beforeValidate: [({ value }: any) => (typeof value === 'string' ? value.trim().toLowerCase() || undefined : value)] },
  }) as Field

/** Ловушка для ботов: невидимое поле hp заполняют только роботы. */
const honeypot: CollectionBeforeOperationHook = ({ args, operation, req }) => {
  if (operation === 'create' && !req.user) {
    const hp = (args?.data as any)?.hp
    if (typeof hp === 'string' && hp.trim()) throw new APIError('Bad request', 400)
  }
  return args
}

const META: Field[] = [
  {
    type: 'collapsible',
    label: 'Служебное',
    admin: { initCollapsed: true },
    fields: [
      {
        name: 'lang',
        type: 'text',
        label: 'Язык страницы',
        admin: { readOnly: true },
      },
      {
        name: 'source',
        type: 'text',
        label: 'Страница отправки',
        admin: { readOnly: true },
      },
      {
        name: 'utm',
        type: 'text',
        label: 'UTM-метки',
        admin: { readOnly: true },
      },
      {
        name: 'submittedAt',
        type: 'date',
        label: 'Отправлено',
        admin: { readOnly: true, date: { pickerAppearance: 'dayAndTime' } },
        hooks: {
          beforeChange: [
            ({ operation, value }: any) => (operation === 'create' ? new Date().toISOString() : value),
          ],
        },
      },
    ],
  },
]

/** Общий обработчик: письмо команде + автоответ.
    `section` — раздел сайта (цвет письма), `kind(doc)` — что это за заявка:
    «Форум (участник)», «Премия: …» — идёт в заголовок и тему письма.
    Имя, телефон и email выводятся в шапке письма, `rows` — остальные поля. */
function notify(slug: string, section: Section, kind: (doc: any) => string, rows: (doc: any) => MailRow[]) {
  return async ({ doc, operation, req }: any) => {
    if (operation !== 'create') return doc
    const payload = req.payload
    let cfg: any = {}
    try {
      cfg = await payload.findGlobal({ slug: 'settings', overrideAccess: true })
    } catch {}

    const to = String(cfg?.mailTo || process.env.APPLICATIONS_EMAIL || 'info@future-arch.md').trim()
    const prefix = String(cfg?.subjectPrefix || 'Future Architecture').trim()
    const who = doc?.name ? ' — ' + doc.name : ''
    const site = (process.env.NEXT_PUBLIC_SITE_URL || 'https://future-arch.md').replace(/\/$/, '')
    let when = ''
    try {
      when = new Intl.DateTimeFormat('ru-RU', {
        timeZone: 'Europe/Chisinau',
        day: 'numeric',
        month: 'long',
        hour: '2-digit',
        minute: '2-digit',
      }).format(new Date(doc?.submittedAt || doc?.createdAt || Date.now()))
    } catch {}

    const mail: NotifyMail = {
      section,
      kind: kind(doc),
      name: doc?.name || '',
      phone: doc?.phone || '',
      email: doc?.email || '',
      rows: rows(doc),
      meta: [
        { label: 'Язык', value: doc?.lang ? String(doc.lang).toUpperCase() : '' },
        { label: 'Страница', value: doc?.source ? site + doc.source : '' },
        { label: 'UTM', value: doc?.utm },
      ],
      adminUrl: `${site}/admin/collections/${slug}/${doc.id}`,
      when,
    }

    await sendSafe(payload, {
      to,
      subject: `${prefix} "Заявка — ${mail.kind}"${who}`,
      html: notifyHtml(mail),
      text: notifyText(mail),
      replyTo: doc?.email || undefined,
    })

    if (cfg?.autoreply !== false && doc?.email) {
      const locale = doc?.lang === 'ro' || doc?.lang === 'en' ? doc.lang : 'ru'
      const tr = (v: any) => (v && typeof v === 'object' ? String(v[locale] || v.ru || '').trim() : '')
      const subject = tr(cfg?.autoreplySubject) || 'Заявка получена — Future Architecture'
      const body =
        tr(cfg?.autoreplyBody) ||
        'Здравствуйте!\n\nМы получили вашу заявку и вернёмся с ответом на этот адрес.\n\nFuture Architecture\nfuture-arch.md'
      // ответ на автоответ попадёт в общий ящик
      await sendSafe(payload, {
        to: doc.email,
        subject,
        html: autoreplyHtml({ lang: locale, section, text: body }),
        text: body,
        replyTo: 'info@future-arch.md',
      })
    }
    return doc
  }
}

const low = (v: any) => String(v || '').trim().toLowerCase()

export const ForumApplications: CollectionConfig = {
  slug: 'forum-applications',
  labels: { singular: 'Заявка на форум', plural: 'Заявки — Форум' },
  defaultSort: '-submittedAt',
  admin: {
    hideAPIURL: true,
    useAsTitle: 'name',
    group: 'Заявки',
    listSearchableFields: ['name', 'email', 'company', 'phone'],
    defaultColumns: ['name', 'kind', 'company', 'phone', 'email', 'status', 'submittedAt'],
    description: 'Форма на странице форума.',
  },
  access: inboxAccess,
  hooks: {
    beforeOperation: [honeypot],
    afterChange: [
      notify(
        'forum-applications',
        'forum',
        (d) => 'Форум' + (/партн/.test(low(d.kind)) ? ' (партнёр)' : ' (участник)'),
        (d) => [
          { label: /партн/.test(low(d.kind)) ? 'Компания' : 'Компания и должность', value: d.company },
          { label: 'Позиция', value: d.role },
        ],
      ),
    ],
  },
  fields: [
    txt('name', 'Имя', { required: true, max: 120 }),
    txt('company', 'Компания и должность', { required: true, max: 200 }),
    txt('role', 'Позиция', { max: 200, admin: { condition: (d: any) => Boolean(d?.role) } }),
    txt('kind', 'Участник или партнёр', { max: 40 }),
    EMAIL(true),
    PHONE(true),
    STATUS,
    NOTE,
    ...META,
  ],
}

export const CommunityApplications: CollectionConfig = {
  slug: 'community-applications',
  labels: { singular: 'Заявка в сообщество', plural: 'Заявки — Сообщество' },
  defaultSort: '-submittedAt',
  admin: {
    hideAPIURL: true,
    useAsTitle: 'name',
    group: 'Заявки',
    listSearchableFields: ['name', 'email', 'company', 'phone'],
    defaultColumns: ['name', 'track', 'role', 'company', 'phone', 'status', 'submittedAt'],
    description: 'Форма на главной странице: резиденты и партнёры.',
  },
  access: inboxAccess,
  hooks: {
    beforeOperation: [honeypot],
    afterChange: [
      notify(
        'community-applications',
        'home',
        (d) => 'Сообщество' + (/партн/.test(low(d.track)) ? ' (партнёр)' : ' (резидент)'),
        (d) => [
          { label: 'Профессия', value: d.role },
          { label: 'Место работы', value: d.employment },
          { label: 'Компания', value: d.company },
          { label: 'Направление', value: d.field },
          { label: 'Сайт', value: d.website },
        ],
      ),
    ],
  },
  fields: [
    txt('track', 'Формат участия', { max: 40, admin: { description: 'Резидент или партнёр.' } }),
    txt('name', 'Имя / контактное лицо', { required: true, max: 120 }),
    txt('company', 'Компания', { max: 200 }),
    txt('role', 'Профессия', { max: 200 }),
    txt('employment', 'Работает на себя или в компании', { max: 60 }),
    txt('field', 'Направление деятельности', { max: 200 }),
    txt('website', 'Сайт', { max: 300 }),
    EMAIL(true),
    PHONE(true),
    STATUS,
    NOTE,
    ...META,
  ],
}

export const AwardApplications: CollectionConfig = {
  slug: 'award-applications',
  labels: { singular: 'Заявка на премию', plural: 'Заявки — Премия' },
  defaultSort: '-submittedAt',
  admin: {
    hideAPIURL: true,
    useAsTitle: 'name',
    group: 'Заявки',
    listSearchableFields: ['name', 'email', 'org', 'project', 'phone'],
    defaultColumns: ['name', 'track', 'nomination', 'project', 'phone', 'status', 'submittedAt'],
    description: 'Форма на странице премии — премия и студенческий конкурс.',
  },
  access: inboxAccess,
  hooks: {
    beforeOperation: [honeypot],
    afterChange: [
      notify(
        'award-applications',
        'award',
        (d) => (/студ/.test(low(d.track)) ? 'Студенческий конкурс' : 'Премия' + (d.nomination ? ': ' + d.nomination : '')),
        (d) => [
        { label: 'Проект', value: d.project },
        { label: 'Компания / вуз', value: d.org },
        { label: 'Факультет', value: d.faculty },
        { label: 'Год начала учёбы', value: d.studyStart },
        { label: 'Местоположение', value: d.location },
        { label: 'Площадь', value: d.area },
        { label: 'Год реализации', value: d.year },
        { label: 'Описание', value: d.desc },
        { label: 'Файлы', value: d.files },
        { label: 'Ссылка на материалы', value: d.url },
      ],
      ),
    ],
  },
  fields: [
    txt('track', 'Куда подаёт', { max: 60 }),
    txt('nomination', 'Номинация', { max: 200 }),
    txt('project', 'Название проекта', { max: 200 }),
    txt('name', 'Авторы / автор', { required: true, max: 300 }),
    txt('org', 'Компания / учебное заведение', { required: true, max: 200 }),
    txt('faculty', 'Факультет', { max: 200 }),
    txt('studyStart', 'Год начала учёбы', { max: 20 }),
    txt('location', 'Местоположение', { max: 200 }),
    txt('area', 'Площадь', { max: 60 }),
    txt('year', 'Год реализации', { max: 20 }),
    EMAIL(false),
    PHONE(true),
    txt('desc', 'Описание проекта', { area: true, max: 5000 }),
    {
      name: 'files',
      type: 'textarea',
      label: 'Файлы проекта',
      admin: { description: 'Имя файла и ссылка, по одному в строке. Файлы лежат в закрытом хранилище: ссылка открывается, только когда вы вошли в админку.' },
    },
    { name: 'url', type: 'text', label: 'Ссылка на материалы', admin: { condition: (d: any) => Boolean(d?.url) } },
    STATUS,
    NOTE,
    ...META,
  ],
}
