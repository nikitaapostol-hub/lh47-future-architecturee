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
      cfg = await payload.findGlobal({ slug: 'mail' })
    } catch {}

    const to = (cfg?.to || process.env.APPLICATIONS_EMAIL || 'marketing-team@lh47arch.com').trim()
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
      let a: any = cfg
      try {
        a = await payload.findGlobal({ slug: 'mail', locale })
      } catch {}
      const subject = a?.autoreplySubject || 'Заявка получена — Future Architecture'
      const body =
        a?.autoreplyBody ||
        'Здравствуйте!\n\nМы получили вашу заявку и вернёмся с ответом на этот адрес.\n\nFuture Architecture\nfuture-arch.md'
      await sendSafe(payload, { to: doc.email, subject, html: autoreplyHtml(body) })
    }
    return doc
  }
}

export const ForumApplications: CollectionConfig = {
  slug: 'forum-applications',
  labels: { singular: 'Заявка на форум', plural: 'Заявки — Форум' },
  admin: {
    useAsTitle: 'name',
    group: 'Заявки',
    defaultColumns: ['name', 'company', 'kind', 'email', 'status', 'submittedAt'],
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
    { name: 'company', type: 'text', label: 'Компания', required: true },
    { name: 'role', type: 'text', label: 'Позиция' },
    { name: 'kind', type: 'text', label: 'Тип обращения' },
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
  admin: {
    useAsTitle: 'name',
    group: 'Заявки',
    defaultColumns: ['name', 'company', 'role', 'email', 'status', 'submittedAt'],
    description: 'Форма на главной странице.',
  },
  access: inboxAccess,
  hooks: {
    afterChange: [
      notify('Заявка в сообщество', (d) => [
        { label: 'Имя', value: d.name },
        { label: 'Компания', value: d.company },
        { label: 'Позиция', value: d.role },
        { label: 'Почта', value: d.email },
        { label: 'Телефон', value: d.phone },
      ]),
    ],
  },
  fields: [
    { name: 'name', type: 'text', label: 'Имя', required: true },
    { name: 'company', type: 'text', label: 'Компания', required: true },
    { name: 'role', type: 'text', label: 'Позиция' },
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
  admin: {
    useAsTitle: 'name',
    group: 'Заявки',
    defaultColumns: ['name', 'org', 'track', 'nomination', 'status', 'submittedAt'],
    description: 'Форма на странице премии — премия отрасли и студенческий конкурс.',
  },
  access: inboxAccess,
  hooks: {
    afterChange: [
      notify('Заявка на премию', (d) => [
        { label: 'Имя', value: d.name },
        { label: 'Компания / вуз', value: d.org },
        { label: 'Куда подаёт', value: d.track },
        { label: 'Номинация', value: d.nomination },
        { label: 'Почта', value: d.email },
        { label: 'Телефон', value: d.phone },
        { label: 'Материалы', value: d.url },
        { label: 'О проекте', value: d.desc },
      ]),
    ],
  },
  fields: [
    { name: 'name', type: 'text', label: 'Имя и фамилия', required: true },
    { name: 'org', type: 'text', label: 'Компания / учебное заведение', required: true },
    { name: 'track', type: 'text', label: 'Куда подаёт' },
    { name: 'nomination', type: 'text', label: 'Номинация' },
    { name: 'email', type: 'email', label: 'Почта', required: true },
    { name: 'phone', type: 'text', label: 'Телефон' },
    { name: 'url', type: 'text', label: 'Ссылка на материалы' },
    { name: 'desc', type: 'textarea', label: 'Описание проекта' },
    STATUS,
    NOTE,
    ...META,
  ],
}
