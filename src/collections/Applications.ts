import type { CollectionConfig, Field } from 'payload'
import { autoreplyHtml, notifyHtml, sendSafe } from '@/lib/mail'
import type { MailRow } from '@/lib/mail'

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
}

const NOTE: Field = {
  name: 'note',
  type: 'textarea',
  label: 'Заметка команды',
  admin: { position: 'sidebar', description: 'Видна только в админке.' },
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

/** Общий обработчик: письмо команде + автоответ. */
function notify(title: string, rows: (doc: any) => MailRow[]) {
  return async ({ doc, operation, req }: any) => {
    if (operation !== 'create') return doc
    const payload = req.payload
    let cfg: any = {}
    try {
      cfg = await payload.findGlobal({ slug: 'settings' })
    } catch {}

    const to = (cfg?.mailTo || process.env.APPLICATIONS_EMAIL || 'marketing-team@lh47arch.com').trim()
    const prefix = cfg?.subjectPrefix || '[future-arch.md]'
    const who = doc?.name ? ' — ' + doc.name : ''

    const meta: MailRow[] = [
      { label: 'Язык', value: doc?.lang },
      { label: 'Страница', value: doc?.source },
      { label: 'UTM', value: doc?.utm },
    ]

    await sendSafe(payload, {
      to,
      subject: `${prefix} ${title}${who}`,
      html: notifyHtml(title, [...rows(doc), ...meta], 'Заявка сохранена в админке: future-arch.md/admin'),
      replyTo: doc?.email,
    })

    if (cfg?.autoreply !== false && doc?.email) {
      const locale = doc?.lang === 'ro' || doc?.lang === 'en' ? doc.lang : 'ru'
      const tr = (v: any) => (v && typeof v === 'object' ? String(v[locale] || v.ru || '').trim() : '')
      const subject = tr(cfg?.autoreplySubject) || 'Заявка получена — ARCH MAKERS'
      const body =
        tr(cfg?.autoreplyBody) ||
        'Здравствуйте!\n\nМы получили вашу заявку и вернёмся с ответом на этот адрес.\n\nARCH MAKERS\nfuture-arch.md'
      await sendSafe(payload, { to: doc.email, subject, html: autoreplyHtml(body) })
    }
    return doc
  }
}

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
    afterChange: [
      notify('Заявка на форум', (d) => [
        { label: 'Имя', value: d.name },
        { label: 'Компания', value: d.company },
        { label: 'Позиция', value: d.role },
        { label: 'Тип обращения', value: d.kind },
        { label: 'Почта', value: d.email },
        { label: 'Телефон', value: d.phone },
      ]),
    ],
  },
  fields: [
    { name: 'name', type: 'text', label: 'Имя', required: true },
    { name: 'company', type: 'text', label: 'Компания и должность', required: true },
    { name: 'role', type: 'text', label: 'Позиция', admin: { condition: (d: any) => Boolean(d?.role) } },
    { name: 'kind', type: 'text', label: 'Участник или партнёр' },
    { name: 'email', type: 'email', label: 'Почта', required: true },
    { name: 'phone', type: 'text', label: 'Телефон' },
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
    afterChange: [
      notify('Заявка в сообщество', (d) => [
        { label: 'Формат', value: d.track },
        { label: 'Имя', value: d.name },
        { label: 'Профессия', value: d.role },
        { label: 'Место работы', value: d.employment },
        { label: 'Компания', value: d.company },
        { label: 'Направление', value: d.field },
        { label: 'Сайт', value: d.website },
        { label: 'Почта', value: d.email },
        { label: 'Телефон', value: d.phone },
      ]),
    ],
  },
  fields: [
    { name: 'track', type: 'text', label: 'Формат участия', admin: { description: 'Резидент или партнёр.' } },
    { name: 'name', type: 'text', label: 'Имя / контактное лицо', required: true },
    { name: 'company', type: 'text', label: 'Компания' },
    { name: 'role', type: 'text', label: 'Профессия' },
    { name: 'employment', type: 'text', label: 'Работает на себя или в компании' },
    { name: 'field', type: 'text', label: 'Направление деятельности' },
    { name: 'website', type: 'text', label: 'Сайт' },
    { name: 'email', type: 'email', label: 'Почта', required: true },
    { name: 'phone', type: 'text', label: 'Телефон' },
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
    afterChange: [
      notify('Заявка на премию', (d) => [
        { label: 'Куда подаёт', value: d.track },
        { label: 'Номинация', value: d.nomination },
        { label: 'Проект', value: d.project },
        { label: 'Авторы', value: d.name },
        { label: 'Компания / вуз', value: d.org },
        { label: 'Факультет', value: d.faculty },
        { label: 'Год начала учёбы', value: d.studyStart },
        { label: 'Местоположение', value: d.location },
        { label: 'Площадь', value: d.area },
        { label: 'Год реализации', value: d.year },
        { label: 'Телефон', value: d.phone },
        { label: 'Почта', value: d.email },
        { label: 'Описание', value: d.desc },
        { label: 'Файлы', value: d.files },
        { label: 'Ссылка на материалы', value: d.url },
      ]),
    ],
  },
  fields: [
    { name: 'track', type: 'text', label: 'Куда подаёт' },
    { name: 'nomination', type: 'text', label: 'Номинация' },
    { name: 'project', type: 'text', label: 'Название проекта' },
    { name: 'name', type: 'text', label: 'Авторы / автор', required: true },
    { name: 'org', type: 'text', label: 'Компания / учебное заведение', required: true },
    { name: 'faculty', type: 'text', label: 'Факультет' },
    { name: 'studyStart', type: 'text', label: 'Год начала учёбы' },
    { name: 'location', type: 'text', label: 'Местоположение' },
    { name: 'area', type: 'text', label: 'Площадь' },
    { name: 'year', type: 'text', label: 'Год реализации' },
    { name: 'email', type: 'email', label: 'Почта' },
    { name: 'phone', type: 'text', label: 'Телефон' },
    { name: 'desc', type: 'textarea', label: 'Описание проекта' },
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
